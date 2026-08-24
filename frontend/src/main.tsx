import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="text-foreground bg-background min-h-screen w-full">
        <App />
      </div>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  </StrictMode>,
);
