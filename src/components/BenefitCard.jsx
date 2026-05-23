import { useTranslation } from "../locale/LocaleProvider";

function BenefitCard({ index, text }) {
    const { translate } = useTranslation();

    return (
        <article className="card">
            <h3>
                {String(index + 1).padStart(2, "0")} {translate("benefits.cardKind")}
            </h3>
            <p>{text}</p>
        </article>
    );
}

export default BenefitCard;
