import { zodResolver } from "@hookform/resolvers/zod";
import type { VoteType } from "@rallly/database";
import { cn } from "@rallly/ui";
import { Badge } from "@rallly/ui/badge";
import { Button } from "@rallly/ui/button";
import { FormMessage } from "@rallly/ui/form";
import { Input } from "@rallly/ui/input";
import * as Sentry from "@sentry/nextjs";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import z from "zod";

import { usePoll } from "@/contexts/poll";
import { useTranslation } from "@/i18n/client";
import { useTimezone } from "@/lib/timezone/client/context";
import { useAddParticipantMutation } from "./poll/mutations";
import VoteIcon from "./poll/vote-icon";
import { useUser } from "./user-provider";

const requiredEmailSchema = z.object({
  requireEmail: z.literal(true),
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
});

const optionalEmailSchema = z.object({
  requireEmail: z.literal(false),
  name: z.string().trim().min(1).max(100),
  email: z.string().email().or(z.literal("")),
});

const schema = z.union([requiredEmailSchema, optionalEmailSchema]);

type NewParticipantFormData = z.infer<typeof schema>;

interface NewParticipantModalProps {
  votes: { optionId: string; type: VoteType }[];
  onSubmit?: (data: { id: string }) => void;
  onCancel?: () => void;
}

const VoteSummary = ({
  votes,
  className,
}: {
  className?: string;
  votes: { optionId: string; type: VoteType }[];
}) => {
  const { t } = useTranslation();
  const voteByType = votes.reduce<Record<VoteType, string[]>>(
    (acc, vote) => {
      acc[vote.type] = [...acc[vote.type], vote.optionId];
      return acc;
    },
    { yes: [], ifNeedBe: [], no: [] },
  );

  const voteTypes = Object.keys(voteByType) as VoteType[];

  return (
    <div
      className={cn("flex flex-wrap gap-1.5 rounded border p-1.5", className)}
    >
      {voteTypes.map((voteType) => {
        const votes = voteByType[voteType];
        const count = votes.length;
        if (count === 0) {
          return null;
        }
        return (
          <div
            key={voteType}
            className="flex h-8 select-none gap-2.5 rounded-lg border bg-gray-50 p-1 text-sm"
          >
            <div className="flex items-center gap-2">
              <VoteIcon type={voteType} />
              <div className="text-muted-foreground">{t(voteType)}</div>
            </div>
            <Badge>{voteByType[voteType].length}</Badge>
          </div>
        );
      })}
    </div>
  );
};

export const NewParticipantForm = (props: NewParticipantModalProps) => {
  const { t } = useTranslation();
  const poll = usePoll();

  const isEmailRequired = poll.requireParticipantEmail;
  const { timezone } = useTimezone();
  const { user, createGuestIfNeeded } = useUser();
  const isLoggedIn = user && !user.isGuest;
  const { register, setError, formState, handleSubmit } =
    useForm<NewParticipantFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        requireEmail: isEmailRequired,
        ...(isLoggedIn
          ? { name: user.name, email: user.email ?? "" }
          : {
              name: "",
              email: "",
            }),
      },
    });
  const addParticipant = useAddParticipantMutation();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await createGuestIfNeeded();
          const newParticipant = await addParticipant.mutateAsync({
            name: data.name,
            votes: props.votes,
            email: data.email,
            pollId: poll.id,
            timeZone: timezone,
          });
          props.onSubmit?.(newParticipant);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setError("root", {
              message: error.message,
            });
          }
          Sentry.captureException(error);
        }
      })}
      className="space-y-4"
    >
      <fieldset>
        <label htmlFor="name" className="mb-1 text-gray-500">
          {t("name")}
        </label>
        <Input
          className="w-full"
          data-1p-ignore="true"
          autoFocus={true}
          error={!!formState.errors.name}
          disabled={formState.isSubmitting}
          placeholder={t("namePlaceholder")}
          {...register("name")}
        />
        {formState.errors.name?.message ? (
          <div className="mt-2 text-rose-500 text-sm">
            {formState.errors.name.message}
          </div>
        ) : null}
      </fieldset>
      <fieldset>
        <label htmlFor="email" className="mb-1 text-gray-500">
          {t("email")}
          {!isEmailRequired ? ` (${t("optional")})` : null}
        </label>
        <Input
          className="w-full"
          error={!!formState.errors.email}
          disabled={formState.isSubmitting}
          placeholder={t("emailPlaceholder")}
          {...register("email")}
        />
        {formState.errors.email?.message ? (
          <div className="mt-1 text-rose-500 text-sm">
            {formState.errors.email.message}
          </div>
        ) : null}
      </fieldset>
      <fieldset>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: Fix this later */}
        <label className="mb-1 text-gray-500">{t("response")}</label>
        <VoteSummary votes={props.votes} />
      </fieldset>
      {formState.errors.root?.message ? (
        <FormMessage>{formState.errors.root.message}</FormMessage>
      ) : null}
      <div className="flex gap-2">
        <Button onClick={props.onCancel}>{t("cancel")}</Button>
        <Button
          type="submit"
          variant="primary"
          loading={formState.isSubmitting}
        >
          {t("submit")}
        </Button>
      </div>
    </form>
  );
};
