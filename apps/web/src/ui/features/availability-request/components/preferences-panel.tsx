import { trpc } from "@rallly/backend";
import languages from "@rallly/languages";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import TimeZonePicker from "@/components/time-zone-picker";
import { useUserPreferences } from "@/ui/contexts/user-preferences";

export function PreferencesPanel() {
  const { t } = useTranslation("app");
  const router = useRouter();

  const queryClient = trpc.useContext();

  const preferences = useUserPreferences();
  const updatePreferences = trpc.user.preferences.update.useMutation({
    meta: {
      doNotInvalidate: true,
    },
    onMutate: (newPreferences) => {
      queryClient.user.preferences.get.setData(
        undefined,
        (existingPreferences) => ({
          ...existingPreferences,
          ...newPreferences,
        }),
      );
    },
  });

  const resetPreferences = trpc.user.preferences.reset.useMutation({
    meta: {
      doNotInvalidate: true,
    },
    onMutate: () => {
      queryClient.user.preferences.get.setData(undefined, {});
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button>Preferences</Button>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <form>
          <fieldset>
            <label>{t("language")}</label>
            <select
              value={preferences.language}
              onChange={async (e) => {
                await updatePreferences.mutateAsync({
                  language: e.target.value as any,
                });
                Cookies.set("NEXT_LOCALE", e.target.value, {
                  expires: 365,
                });
                router.reload();
              }}
            >
              {Object.entries(languages).map(([code, language]) => (
                <option key={code} value={code}>
                  {language}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <label>{t("preferences")}</label>
            <TimeZonePicker
              value={preferences.preferredTimeZone}
              onChange={(newTimeZone) => {
                updatePreferences.mutate({ preferredTimeZone: newTimeZone });
              }}
            />
          </fieldset>
          <fieldset>
            <label>{t("timeFormat")}</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => {
                updatePreferences.mutate({ timeFormat: e.target.value as any });
              }}
            >
              <option value="12h">{t("12h")}</option>
              <option value="24h">{t("24h")}</option>
            </select>
          </fieldset>
          <fieldset>
            <label>{t("weekStartsOn")}</label>
            <select
              value={preferences.weekStart}
              onChange={(e) => {
                updatePreferences.mutate({
                  weekStart: parseInt(e.target.value as any),
                });
              }}
            >
              <option value={0}>{t("sunday")}</option>
              <option value={1}>{t("monday")}</option>
            </select>
          </fieldset>
          {preferences.isDirty ? (
            <Button
              onClick={() => {
                resetPreferences.mutate();
              }}
            >
              {t("reset")}
            </Button>
          ) : null}
        </form>
      </PopoverContent>
    </Popover>
  );
}
