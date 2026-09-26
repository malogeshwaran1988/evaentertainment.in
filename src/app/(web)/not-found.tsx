import type { Metadata } from "next";
import NotFoundContent from "@@/components/common/NotFoundContent";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found" },
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
