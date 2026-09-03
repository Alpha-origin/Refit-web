import * as S from "../style";
import type { FeedbackOverallMiddleSectionProps } from "../type";
import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";

const PERSONA_IMAGES = [
  InterviewerImage1,
  InterviewerImage2,
  InterviewerImage3,
  InterviewerImage4,
] as const;

const FeedbackOverallMiddleSection = ({
  content,
}: FeedbackOverallMiddleSectionProps) => {
  return (
    <S.SectionShell>
      <S.MiddleGrid>
        {content.cards.map((card) => (
          <S.InsightCard key={card.title} $tone={card.title === "강점" ? "positive" : "negative"}>
            <S.InsightHeader>
              <S.InsightIcon aria-hidden="true">{card.title === "강점" ? "☺" : "☹"}</S.InsightIcon>
              <S.TextCardTitle>{card.title}</S.TextCardTitle>
            </S.InsightHeader>
            <S.TextCardBody>{card.content}</S.TextCardBody>
          </S.InsightCard>
        ))}
      </S.MiddleGrid>

      <S.PersonaFeedbackList>
        {content.personaFeedbacks.length > 0 ? (
          content.personaFeedbacks.map((persona, index) => (
            <S.PersonaFeedbackCard key={`${persona.title}-${index}`}>
              <S.PersonaImage
                src={persona.imageUrl ?? PERSONA_IMAGES[index % PERSONA_IMAGES.length]}
                alt={`${persona.title} 프로필`}
              />
              <S.PersonaFeedbackBody>
                <S.PersonaFeedbackTitle>{persona.title}</S.PersonaFeedbackTitle>
                <S.PersonaFeedbackText>{persona.comment}</S.PersonaFeedbackText>
              </S.PersonaFeedbackBody>
            </S.PersonaFeedbackCard>
          ))
        ) : (
          <S.PersonaEmpty>면접관별 코멘트가 아직 없습니다.</S.PersonaEmpty>
        )}
      </S.PersonaFeedbackList>
    </S.SectionShell>
  );
};

export default FeedbackOverallMiddleSection;
