import { domMax, LazyMotion } from "framer-motion";
import React from "react";

import { UserProvider } from "@/components/user-provider";
import { NextPageWithLayout } from "@/types";
import { CurrentEventContext } from "@/ui/contexts/current-event";
import { DayjsProvider } from "@/utils/dayjs";

export const AvailabilityRequestLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <React.Suspense fallback={null}>
      <CurrentEventContext role="participant">
        <DayjsProvider>
          <LazyMotion features={domMax}>
            <UserProvider>
              <div className="min-h-full bg-white lg:bg-gray-100 lg:p-24">
                <div className="lg:shadow-huge relative max-w-7xl divide-y bg-white lg:mx-auto lg:rounded-md lg:border">
                  <div className="p-6 lg:h-[800px] lg:overflow-auto">
                    {children}
                  </div>
                </div>
              </div>
            </UserProvider>
          </LazyMotion>
        </DayjsProvider>
      </CurrentEventContext>
    </React.Suspense>
  );
};

export const getAvailabilityRequestLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return <AvailabilityRequestLayout>{page}</AvailabilityRequestLayout>;
  };
