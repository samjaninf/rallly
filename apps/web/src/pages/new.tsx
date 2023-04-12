import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { CalendarIcon } from "@rallly/icons";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";

import CreatePoll from "@/components/create-poll";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";

import StandardLayout from "../components/layouts/standard-layout";
import { NextPageWithLayout } from "../types";
import { withPageTranslations } from "../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation("app");
  return (
    <>
      <Head>
        <title>{t("createNew")}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Breadcrumbs
        showBackButton={true}
        title={t("newPoll")}
        icon={CalendarIcon}
      />
      <CreatePoll />
    </>
  );
};

Page.getLayout = function getLayout(page) {
  return <StandardLayout>{page}</StandardLayout>;
};

export default Page;

export const getServerSideProps: GetServerSideProps = withSessionSsr([
  withAuthIfRequired,
  withPageTranslations(["common", "app"]),
]);
