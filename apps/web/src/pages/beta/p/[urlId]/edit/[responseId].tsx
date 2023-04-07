import { withSessionSsr } from "@rallly/backend/next";
import { GetServerSideProps } from "next";
import Head from "next/head";

import { NextPageWithLayout } from "@/types";
import { useCurrentEvent } from "@/ui/contexts/current-event";
import { EditResponsePage } from "@/ui/features/availability-request/edit-response/edit-response";
import { getAvailabilityRequestLayout } from "@/ui/features/availability-request/layout";
import { withPageTranslations } from "@/utils/with-page-translations";

const Meta = () => {
  const { data: event } = useCurrentEvent();
  return (
    <Head>
      <title>{event?.title}</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Meta />
      <EditResponsePage />
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
