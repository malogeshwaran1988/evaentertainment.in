/**
 * "Our Clients" switch. Off (default): /clients shows "Coming soon" (noindex, follow) and is not in
 * the sitemap. Turn on with NEXT_PUBLIC_CLIENTS_ENABLED=true (build-time; redeploy after changing).
 */
export const CLIENTS_ENABLED = process.env.NEXT_PUBLIC_CLIENTS_ENABLED === "true";
