import { trpcNextApiHandler } from "@rallly/backend/next/trpc/server";

export const config = {
  runtime: "edge",
  api: {
    externalResolver: true,
  },
};
// export API handler
export default trpcNextApiHandler;
