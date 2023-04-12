import { ShareIcon } from "@rallly/icons";
import { useTranslation } from "next-i18next";
import React from "react";

import { Button } from "@/components/button";

import { useParticipants } from "./participants-provider";
import ManagePoll from "./poll/manage-poll";
import NotificationsToggle from "./poll/notifications-toggle";

export const AdminControls = () => {
  const { t } = useTranslation("app");

  const { participants } = useParticipants();

  const [isSharingVisible, setIsSharingVisible] = React.useState(
    participants.length === 0,
  );

  return (
    <div className="flex gap-2">
      <NotificationsToggle />
      <ManagePoll placement="bottom-end" />
      <Button
        type="primary"
        icon={<ShareIcon />}
        onClick={() => {
          setIsSharingVisible(!isSharingVisible);
        }}
      >
        {t("share")}
      </Button>
    </div>
  );
};
