import Link from "next/link";
import { Routes } from "@@/constants/routes";

type BreadcrumbsProps = {
  current: string;
};

/** Glory-style page breadcrumbs: Home › current (current is not a link). */
export default function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ul className="breadcrumbs">
        <li>
          <Link href={Routes.HOME}>Home</Link>
        </li>
        <li aria-current="page">{current}</li>
      </ul>
    </nav>
  );
}
