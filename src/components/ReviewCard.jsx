function ReviewCard({ name, text }) {
    return (
        <article className="review__card">
            <div className="rating">★★★★★</div>
            <p>{text}</p>
            <div className="review__author">{name}</div>
        </article>
    );
}

export default ReviewCard;
