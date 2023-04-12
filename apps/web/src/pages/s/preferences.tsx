import { withAuth, withSessionSsr } from "@rallly/backend/next";

import { getProfileLayout } from "@/components/layouts/profile-layout";
import Preferences from "@/components/preferences";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  return (
    <div className="p-4">
      <h2 className="mb-4">Preferences</h2>
      <Preferences />
    </div>
  );
};

Page.getLayout = getProfileLayout;

export const getServerSideProps = withSessionSsr([
  withAuth,
  withPageTranslations(["common", "app"]),
]);

export default Page;
