import { withSessionSsr } from "@rallly/backend/next";
import { GetServerSideProps } from "next";
import Head from "next/head";

import { useCurrentEvent } from "@/ui/contexts/current-event";
import { Response } from "@/ui/features/availability-request";
import { getAvailabilityRequestLayout } from "@/ui/features/availability-request/layout";
import { withPageTranslations } from "@/utils/with-page-translations";

import { NextPageWithLayout } from "../../../types";

const Meta = () => {
  const { data: event } = useCurrentEvent();
  return (
    <Head>
      <title>{event?.title}</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
  );
};

const Page: NextPageWithLayout<{
  forceUserId: string | null;
}> = () => {
  return (
    <>
      <Meta />
      <Response />
    </>
  );
};

Page.getLayout = getAvailabilityRequestLayout;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  withPageTranslations(["common", "app", "errors"]),
  {
    onPrefetch: async (ssg, ctx) => {
      const pollId = await ssg.polls.exchangeId.fetch({
        urlId: ctx.query.urlId as string,
        role: "participant",
      });

      await ssg.polls.get.prefetch({
        pollId,
      });

      await ssg.polls.options.list.prefetch({
        pollId,
      });
    },
  },
);

export default Page;
