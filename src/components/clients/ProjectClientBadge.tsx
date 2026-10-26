import Link from "@@/components/common/NavLink";
import { Routes } from "@@/constants/routes";
import type { ProjectClient } from "@@/data/clients";
import "@@/styles/routes/project-client.scss";

/** Small "Client" line with the client's logo and name, shown on project views when a client is set. */
export default function ProjectClientBadge({ client }: { client?: ProjectClient }) {
  if (!client) return null;
  return (
    <p className="eva-project-client">
      <span className="eva-project-client-label">Client</span>
      <Link className="eva-project-client-link" href={Routes.CLIENTS}>
        <span className="eva-project-client-logo">
          {/* eslint-disable-next-line @next/next/no-img-element -- small pre-optimised AVIF */}
          <img src={client.logo} alt={`${client.name} logo`} width={client.width} height={client.height} loading="lazy" decoding="async" />
        </span>
        <span className="eva-project-client-name">{client.name}</span>
      </Link>
    </p>
  );
}
