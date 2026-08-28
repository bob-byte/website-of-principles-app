import { useEffect } from "react";
import HeroSection from "./HeroSection";
import BenefitsSection from "./BenefitsSection";
import TransformationsSection from "./TransformationsSection";
import StepsSection from "./StepsSection";
import ReviewsSection from "./ReviewsSection";
import FinalCtaSection from "./FinalCtaSection";
import RevealOnScroll from "./RevealOnScroll";
import SectionGlowLayer, { BENEFIT_GLOWS, TRANSFORMATION_GLOWS } from "./SectionGlowLayer";
import { STORE_DOWNLOAD_SECTION_ID } from "../config/storeLinks";
import { scrollToStoreSection } from "../utils/scrollToStoreSection";

function GetStarted() {
    useEffect(() => {
        if (window.location.hash === `#${STORE_DOWNLOAD_SECTION_ID}`) {
            requestAnimationFrame(() => scrollToStoreSection());
        }
    }, []);

    return (
        <div className="page-sections">
            <section className="section-shell">
                <div className="container">
                    <HeroSection />
                </div>
            </section>
            <hr className="section-divider" />

            <section className="section-shell section-shell--glows" id="benefits">
                <SectionGlowLayer glows={BENEFIT_GLOWS} />
                <div className="container">
                    <BenefitsSection />
                </div>
            </section>
            <hr className="section-divider" />

            <section className="section-shell section-shell--glows" id="transformations">
                <SectionGlowLayer glows={TRANSFORMATION_GLOWS} />
                <div className="container">
                    <TransformationsSection />
                </div>
            </section>
            <hr className="section-divider" />

            <section className="section-shell" id="how-it-works">
                <div className="container">
                    <StepsSection />
                </div>
            </section>
            <hr className="section-divider" />

            <section className="section-shell">
                <div className="container">
                    <ReviewsSection />
                </div>
            </section>
            <hr className="section-divider" />

            <section className="section-shell">
                <RevealOnScroll>
                    <FinalCtaSection />
                </RevealOnScroll>
            </section>
        </div>
    );
}

export default GetStarted;
