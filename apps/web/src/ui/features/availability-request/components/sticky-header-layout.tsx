import Link from "next/link";
import { useRouter } from "next/router";

export function StickyHeaderLayout(
  props: React.PropsWithChildren<{
    header?: React.ReactNode;
    showBackButton?: boolean;
    title: string;
  }>,
) {
  const router = useRouter();
  return (
    <div>
      <div className="sticky top-0 border-b bg-white p-4">
        <div className="flex justify-between gap-4">
          <div>
            <h2>{props.title}</h2>
          </div>
        </div>
      </div>
      <div className="p-6">{props.children}</div>
    </div>
  );
}
