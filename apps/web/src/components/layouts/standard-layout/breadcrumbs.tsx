import { ChevronLeftIcon } from "@rallly/icons";
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export function Breadcrumbs(props: {
  title?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  pageControls?: React.ReactNode;
}) {
  const { icon: Icon } = props;
  return (
    <div
      className={clsx(
        "sticky top-0 z-30",
        "border-b bg-gray-100/90 backdrop-blur-md",
        "px-2.5 py-2.5 sm:px-4",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-9 min-w-0 items-center gap-3 px-2">
          {Icon ? (
            <div>
              <Icon className="h-6" />
            </div>
          ) : null}
          {typeof props.title === "string" ? (
            <h1 className="items-center gap-4 truncate text-base">
              {props.title}
            </h1>
          ) : (
            props.title
          )}
        </div>
        {props.pageControls ? (
          <div className="justify-end sm:flex">{props.pageControls}</div>
        ) : null}
      </div>
    </div>
  );
}
