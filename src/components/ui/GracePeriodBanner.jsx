import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const GracePeriodBanner = () => {
  const { subscription, isAdmin, isLoggedIn, daysWithGrace } = useAuth();

  if (!isLoggedIn || isAdmin || !subscription) return null;

  const hoy = new Date();
  const finPeriodo = new Date(subscription.current_period_end);

  // SI TODAVÍA NO VENCIÓ, NO MOSTRAMOS EL BANNER
  if (hoy <= finPeriodo) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          {/* Icono de Alerta */}
          <svg
            className="w-5 h-5 text-amber-100 flex-shrink-0 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>

          <p className="text-sm font-medium tracking-wide">
            Tu suscripción mensual ha vencido. Disponés de{" "}
            <span className="font-bold underline decoration-2 decoration-amber-200">
              {daysWithGrace} {daysWithGrace === 1 ? "día" : "días"} de gracia
            </span>{" "}
            para regularizar tu pago antes de que tu acceso sea denegado.
          </p>
        </div>

        {/* Botón de Acción Opcional (Podés cambiar la ruta a donde pague el cliente) */}
        <button
          onClick={() => (window.location.href = "/profile")}
          className="bg-white text-orange-700 hover:bg-amber-50 transition-all text-xs font-semibold px-4 py-2 rounded-md shadow-sm whitespace-nowrap active:scale-95"
        >
          Regularizar Pago
        </button>
      </div>
    </div>
  );
};

export default GracePeriodBanner;
