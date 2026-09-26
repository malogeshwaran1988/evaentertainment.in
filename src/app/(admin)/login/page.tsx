import type { Metadata } from "next";
import LoginForm from "@@/components/admin/login/LoginForm";
import { safeAdminPath } from "@@/lib/admin-session";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ backTo?: string | string[] }>;
}) {
  const { backTo } = await searchParams;
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
      <LoginForm backTo={safeAdminPath(Array.isArray(backTo) ? backTo[0] : backTo)} />
    </main>
  );
}
