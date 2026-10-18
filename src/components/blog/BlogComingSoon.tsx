import ComingSoon from "@@/components/common/ComingSoon";
import { Routes } from "@@/constants/routes";

/** Public /blog while BLOG_ENABLED is off. */
export default function BlogComingSoon() {
  return (
    <ComingSoon
      icon="icon-folded-newspaper"
      title="Blog"
      subtitle="Dubbing, voice-over and sound notes from our Mumbai studio"
      href={Routes.BLOG}
      message="Our blog on dubbing, voice-over and sound"
      detail="Until then, see the films we have worked on or tell us about your project."
    />
  );
}
