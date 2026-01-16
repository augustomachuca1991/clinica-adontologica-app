import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location?.pathname?.split("/")?.filter((x) => x);

  const breadcrumbNameMap = {
    dashboard: "Dashboard",
    "patient-directory": "Patient Directory",
    "clinical-records": "Clinical Records",
    "treatment-planning": "Treatment Planning",
    "patient-profile": "Patient Profile",
    "settings-panel": "Settings",
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
            <span>Home</span>
          </Link>
        </li>
        {pathnames?.map((value, index) => {
          const to = `/${pathnames?.slice(0, index + 1)?.join("/")}`;
          const isLast = index === pathnames?.length - 1;
          const label = breadcrumbNameMap?.[value] || value;

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
