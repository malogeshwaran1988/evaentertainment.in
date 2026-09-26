import Link from "next/link";
import { Button } from "@@/components/ui/button";
import { AdminRoutes } from "@@/lib/admin-session";

export default function AdminNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="text-sm text-muted-foreground">
        This item doesn’t exist or was deleted.
      </p>
      <Button asChild variant="outline">
        <Link href={AdminRoutes.PROJECTS}>Back to Our Projects</Link>
      </Button>
    </div>
  );
}
