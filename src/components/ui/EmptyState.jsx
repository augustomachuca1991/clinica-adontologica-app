import React, { memo } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const EmptyState = memo(
  ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    actionIcon = "Plus",
    loading,
    error,
    loadingText = "Cargando...",
    errorText = "Error al cargar.",
    emptyText,
    children,
  }) => {
    if (loading) {
      return <p className="text-sm text-muted-foreground text-center py-4">{loadingText}</p>;
    }

    if (error) {
      return <p className="text-sm text-destructive text-center py-4">{errorText}</p>;
    }

    if (children != null) {
      if (Array.isArray(children) && children.length === 0) {
        return emptyText ? (
          <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>
        ) : null;
      }
      return <>{children}</>;
    }

    if (icon || title || description || actionLabel) {
      return (
        <div className="clinical-card p-12 text-center">
          {icon && (
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name={icon} size={32} className="text-muted-foreground" />
            </div>
          )}
          {title && <h3 className="text-lg font-headline font-semibold text-foreground mb-2">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
          {actionLabel && onAction && (
            <Button variant="default" onClick={onAction} iconName={actionIcon} iconPosition="left">
              {actionLabel}
            </Button>
          )}
        </div>
      );
    }

    if (emptyText) {
      return <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>;
    }

    return null;
  }
);

EmptyState.displayName = "EmptyState";
export default EmptyState;