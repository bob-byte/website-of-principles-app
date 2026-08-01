import SectionHeader from "./SectionHeader";
import StepCard from "./StepCard";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "../locale/LocaleProvider";

function StepsSection() {
    const { translate, stepsItems } = useTranslation();

    return (
        <section className="content__section">
            <RevealOnScroll>
                <SectionHeader
                    title={translate("steps.title")}
                    subtitle={translate("steps.subtitle")}
                />
            </RevealOnScroll>
            <div className="steps">
                {stepsItems.map((item, index) => (
                    <RevealOnScroll key={item.title} delay={Math.min(index * 70, 280)}>
                        <StepCard index={index} title={item.title} text={item.text} />
                    </RevealOnScroll>
                ))}
            </div>
        </section>
    );
}

export default StepsSection;
