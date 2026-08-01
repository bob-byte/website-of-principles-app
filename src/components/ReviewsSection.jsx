import SectionHeader from "./SectionHeader";
import ReviewCard from "./ReviewCard";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "../locale/LocaleProvider";

function ReviewsSection() {
    const { translate, reviewsItems } = useTranslation();

    return (
        <section className="content__section">
            <RevealOnScroll>
                <SectionHeader
                    title={translate("reviews.title")}
                    subtitle={translate("reviews.subtitle")}
                />
            </RevealOnScroll>
            <div className="reviews">
                {reviewsItems.map((review, index) => (
                    <RevealOnScroll key={review.name} delay={Math.min(index * 80, 240)}>
                        <ReviewCard name={review.name} text={review.text} />
                    </RevealOnScroll>
                ))}
            </div>
        </section>
    );
}

export default ReviewsSection;
