import { trpc } from "@rallly/backend";
import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import {
  CalendarIcon,
  ChartSquareBarIcon,
  ChatIcon,
  LockClosedIcon,
  PlusIcon,
  SearchIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@rallly/icons";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";
import { useDayjs } from "@/utils/dayjs";

import StandardLayout from "../components/layouts/standard-layout";
import { NextPageWithLayout } from "../types";
import { withPageTranslations } from "../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation("app");
  const { data: polls = [] } = trpc.polls.list.useQuery();
  const { dayjs } = useDayjs();
  return (
    <>
      <Head>
        <title>{t("myPolls")}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Breadcrumbs
        icon={ViewGridIcon}
        title={<div className="font-semibold">{t("myPolls")}</div>}
        pageControls={
          <div>
            <Link href="/new" className="btn-default gap-2">
              <PlusIcon className="h-5" />
              {t("createNew")}
            </Link>
          </div>
        }
      />
      <div className="p-4">
        <div className="overflow-hidden rounded-md border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-100 p-2.5">
            <div className="px-1.5 font-semibold">{polls.length} polls</div>
            <div>
              <Button icon={<SearchIcon />} />
            </div>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2">
            {polls.map((poll) => {
              return (
                <Link
                  href={`/admin/${poll.adminUrlId}`}
                  className={clsx(
                    "overflow-hidden rounded border bg-white p-2.5 sm:px-3 sm:py-2.5",
                    "hover:border-primary-200 hover:bg-gray-50 hover:shadow",
                    "active:bg-gray-100 active:shadow-none",
                    "flex flex-col items-start gap-2.5 sm:flex-row",
                  )}
                  key={poll.id}
                >
                  <div className="flex justify-between">
                    <div>
                      <ChartSquareBarIcon className="text-primary-600 h-6 sm:h-8" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="">
                      <div className="block truncate font-semibold">
                        {poll.title}
                      </div>
                      <div className="text-slate-500">
                        {dayjs(poll.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>
                  <div className="flex grow gap-2 sm:justify-end">
                    <div className="flex items-center gap-2 px-1.5 text-slate-500">
                      <UserGroupIcon className="h-5" />
                      {poll.participants.length}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <ChatIcon className="h-5" />
                      {poll.comments.length}
                    </div>
                    {poll.closed ? (
                      <div className="flex items-center gap-2 rounded bg-rose-50 px-1.5 text-rose-500">
                        <LockClosedIcon className="h-5" />
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page) {
  return <StandardLayout>{page}</StandardLayout>;
};

export default Page;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  [withAuthIfRequired, withPageTranslations(["common", "app"])],
  {
    onPrefetch: async (ssg) => {
      await ssg.polls.list.prefetch();
    },
  },
);
