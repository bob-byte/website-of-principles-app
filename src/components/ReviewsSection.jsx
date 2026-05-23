import SectionHeader from "./SectionHeader";
import ReviewCard from "./ReviewCard";
import { useTranslation } from "../locale/LocaleProvider";

function ReviewsSection() {
    const { translate, reviewsItems } = useTranslation();

    return (
        <section className="content__section">
            <SectionHeader
                title={translate("reviews.title")}
                subtitle={translate("reviews.subtitle")}
            />
            <div className="reviews">
                {reviewsItems.map((review) => (
                    <ReviewCard key={review.name} name={review.name} text={review.text} />
                ))}
            </div>
        </section>
    );
}

export default ReviewsSection;
