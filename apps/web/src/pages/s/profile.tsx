import { withAuth, withSessionSsr } from "@rallly/backend/next";

import { getProfileLayout } from "@/components/layouts/profile-layout";

import { Profile } from "../../components/profile";
import { NextPageWithLayout } from "../../types";
import { withPageTranslations } from "../../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  return <Profile />;
};

Page.getLayout = getProfileLayout;

export const getServerSideProps = withSessionSsr([
  withAuth,
  withPageTranslations(["common", "app"]),
]);

export default Page;
