import SectionHeader from "./SectionHeader";
import BenefitCard from "./BenefitCard";
import { useTranslation } from "../locale/LocaleProvider";

function BenefitsSection() {
    const { translate, benefitsItems } = useTranslation();

    return (
        <section className="content__section">
            <SectionHeader
                title={translate("benefits.title")}
                subtitle={translate("benefits.subtitle")}
            />
            <div className="benefits__grid">
                {benefitsItems.map((item, index) => (
                    <BenefitCard key={index} index={index} text={item} />
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;
