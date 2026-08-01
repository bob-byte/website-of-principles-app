function StepCard({ index, title, text }) {
    return (
        <article className="step">
            <div className="step__number">{index + 1}</div>
            <h3>{title}</h3>
            <p>{text}</p>
        </article>
    );
}

export default StepCard;
