function TipBadge({ text, className = "" }) {
    return (
        <div className={`tip ${className}`.trim()}>
            <div className="dot"></div>
            {text}
        </div>
    );
}

export default TipBadge;
