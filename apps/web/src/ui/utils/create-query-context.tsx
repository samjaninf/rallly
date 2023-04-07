import React from "react";

import { useRequiredContext } from "@/components/use-required-context";

export function createQueryContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  I extends Record<string, any> | void,
  T,
  R extends { data: T },
>(useQuery: (input: I) => R, displayName?: string) {
  const QueryContext = React.createContext<I | null>(null);
  QueryContext.displayName = displayName;
  function QueryContextProvider(
    props: React.PropsWithChildren<
      {
        fallback?: React.ReactNode;
      } & I
    >,
  ) {
    const { fallback, children, ...query } = props;

    const q = useQuery(query as I);

    if (q.data === undefined) {
      return <>{fallback}</>;
    }

    return (
      <QueryContext.Provider value={query as I}>
        {children}
      </QueryContext.Provider>
    );
  }

  function useQueryFromContext() {
    const context = useRequiredContext(QueryContext);
    return useQuery(context) as R & { data: NonNullable<T> };
  }

  function useDataFromContext() {
    return useQueryFromContext().data as NonNullable<R["data"]>;
  }

  return [
    React.memo(QueryContextProvider),
    useQueryFromContext,
    useDataFromContext,
  ] as const;
}
