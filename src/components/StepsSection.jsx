import SectionHeader from "./SectionHeader";
import StepCard from "./StepCard";
import { useTranslation } from "../locale/LocaleProvider";

function StepsSection() {
    const { translate, stepsItems } = useTranslation();

    return (
        <section className="content__section">
            <SectionHeader
                title={translate("steps.title")}
                subtitle={translate("steps.subtitle")}
            />
            <div className="steps">
                {stepsItems.map((item, index) => (
                    <StepCard key={index} index={index} text={item} />
                ))}
            </div>
        </section>
    );
}

export default StepsSection;
