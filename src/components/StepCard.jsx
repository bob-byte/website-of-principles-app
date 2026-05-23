import { useTranslation } from "../locale/LocaleProvider";

function StepCard({ index, text }) {
    const { translate } = useTranslation();

    return (
        <article className="step">
            <div className="step__number">{index + 1}</div>
            <h3>{translate("steps.cardTitle")}</h3>
            <p>{text}</p>
        </article>
    );
}

export default StepCard;
