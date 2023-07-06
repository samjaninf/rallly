import { trpc } from "@rallly/backend";

import { isSelfHosted } from "@/utils/constants";

export const usePlan = () => {
  const { data } = trpc.user.getBilling.useQuery(undefined, {
    staleTime: 10 * 1000,
  });

  const isPaid =
    isSelfHosted || Boolean(data && data.endDate.getTime() > Date.now());

  return isPaid ? "paid" : "free";
};
