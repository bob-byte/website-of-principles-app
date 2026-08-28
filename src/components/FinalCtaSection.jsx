import TipBadge from "./TipBadge";
import StoreDownloadButtons from "./StoreDownloadButtons";
import { useTranslation } from "../locale/LocaleProvider";
import logoOrange from "../assets/logo-orange.png";
import logoBlue from "../assets/logo-blue.png";

function FinalCtaSection() {
    const { translate, theme } = useTranslation();
    const logo = theme.includes("blue") ? logoBlue : logoOrange;

    return (
        <section className="final__cta">
            <div className="final__cta-inner">
                <img className="final__cta-miniLogo" src={logo} alt={translate("finalCta.miniLogoAlt")} />
                <TipBadge text={translate("finalCta.badge")} />
                <h2>
                    <span className="primary__color">{translate("finalCta.titleLead")}</span> <br />
                    <span className="final__cta-title-rest">{translate("finalCta.titleRest")}</span>
                </h2>
                <p className="info__paragraph">
                    {translate("finalCta.paragraph")}
                </p>
                <StoreDownloadButtons />
            </div>
            <img className="final__cta-logo" src={logo} alt="" aria-hidden="true" />
        </section>
    );
}

export default FinalCtaSection;
