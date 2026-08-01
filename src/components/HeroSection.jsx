import TipBadge from "./TipBadge";
import AppButton from "./AppButton";
import HeroVideo from "./HeroVideo";
import { scrollToStoreSection } from "../utils/scrollToStoreSection";
import { scrollToBenefitsSection } from "../utils/scrollToBenefitsSection";
import { useTranslation } from "../locale/LocaleProvider";

function HeroSection() {
    const { translate } = useTranslation();

    return (
        <main className="hero">
            <TipBadge
                text={translate("hero.introTip")}
                className="hero__intro-tip"
            />

            <div className="hero__title-wrap">
                <span className="hero__glow" aria-hidden="true" />
                <h1>
                    {translate("hero.titleLine1")} <br />
                    <span className="primary__color">{translate("hero.titleAccent")}</span>
                </h1>
            </div>

            <p className="info__paragraph">
                {translate("hero.paragraph")}
            </p>

            <div className="main__btns">
                <AppButton variant="primary" onClick={scrollToStoreSection}>
                    {translate("hero.getStarted")}
                </AppButton>
                <button
                    type="button"
                    className="translucent__btn hero__learn-more"
                    onClick={scrollToBenefitsSection}
                >
                    {translate("hero.learnMore")}
                </button>
            </div>

            <TipBadge
                text={translate("hero.videoTip")}
                className="hero__video-tip"
            />

            <HeroVideo />
        </main>
    );
}

export default HeroSection;
