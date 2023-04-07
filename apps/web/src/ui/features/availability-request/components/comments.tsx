import { ChatIcon } from "@rallly/icons";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";

import { useCurrentComments } from "@/ui/contexts/current-event";

export function Comments() {
  const { data: comments } = useCurrentComments();
  const { t } = useTranslation("app");

  if (!comments) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="font-semibold">{t("comments")}</div>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <div className="flex items-start gap-2">
              <div>
                <ChatIcon className="text-primary-600 mt-1 h-5" />
              </div>
              <div>
                <div className="text-slate-500">
                  {dayjs(comment.createdAt).fromNow()}
                </div>
                <div className="font-bold">{comment.authorName}</div>
                <div>{comment.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
