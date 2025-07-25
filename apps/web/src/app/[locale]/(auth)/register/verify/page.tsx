import { Button } from "@rallly/ui/button";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trans } from "react-i18next/TransWithoutContext";

import { getTranslation } from "@/i18n/server";

import {
  AuthPageContainer,
  AuthPageContent,
  AuthPageDescription,
  AuthPageHeader,
  AuthPageTitle,
} from "../../components/auth-page";
import { OTPForm } from "./components/otp-form";

export default async function VerifyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { t } = await getTranslation(locale);
  const token = (await cookies()).get("registration-token")?.value;

  if (!token) {
    redirect("/register");
  }

  return (
    <AuthPageContainer>
      <AuthPageHeader>
        <AuthPageTitle>
          <Trans
            t={t}
            ns="app"
            i18nKey="registerVerifyTitle"
            defaults="Finish Registering"
          />
        </AuthPageTitle>
        <AuthPageDescription>
          <Trans
            t={t}
            ns="app"
            i18nKey="registerVerifyDescription"
            defaults="Check your email for the verification code"
          />
        </AuthPageDescription>
      </AuthPageHeader>
      <AuthPageContent>
        <OTPForm token={token} />
        <Button size="lg" variant="link" className="w-full" asChild>
          <Link href="/register">
            <Trans t={t} ns="app" i18nKey="back" defaults="Back" />
          </Link>
        </Button>
      </AuthPageContent>
    </AuthPageContainer>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getTranslation(params.locale);
  return {
    title: t("verifyEmail", {
      ns: "app",
      defaultValue: "Verify your email",
    }),
  };
}
