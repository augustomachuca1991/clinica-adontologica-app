import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  const { t } = useTranslation();
  const pageSizeOptions = [10, 25, 50, 100].map((size) => ({
    value: String(size),
    label: t("pagination.perPage", { count: size }),
  }));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages?.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages?.push(i);
        }
        pages?.push("...");
        pages?.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages?.push(1);
        pages?.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages?.push(i);
        }
      } else {
        pages?.push(1);
        pages?.push("...");
        pages?.push(currentPage - 1);
        pages?.push(currentPage);
        pages?.push(currentPage + 1);
        pages?.push("...");
        pages?.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="clinical-card p-4 md:p-5 lg:p-6 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{t("show")}</span>
          <Select
            options={pageSizeOptions}
            value={pageSize?.toString()}
            onChange={(value) => onPageSizeChange(parseInt(value))}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            aria-label="Previous page"
          />

          <div className="flex items-center gap-1">
            {getPageNumbers()?.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-sm text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            aria-label="Next page"
          />
        </div>

        <div className="text-sm text-muted-foreground">{t("pagination.pageof", { current: currentPage, total: totalPages })}</div>
      </div>
    </div>
  );
};

export default Pagination;
