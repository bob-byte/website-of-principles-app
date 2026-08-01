function BenefitCard({ emoji, title, description, unique }) {
    return (
        <article className="benefit-card">
            <h3 className="benefit-card__title">
                <span className="benefit-card__emoji" aria-hidden="true">
                    {emoji}
                </span>
                {title}
            </h3>
            <div className="benefit-card__body">
                <p className="benefit-card__description">{description}</p>
                {unique ? (
                    <p className="benefit-card__unique">
                        <span className="benefit-card__unique-label">{unique.label}</span>{" "}
                        {unique.text}
                    </p>
                ) : null}
            </div>
        </article>
    );
}

export default BenefitCard;
