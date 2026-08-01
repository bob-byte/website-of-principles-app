function TipBadge({ text, className = "" }) {
    return (
        <div className={`tip ${className}`.trim()}>
            <span className="dot" aria-hidden="true" />
            <span className="tip__text">{text}</span>
        </div>
    );
}

export default TipBadge;
