"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@@/constants/routes";

/** Sitewide booking CTA (“Need a Quality Sound?”) — links to /book. */
export default function BookingCta() {
  const pathname = usePathname();
  if (pathname === Routes.BOOK) return null;

  return (
    <div className="block eva-mb-80 booking-cta">
      <div className="container">
        <div className="row clearfix">
          <div className="col-md-8">
            <div className="text-xs-center text-sm-center">
              <h2>
                Need a <span>Quality</span> Sound?
              </h2>
              <p className="p--lg text-left">
                We deliver the very best service and amenities signed artists
                and independent Sound Studio.
              </p>
            </div>
          </div>
          <div className="divider visible-sm visible-xs" />
          <div className="col-md-4">
            <div className="text-center">
              <div className="btn-wrap">
                <Link href={Routes.BOOK} className="btn btn--lg">
                  <span>
                    <i className="icon-mic-3" aria-hidden="true" />
                    Book session now
                  </span>
                </Link>
                <p className="p--sm">
                  And get a one recording hour for{" "}
                  <span className="theme-color">
                    <b>FREE</b>
                  </span>
                  *
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
