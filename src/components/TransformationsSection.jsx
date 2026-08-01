import SectionHeader from "./SectionHeader";
import TransformationCard from "./TransformationCard";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "../locale/LocaleProvider";

function getTransformationCellClass(index) {
    let cursor = 0;
    let row = 0;

    while (true) {
        const rowSize = row % 2 === 0 ? 2 : 3;
        if (index < cursor + rowSize) {
            return rowSize === 3
                ? "transformations__cell--third"
                : "transformations__cell--half";
        }
        cursor += rowSize;
        row += 1;
    }
}

function TransformationsSection() {
    const { translate, transformationsItems } = useTranslation();

    return (
        <section className="content__section transformations-section">
            <RevealOnScroll>
                <SectionHeader
                    title={translate("transformations.title")}
                    subtitle={translate("transformations.subtitle")}
                />
            </RevealOnScroll>
            <div className="transformations__grid">
                {transformationsItems.map((item, index) => (
                    <RevealOnScroll
                        key={item.title}
                        className={getTransformationCellClass(index)}
                        delay={Math.min(index * 35, 280)}
                    >
                        <TransformationCard
                            title={item.title}
                            description={item.description}
                        />
                    </RevealOnScroll>
                ))}
            </div>
        </section>
    );
}

export default TransformationsSection;
