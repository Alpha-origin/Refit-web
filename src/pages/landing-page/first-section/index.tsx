import HeroContent from "@/widgets/landing-page/first-section/hero-content";
import LandingPageHeader from "@/widgets/landing-page/first-section/landing-page-header";
import * as S from "./style";

const FirstSection = () => {
  return (
    <S.Section>
      <S.BackgroundGlow />
      <S.BackgroundGround />
      <LandingPageHeader />
      <HeroContent />
    </S.Section>
  );
};

export default FirstSection;
