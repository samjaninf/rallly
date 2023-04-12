import {
  AdjustmentsIcon,
  ChevronLeftIcon,
  SpinnerIcon,
  UserCircleIcon,
} from "@rallly/icons";
import clsx from "clsx";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import { useUser } from "@/components/user-provider";
import Logo from "~/logo.svg";

export const MobileNavigation = (props: { className?: string }) => {
  const { user } = useUser();
  const { t } = useTranslation(["common", "app"]);

  // React.useEffect(() => {
  //   const scrollHandler = () => {
  //     if (window.scrollY > 0) {
  //       setIsPinned(true);
  //     } else {
  //       setIsPinned(false);
  //     }
  //   };
  //   window.addEventListener("scroll", scrollHandler);
  //   return () => {
  //     window.removeEventListener("scroll", scrollHandler);
  //   };
  // }, []);

  const router = useRouter();
  const isPolls = router.pathname === "/polls";

  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(() => {
    const setBusy = () => setIsBusy(true);
    const setNotBusy = () => setIsBusy(false);
    router.events.on("routeChangeStart", setBusy);
    router.events.on("routeChangeComplete", setNotBusy);
    return () => {
      router.events.off("routeChangeStart", setBusy);
      router.events.off("routeChangeComplete", setNotBusy);
    };
  }, [router.events]);
  return (
    <div
      className={clsx(
        "relative z-40 flex w-full shrink-0 items-center justify-between py-2.5 px-2.5 sm:px-4",

        props.className,
      )}
    >
      <div className="flex h-9 items-center">
        <LayoutGroup>
          <AnimatePresence initial={false}>
            {isPolls ? null : (
              <m.div
                transition={{ duration: 0.1 }}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="mr-2"
              >
                <Link href="/polls" className="btn-default gap-2 font-semibold">
                  <ChevronLeftIcon className="h-5" />
                </Link>
              </m.div>
            )}
          </AnimatePresence>
          <m.div
            layout="position"
            transition={{ type: "spring", duration: 0.3 }}
          >
            <Logo className="text-primary-600 ml-2 h-5" />
          </m.div>
        </LayoutGroup>
        <AnimatePresence initial={false}>
          {isBusy ? (
            <m.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <SpinnerIcon className="ml-4 h-4 animate-spin" />
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/preferences" className="btn-default gap-2">
          <AdjustmentsIcon className="h-5" />
        </Link>
        <Link href="/profile" className="btn-default gap-2">
          <UserCircleIcon className="h-5" />
          {user.isGuest ? t("app:login") : user.shortName}
        </Link>
      </div>
    </div>
  );
};
