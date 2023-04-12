import { AdjustmentsIcon, LogoutIcon, UserIcon } from "@rallly/icons";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import StandardLayout from "@/components/layouts/standard-layout";

import { NextPageWithLayout } from "../../types";
import { useUser } from "../user-provider";

const MenuItem = (props: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx("btn-default gap-2", {
        "text-primary-600 pointer-events-none": router.asPath === props.href,
      })}
    >
      <props.icon className="h-5" />
      {props.title}
    </Link>
  );
};

const ProfileLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => {
  const { t } = useTranslation("app");
  const { user } = useUser();
  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <div className="">
          <div
            className={clsx(
              "grid grid-cols-1 gap-4 p-4 sm:grid-cols-2",
              "shadow-s bg-gray-100 p-4",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-400/50 bg-gray-300/50 shadow-sm">
                <UserIcon className="h-6 text-gray-800" />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <div
                    data-testid="user-name"
                    className="mb-0 text-lg font-semibold leading-tight"
                  >
                    {user.shortName}
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  Registered a few days ago
                </div>
              </div>
            </div>
            <div className="sm:text-right">
              <Link href="/logout" className="btn-default gap-2">
                <LogoutIcon className="h-5" />
                {t("logout")}
              </Link>
            </div>
          </div>
          <div className="sticky top-0 flex gap-2 border-y bg-white p-2.5">
            <MenuItem href="/profile" icon={UserIcon} title={t("profile")} />
            <MenuItem
              href="/preferences"
              icon={AdjustmentsIcon}
              title={t("preferences")}
            />
          </div>
          <div className="mx-auto max-w-lg p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;

export const getProfileLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return (
      <StandardLayout>
        <ProfileLayout>{page}</ProfileLayout>
      </StandardLayout>
    );
  };
