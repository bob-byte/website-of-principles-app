function TransformationCard({ title, description }) {
    return (
        <article className="transformation-card">
            <h3 className="transformation-card__title">{title}</h3>
            <p className="transformation-card__description">{description}</p>
        </article>
    );
}

export default TransformationCard;
