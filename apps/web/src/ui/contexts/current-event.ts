import { trpc, UserRole } from "@rallly/backend";
import { useRouter } from "next/router";
import React from "react";

import { useUserPreferences } from "@/ui/contexts/user-preferences";
import { createQueryContext } from "@/ui/utils/create-query-context";
import { useDayjs } from "@/utils/dayjs";

export const [CurrentEventContext, useCurrentEventQuery, useCurrentEventId] =
  createQueryContext((input: { role: UserRole }) => {
    const router = useRouter();
    const urlId = router.query.urlId as string;
    return trpc.polls.exchangeId.useQuery({
      urlId,
      role: input.role,
    });
  }, "PollId");

export const useCurrentPollResponses = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.participants.list.useQuery({ pollId });
};

export const useCurrentEvent = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.get.useQuery({ pollId });
};

export const useCurrentComments = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.comments.list.useQuery({ pollId });
};

export const useCurrentPollOptions = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.options.list.useQuery({ pollId });
};

export const useDateFormatter = () => {
  const { dayjs } = useDayjs();
  const { preferredTimeZone } = useUserPreferences();
  const { data: event } = useCurrentEvent();

  return React.useCallback(
    (date: string | number | Date, format: string) => {
      let d = dayjs(date).utc();
      if (event?.timeZone) {
        d = d.tz(event.timeZone, true).tz(preferredTimeZone);
      }
      return d.format(format);
    },
    [dayjs, event?.timeZone, preferredTimeZone],
  );
};
