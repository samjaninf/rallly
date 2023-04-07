import { trpc } from "@rallly/backend";
import { VoteType } from "@rallly/database";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { useMethods } from "react-use";

import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";
import {
  useCurrentEventId,
  useCurrentPollOptions,
} from "@/ui/contexts/current-event";
import { AvailabilityForm } from "@/ui/features/availability-request/components/availability-form";
import { EventDetails } from "@/ui/features/availability-request/components/event-details";

type OptionSelection = { optionId: string; type?: VoteType }[];

type VotingFormData = {
  data: OptionSelection;
};

type ParticipantDetailsFormData = {
  name: string;
  email: string;
};

type ResponseWizardData = {
  step: "voting" | "summary";
  votingFormData: VotingFormData;
  participantDetailsFormData: ParticipantDetailsFormData;
};

function createMethods(state: ResponseWizardData) {
  return {
    continue: (votingFormData: VotingFormData) => ({
      ...state,
      step: "summary" as const,
      votingFormData,
    }),
    back: () => ({ ...state, step: "voting" as const }),
  };
}

export function NewResponse() {
  const pollId = useCurrentEventId();
  const { data: options = [] } = useCurrentPollOptions();

  const router = useRouter();
  const [state, methods] = useMethods(createMethods, {
    step: "voting",
    votingFormData: {
      data: options.map((option) => ({ optionId: option.id })),
    },
    participantDetailsFormData: { name: "", email: "" },
  });

  const addParticipant = trpc.polls.participants.add.useMutation();

  const { t } = useTranslation("app");

  return (
    <div className="space-y-6">
      {(() => {
        switch (state.step) {
          case "voting":
            return (
              <AvailabilityForm
                submitText={t("continue")}
                formId={state.step}
                defaultValues={state.votingFormData}
                onSubmit={(data) => {
                  methods.continue(data);
                }}
              />
            );
          case "summary":
            return (
              <Summary
                onBack={methods.back}
                formId={state.step}
                onSubmit={async (data) => {
                  await addParticipant.mutateAsync({
                    pollId,
                    name: data.name,
                    email: data.email,
                    votes: state.votingFormData?.data.map((vote) => ({
                      optionId: vote.optionId,
                      type: vote.type ?? "no",
                    })),
                  });
                  router.replace(`/beta/p/${router.query.urlId as string}`);
                }}
              />
            );
        }
      })()}
    </div>
  );
}

function Summary(props: {
  formId: string;
  onBack: () => void;
  onSubmit: (data: ParticipantDetailsFormData) => Promise<void>;
}) {
  const { t } = useTranslation("app");
  const { handleSubmit, formState, register } =
    useForm<ParticipantDetailsFormData>();
  return (
    <div>
      <form
        id={props.formId}
        onSubmit={handleSubmit(props.onSubmit)}
        className="mx-auto max-w-lg space-y-6"
      >
        <div className="grow space-y-4">
          <div>
            <Button onClick={props.onBack}>{t("back")}</Button>
            <h2 className="font-semibold">Summary</h2>
            <p>Enter your details to submit your selected times.</p>
          </div>
          <div>
            <label>{t("name")}</label>
            <TextInput
              placeholder={t("namePlaceholder")}
              className="w-full"
              {...register("name")}
            />
          </div>
          <div>
            <label>{t("email")}</label>
            <TextInput
              placeholder={t("emailPlaceholder")}
              className="w-full"
              {...register("email")}
            />
          </div>
        </div>
        <Button
          loading={formState.isSubmitting}
          type="primary"
          htmlType="submit"
        >
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
