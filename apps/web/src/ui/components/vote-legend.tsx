import { useTranslation } from "next-i18next";

import VoteIcon from "@/components/poll/vote-icon";

export const VoteLegend = () => {
  const { t } = useTranslation("app");
  return (
    <div className="flex items-center space-x-3">
      <span className="inline-flex shrink-0 items-center space-x-1">
        <VoteIcon type="yes" />
        <span>{t("yes")}</span>
      </span>
      <span className="inline-flex shrink-0 items-center space-x-1">
        <VoteIcon type="ifNeedBe" />
        <span>{t("ifNeedBe")}</span>
      </span>
      <span className="inline-flex shrink-0 items-center space-x-1">
        <VoteIcon type="no" />
        <span>{t("no")}</span>
      </span>
    </div>
  );
};
