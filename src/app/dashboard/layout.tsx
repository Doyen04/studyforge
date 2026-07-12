import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SiteHeader />
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    className: "text-sm font-medium",
                    style: {
                        border: "1px solid var(--color-rule)",
                        background: "var(--color-card)",
                        color: "var(--color-ink)",
                    },
                }}
            />
        </ThemeProvider>
    );
}
