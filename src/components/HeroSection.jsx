import AppButton from "./AppButton";
import TipBadge from "./TipBadge";
import { scrollToStoreSection } from "../utils/scrollToStoreSection";
import { useTranslation } from "../locale/LocaleProvider";

function HeroSection() {
    const { translate } = useTranslation();

    return (
        <main className="hero">
            <TipBadge
                text={translate("hero.introTip")}
                className="hero__intro-tip"
            />

            <h1>
                {translate("hero.titleLine1")} <br />
                <span className="primary__color">{translate("hero.titleAccent")}</span>
            </h1>

            <p className="info__paragraph">
                {translate("hero.paragraph")}
            </p>

            <div className="main__btns">
                <AppButton variant="primary" onClick={scrollToStoreSection}>
                    {translate("hero.getStarted")}
                </AppButton>
                <AppButton variant="ghost">{translate("hero.learnMore")}</AppButton>
            </div>

            <TipBadge
                text={translate("hero.videoTip")}
                className="hero__video-tip"
            />

            <iframe
                title={translate("hero.iframeTitle")}
                src="https://www.youtube.com/embed/0z0qm_XzecY"
                allowFullScreen
            ></iframe>
        </main>
    );
}

export default HeroSection;
