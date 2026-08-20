import {
  THIRD_SECTION_REVIEW_ITEMS,
  THIRD_SECTION_SUBTITLE,
  THIRD_SECTION_TITLE,
} from "@/shared/constants/landing-page/third-section";
import { useReducedMotion } from "framer-motion";
import { revealVariants, userReviewViewport } from "./animation";
import * as S from "./style";

// 원본 아이템 개수가 몇 개든 상관없이, 화면을 꽉 채울 만큼
// 최소 개수(minCount)가 될 때까지 순환하며 채워주는 헬퍼
const fillItems = <T,>(items: readonly T[], minCount: number): T[] => {
  if (items.length === 0) return [];
  const result: T[] = [];
  let i = 0;
  while (result.length < minCount) {
    result.push(items[i % items.length]);
    i += 1;
  }
  return result;
};

// 한 행에 보여줄 최소 칩 개수 (뷰포트 폭 대비 여유 있게 설정)
const MIN_ITEMS_PER_ROW = 8;

const REVIEW_ROWS = [
  {
    id: "top",
    duration: 34,
    offset: "-14rem",
    items: fillItems(THIRD_SECTION_REVIEW_ITEMS, MIN_ITEMS_PER_ROW),
  },
  {
    id: "bottom",
    duration: 38,
    offset: "4.5rem",
    // 시작점을 다르게 줘서(2번째 아이템부터) 위/아래 행이 겹치지 않게 하되,
    // 개수는 동일하게 충분히 채움
    items: fillItems(
      [
        ...THIRD_SECTION_REVIEW_ITEMS.slice(2),
        ...THIRD_SECTION_REVIEW_ITEMS.slice(0, 2),
      ],
      MIN_ITEMS_PER_ROW,
    ),
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
                  {row.items.map((review, idx) => (
                    <S.ReviewChip
                      key={`${row.id}-${groupIndex}-${review.id}-${idx}`}
                      $width={review.width}
                      $height={review.height}
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