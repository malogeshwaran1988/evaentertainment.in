import type { Metadata } from "next";
import { STATUS_PAGE_ROBOTS } from "@@/lib/seo";
import NotFoundContent from "@@/components/common/NotFoundContent";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found" },
  description: "The page you are looking for does not exist.",
  robots: STATUS_PAGE_ROBOTS,
};

export default function NotFound() {
  return <NotFoundContent />;
}
