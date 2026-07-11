import { SiteHeader } from "@/components/SiteHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            {children}
        </>
    );
}
