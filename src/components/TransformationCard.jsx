function TransformationCard({ emoji, title, description }) {
    return (
        <article className="transformation-card">
            <h3 className="transformation-card__title">
                <span className="transformation-card__emoji" aria-hidden="true">
                    {emoji}
                </span>
                {title}
            </h3>
            <p className="transformation-card__description">{description}</p>
        </article>
    );
}

export default TransformationCard;
