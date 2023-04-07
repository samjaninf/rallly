import { trpc } from "@rallly/backend";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button";
import {
  useCurrentEventId,
  useCurrentPollOptions,
  useCurrentPollResponses,
} from "@/ui/contexts/current-event";
import { AvailabilityForm } from "@/ui/features/availability-request/components/availability-form";
import { StickyHeaderLayout } from "@/ui/features/availability-request/components/sticky-header-layout";

export function EditResponsePage() {
  const router = useRouter();
  const responseId = router.query.responseId as string;
  const { data: responses = [] } = useCurrentPollResponses();
  const response = responses.find((r) => r.id === responseId);
  const pollId = useCurrentEventId();
  const { data: options = [] } = useCurrentPollOptions();

  const { t } = useTranslation("app");

  const updateVotes = trpc.polls.participants.update.useMutation();
  const deleteResponse = trpc.polls.participants.delete.useMutation();

  if (!response) return <div>Response not found</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{response.name}</h1>
        <div className="text-slate-500">Edit your response</div>
        <div>
          <Button
            loading={deleteResponse.isLoading}
            onClick={async () => {
              await deleteResponse.mutateAsync({
                pollId,
                participantId: responseId,
              });
              router.replace(`/beta/p/${router.query.urlId as string}`);
            }}
          >
            {t("delete")}
          </Button>
        </div>
      </div>
      <AvailabilityForm
        formId={`edit-${responseId}`}
        submitText={t("save")}
        defaultValues={{
          data: options.map((option) => ({
            optionId: option.id,
            type: response?.votes.find((v) => v.optionId === option.id)?.type,
          })),
        }}
        onSubmit={async ({ data }) => {
          await updateVotes.mutateAsync({
            pollId,
            participantId: responseId,
            votes: data.map((v) => ({ ...v, type: v.type ?? "no" })),
          });
        }}
      />
    </div>
  );
}
