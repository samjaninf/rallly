import { SettingsIcon } from "lucide-react";
import { PageIcon } from "@/app/components/page-icons";
import { requireAdmin } from "@/auth/data";
import {
  FullWidthLayout,
  FullWidthLayoutContent,
  FullWidthLayoutHeader,
  FullWidthLayoutTitle,
} from "@/components/full-width-layout";
import { Trans } from "@/components/trans";
import { getInstanceSettings } from "@/features/instance-settings/queries";
import { InstanceSettingsForm } from "./instance-settings-form";

async function loadData() {
  const [instanceSettings] = await Promise.all([
    getInstanceSettings(),
    requireAdmin(),
  ]);

  return {
    instanceSettings,
  };
}

export default async function SettingsPage() {
  const { instanceSettings } = await loadData();

  return (
    <FullWidthLayout>
      <FullWidthLayoutHeader>
        <FullWidthLayoutTitle
          icon={
            <PageIcon size="sm" color="darkGray">
              <SettingsIcon />
            </PageIcon>
          }
        >
          <Trans i18nKey="settings" defaults="Settings" />
        </FullWidthLayoutTitle>
      </FullWidthLayoutHeader>
      <FullWidthLayoutContent>
        <InstanceSettingsForm defaultValue={instanceSettings} />
      </FullWidthLayoutContent>
    </FullWidthLayout>
  );
}
