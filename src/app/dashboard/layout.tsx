import { SiteHeader } from "@/components/SiteHeader";
import { ToastProvider } from "@/components/Toaster";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <SiteHeader />
            {children}
        </ToastProvider>
    );
}
