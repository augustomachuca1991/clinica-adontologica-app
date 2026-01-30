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
        toastOptions={{
          className: "rounded-xl shadow-clinical-md",
        }}
      />
    </>
  );
}

export default App;
