import Header from "@@/components/common/Header";
import Footer from "@@/components/common/Footer";
import BookingCta from "@@/components/common/BookingCta";
import GoToTopButton from "@@/components/common/GoToTopButton";
import BodyClass from "@@/components/common/BodyClass";

/** Shared chrome for all public `(web)` routes — single Header mount. */
export default function WebLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <BodyClass />
      <Header />
      <div className="flex-1">{children}</div>
      <BookingCta />
      <GoToTopButton />
      <Footer />
    </div>
  );
}
