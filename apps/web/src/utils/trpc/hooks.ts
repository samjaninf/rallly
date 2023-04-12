import { trpc } from "@rallly/backend";
import { useRouter } from "next/router";

export const usePollByAdmin = () => {
  const router = useRouter();
  const adminUrlId = router.query.urlId as string;
  const pollQuery = trpc.polls.getByAdminUrlId.useQuery({ urlId: adminUrlId });

  return { ...pollQuery, data: pollQuery.data! };
};
