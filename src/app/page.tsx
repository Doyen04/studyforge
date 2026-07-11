import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Nav />
            <Hero />
            <HowItWorks />
            <Features />
            <CTA />
            <FAQ />
            <Footer />
        </main>
    );
}
