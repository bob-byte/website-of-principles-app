import SectionHeader from "./SectionHeader";
import BenefitCard from "./BenefitCard";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "../locale/LocaleProvider";

function getBenefitCellClass(index) {
    let cursor = 0;
    let row = 0;

    while (true) {
        const rowSize = row % 2 === 0 ? 3 : 2;
        if (index < cursor + rowSize) {
            return rowSize === 3 ? "benefits__cell--third" : "benefits__cell--half";
        }
        cursor += rowSize;
        row += 1;
    }
}

function BenefitsSection() {
    const { translate, benefitsItems } = useTranslation();

    return (
        <section className="content__section benefits-section">
            <RevealOnScroll>
                <SectionHeader
                    title={translate("benefits.title")}
                    subtitle={translate("benefits.subtitle")}
                />
            </RevealOnScroll>

            <div className="benefits__grid">
                {benefitsItems.map((item, index) => (
                    <RevealOnScroll
                        key={item.title}
                        className={getBenefitCellClass(index)}
                        delay={Math.min(index * 50, 300)}
                    >
                        <BenefitCard
                            emoji={item.emoji}
                            title={item.title}
                            description={item.description}
                            unique={
                                item.unique
                                    ? {
                                          label: translate("benefits.uniqueLabel"),
                                          text: item.unique,
                                      }
                                    : null
                            }
                        />
                    </RevealOnScroll>
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;
