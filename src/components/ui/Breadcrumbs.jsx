import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import { useTranslation } from "react-i18next";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location?.pathname?.split("/")?.filter((x) => x);
  const { t } = useTranslation();

  const breadcrumbNameMap = {
    dashboard: "breadcrumbs.dashboard",
    "patient-directory": "breadcrumbs.directory",
    "clinical-records": "breadcrumbs.records",
    "treatment-planning": "breadcrumbs.treatment",
    "patient-profile": "breadcrumbs.profile",
    "settings-panel": "breadcrumbs.settings",
  };

  if (pathnames?.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link to="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-base">
            <Icon name="Home" size={16} />
            <span>{t("breadcrumbs.home")}</span>
          </Link>
        </li>
        {pathnames?.map((value, index) => {
          const to = `/${pathnames?.slice(0, index + 1)?.join("/")}`;
          const isLast = index === pathnames?.length - 1;
          const label = t(breadcrumbNameMap?.[value] || value);

          return (
            <React.Fragment key={to}>
              <li>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={to} className="text-muted-foreground hover:text-foreground transition-colors duration-base">
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
