import { withSessionSsr } from "@rallly/backend/next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { NextPageWithLayout } from "@/types";

import { AuthLayout } from "../components/auth/auth-layout";
import { RegisterForm } from "../components/auth/login-form";
import { withPageTranslations } from "../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation("app");
  const router = useRouter();
  return (
    <AuthLayout>
      <Head>
        <title>{t("register")}</title>
      </Head>
      <RegisterForm
        onRegistered={() => {
          router.replace("/profile");
        }}
      />
    </AuthLayout>
  );
};

export const getServerSideProps = withSessionSsr(
  withPageTranslations(["common", "app"]),
);

export default Page;
