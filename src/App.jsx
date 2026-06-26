import React from "react";
import AppRoutes from "@/Routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        richColors
        position="bottom-left"
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
      />
    </>
  );
}

export default App;
