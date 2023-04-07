import { Trans, useTranslation } from "next-i18next";

import { useCurrentEvent } from "@/ui/contexts/current-event";

export function EventDetails() {
  const { data: event } = useCurrentEvent();
  const { t } = useTranslation("app");
  return (
    <div className="prose">
      <h2 className="mb-0">{event?.title}</h2>
      <div className="text-slate-500">
        <Trans
          t={t}
          i18nKey="createdBy"
          values={{ name: event?.user?.name ?? t("guest") }}
          components={{ b: <span className="font-semibold" /> }}
        />
      </div>
      <p className="leading-relaxed">{event?.description}</p>
      <p>{event?.location}</p>
    </div>
  );
}
