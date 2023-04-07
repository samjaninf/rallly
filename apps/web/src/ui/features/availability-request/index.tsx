import { trpc } from "@rallly/backend";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { useUser } from "@/components/user-provider";
import { useCurrentPollResponses } from "@/ui/contexts/current-event";
import { EventDetails } from "@/ui/features/availability-request/components/event-details";
import { NewResponse } from "@/ui/features/availability-request/new-response";

export function UserResponses() {
  const { data: responses = [] } = useCurrentPollResponses();
  const { user } = useUser();
  const userResponses = responses.filter(
    (response) => response.userId === user.id,
  );
  const router = useRouter();
  return (
    <div>
      <div className="text-green-500">
        {t("You've already responded to this poll.")}
      </div>
      <div>
        {userResponses.map((response) => {
          return (
            <div
              key={response.id}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>{response.name}</div>
              <div className="flex items-center gap-2">
                <Link href={`${router.asPath}/edit/${response.id}`}>
                  {t("edit")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <Link href={`${router.asPath}/new`}>Submit a new response</Link>
      </div>
    </div>
  );
}

export function Response() {
  const { data: responses = [] } = useCurrentPollResponses();
  const { user } = useUser();
  const { t } = useTranslation("app");
  const hasAlreadyResponded = responses.some((r) => r.userId === user.id);
  return (
    <div className="space-y-4">
      <div>
        <EventDetails />
      </div>
      {hasAlreadyResponded ? <UserResponses /> : <NewResponse />}
    </div>
  );
}
