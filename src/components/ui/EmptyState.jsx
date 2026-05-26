// components/ui/EmptyState.jsx
import React, { memo } from "react";

/**
 * EmptyState – mensaje vacío / error / cargando reutilizable.
 *
 * Props:
 *  - loading?:  boolean
 *  - error?:    boolean
 *  - loadingText?: string
 *  - errorText?:   string
 *  - emptyText:    string
 *  - children?:    ReactNode  (cuando hay datos, renderiza los hijos)
 */
const EmptyState = memo(
  ({ loading, error, loadingText = "Cargando...", errorText = "Error al cargar.", emptyText, children }) => {
    if (loading) return <p className="text-sm text-muted-foreground py-4 text-center">{loadingText}</p>;
    if (error) return <p className="text-sm text-destructive py-4 text-center">{errorText}</p>;
    if (!children || (Array.isArray(children) && children.length === 0)) {
      return <p className="text-muted-foreground p-4 text-center text-sm">{emptyText}</p>;
    }
    return <>{children}</>;
  }
);

EmptyState.displayName = "EmptyState";
export default EmptyState;
