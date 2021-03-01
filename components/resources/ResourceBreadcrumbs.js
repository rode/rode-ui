import React from "react";
import { useResources } from "providers/resources";
import styles from "styles/modules/Resources.module.scss";
import Link from "next/link";

const createBreadcrumbs = (searchTerm) => {
  return [
    {
      label: `"${searchTerm}"`,
      href: `/resources?search=${encodeURIComponent(searchTerm)}`,
    },
  ];
};

const ResourceBreadcrumbs = () => {
  const { state } = useResources();

  if (!state.searchTerm) {
    return null;
  }

  const breadcrumbs = createBreadcrumbs(state.searchTerm);

  return (
    <div className={styles.breadcrumbs}>
      <p>Resource Search</p>
      <p>/</p>
      {breadcrumbs
        .map((crumb) => (
          <Link key={crumb.href} href={crumb.href}>
            <a>{crumb.label}</a>
          </Link>
        ))
        .reduce((prev, curr) => [prev, "/", curr])}
    </div>
  );
};

export default ResourceBreadcrumbs;
