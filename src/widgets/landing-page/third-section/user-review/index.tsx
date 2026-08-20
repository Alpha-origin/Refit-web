import {
  THIRD_SECTION_REVIEW_ITEMS,
  THIRD_SECTION_SUBTITLE,
  THIRD_SECTION_TITLE,
} from "@/shared/constants/landing-page/third-section";
import { useReducedMotion } from "framer-motion";
import { revealVariants, userReviewViewport } from "./animation";
import * as S from "./style";

const REVIEW_ROWS = [
  {
    id: "top",
    duration: 34,
    offset: "-14rem",
    items: THIRD_SECTION_REVIEW_ITEMS.slice(0, 3),
  },
  {
    id: "bottom",
    duration: 38,
    offset: "4.5rem",
    items: THIRD_SECTION_REVIEW_ITEMS.slice(2),
  },
] as const;

const UserReview = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <S.ContentMotion
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={shouldReduceMotion ? undefined : userReviewViewport}
    >
      <S.Header variants={revealVariants}>
        <S.SubTitle>{THIRD_SECTION_SUBTITLE}</S.SubTitle>
        <S.Title>{THIRD_SECTION_TITLE}</S.Title>
      </S.Header>

      <S.ReviewStage variants={revealVariants}>
        {REVIEW_ROWS.map((row) => (
          <S.ReviewRow key={row.id}>
            <S.ReviewTrack
              $duration={row.duration}
              $offset={row.offset}
              $isPaused={Boolean(shouldReduceMotion)}
            >
              {[0, 1].map((groupIndex) => (
                <S.ReviewSet key={`${row.id}-${groupIndex}`} aria-hidden={groupIndex === 1}>
                  {row.items.map((review) => (
                    <S.ReviewChip
                      key={`${row.id}-${groupIndex}-${review.id}`}
                      $width={review.width}
                      $opacity={review.opacity}
                    >
                      {review.message}
                    </S.ReviewChip>
                  ))}
                </S.ReviewSet>
              ))}
            </S.ReviewTrack>
          </S.ReviewRow>
        ))}
      </S.ReviewStage>
    </S.ContentMotion>
  );
};

export default UserReview;
