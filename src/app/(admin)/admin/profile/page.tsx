import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import PageHeader from "@@/components/admin/ui/PageHeader";
import { Avatar, AvatarFallback } from "@@/components/ui/avatar";
import { Button } from "@@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/components/ui/card";
import { Separator } from "@@/components/ui/separator";
import { requireAdmin } from "@@/lib/admin-auth";
import { logoutAction } from "../../login/actions";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-xl">
      <PageHeader title="Profile" />
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-14 w-14 rounded-xl">
            <AvatarFallback className="rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
              {session.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{session.username}</CardTitle>
            <CardDescription>Administrator</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <dl className="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">Username</dt>
            <dd className="font-medium">{session.username}</dd>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium">Administrator</dd>
            <dt className="text-muted-foreground">Access</dt>
            <dd className="font-medium">Our Projects</dd>
          </dl>
          <p className="text-sm text-muted-foreground">
            The login is set on the server (ADMIN_USERNAME / ADMIN_PASSWORD) and
            can’t be changed here.
          </p>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              <LogOut />
              Log out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
