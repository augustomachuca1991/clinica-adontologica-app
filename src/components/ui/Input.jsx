import React from "react";
import { cn } from "@/utils/cn";
import Icon from "@/components/AppIcon";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      checked,
      color,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base input classes
    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox-specific styles
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    if (type === "radio") {
      return (
        <label
          htmlFor={inputId}
          className="inline-flex items-center cursor-pointer group"
        >
          <div className="relative flex items-center">
            {/* El input real sigue manejando la lógica, pero lo ocultamos */}
            <input
              type="radio"
              className="sr-only"
              ref={ref}
              id={inputId}
              checked={checked} // Se lo pasamos al input nativo
              {...props}
            />
            {/* Este es el círculo/cuadrado que el usuario REALMENTE ve */}
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                checked
                  ? `${color} border-transparent shadow-sm` // Si está checked, aplica el color
                  : "border-border bg-background group-hover:border-primary/50",
                className
              )}
            >
              {/* Si está checked, mostramos el icono */}
              {checked && (
                <Icon name="Check" size={12} className="text-white" />
              )}
            </div>
          </div>
          {label && (
            <span
              className={cn(
                "ml-2 text-sm font-medium transition-colors tracking-[1.5]",
                checked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          )}
        </label>
      );
    }

    // For regular inputs with wrapper structure
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          type={type}
          className={cn(
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
