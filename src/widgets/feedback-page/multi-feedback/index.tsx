import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { multiFeedbackFixture as data } from "./data";
import * as S from "./style";

interface MultiFeedbackProps { view: "overall" | "detail"; }

const MultiFeedback = ({ view }: MultiFeedbackProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedId, setSelectedId] = useState<string>(data.questions[0].id);
  const selected = data.questions.find((question) => question.id === selectedId) ?? data.questions[0];
  const feedbackPath = id ?? "1";

  return <S.Page><S.Shell>
    <S.Header><S.Title>{view === "overall" ? "종합 피드백" : "상세 피드백"}</S.Title><S.Tabs>
      <S.Tab type="button" $active={view === "overall"} onClick={() => navigate(`/main/feedback/overall/${feedbackPath}`)}>종합 피드백</S.Tab>
      <S.Tab type="button" $active={view === "detail"} onClick={() => navigate(`/main/feedback/detail/${feedbackPath}`)}>상세 피드백</S.Tab>
    </S.Tabs></S.Header>
    {view === "overall" ? <Overall /> : <Detail selected={selected} selectedId={selectedId} onSelect={setSelectedId} />}
  </S.Shell></S.Page>;
};

const Overall = () => <>
  <S.OverallGrid>
    <S.ScoreCard><S.Donut $score={data.score}><S.DonutText>종합 점수<span>{data.score}점</span></S.DonutText></S.Donut><S.Summary>{data.summary}</S.Summary></S.ScoreCard>
    <S.Stack><S.BarCard><S.BarRow><S.BarTitle>나의 점수<strong>{data.score}점</strong></S.BarTitle><S.Track><S.Fill $score={data.score}/></S.Track></S.BarRow><S.BarRow><S.BarTitle>응시자 평균 점수<strong>40점</strong></S.BarTitle><S.Track><S.Fill $score={44} $muted/></S.Track></S.BarRow></S.BarCard>
      <S.IntentCard><h2>질문 의도 적합도</h2><p>{data.intent}</p></S.IntentCard></S.Stack>
  </S.OverallGrid>
  <S.InsightGrid><S.Insight $tone="positive"><h2>☺ 장점</h2><ol>{data.strengths.map(item=><li key={item}>{item}</li>)}</ol></S.Insight><S.Insight $tone="negative"><h2>☹ 단점</h2><ol>{data.improvements.map(item=><li key={item}>{item}</li>)}</ol></S.Insight><S.Insight $tone="neutral"><h2>지난 면접 대비</h2><p><strong style={{color:"#2478e9",fontSize:"1.5rem"}}>+ 10점</strong>이 상승했어요!</p><S.Track><S.Fill $score={72} $muted/></S.Track><br/><S.Track><S.Fill $score={82}/></S.Track></S.Insight></S.InsightGrid>
  <S.PersonaList>{data.personas.map(persona=><S.PersonaCard key={persona.id}><S.PersonaImage src={persona.image} alt={`${persona.name} ${persona.role}`}/><div><S.PersonaName>{persona.name} · {persona.role}</S.PersonaName><S.PersonaComment>{persona.comment}</S.PersonaComment></div><S.ScoreBadge>{persona.score}점</S.ScoreBadge></S.PersonaCard>)}</S.PersonaList>
  <S.InsightGrid><S.Card><h2 style={{color:"#2478e9",marginTop:0}}>핵심 키워드</h2><S.KeywordWrap>{data.keywords.map((word,index)=><S.Keyword key={word} $index={index}>{word}</S.Keyword>)}</S.KeywordWrap></S.Card><S.Insight $tone="neutral"><h2>응답 신뢰성</h2><p><strong style={{fontSize:"1.7rem"}}>99%</strong> · 높음</p></S.Insight><S.Insight $tone="neutral"><h2>면접관별 평균</h2><p>기술 · 인사 · 대표 관점의 피드백을 함께 확인해 보세요.</p></S.Insight></S.InsightGrid>
</>;

const Detail = ({ selected, selectedId, onSelect }: { selected: typeof data.questions[number]; selectedId:string; onSelect:(id:string)=>void }) => <S.DetailGrid>
  <S.Sidebar><S.SideTitle>상세 피드백</S.SideTitle>{data.questions.map(question=>{const persona=data.personas.find(item=>item.id===question.personaId);return <S.QuestionButton key={question.id} type="button" $active={selectedId===question.id} onClick={()=>onSelect(question.id)}><strong>{question.label} · {persona?.role}</strong><span>{question.question}</span></S.QuestionButton>})}<S.Actions><S.Action type="button">면접 다시보기</S.Action><S.Action type="button" $primary>PDF로 저장</S.Action></S.Actions></S.Sidebar>
  <S.DetailContent><S.QuestionCard><h3>{selected.label}</h3><h2>{selected.question}</h2><h3>질문 의도</h3><p>{selected.intention}</p></S.QuestionCard><S.Answers><S.AnswerCard><h2>내 답변</h2><p>{selected.answer}</p></S.AnswerCard><S.AnswerCard><h2>모범 답변</h2><p>{selected.modelAnswer}</p></S.AnswerCard></S.Answers><S.Answers><S.AnswerCard><h2>예상 꼬리질문</h2><p>{selected.followUp}</p></S.AnswerCard><S.Coach>답변의 흐름은 자연스럽고 경험이 잘 드러납니다. 결과와 본인의 기여도를 더 구체적으로 연결하면 훨씬 신뢰도 높은 답변이 됩니다.</S.Coach></S.Answers><S.FeedbackRow><S.Insight $tone="positive"><h2>☺ 장점</h2><p>{selected.strength}</p></S.Insight><S.Insight $tone="negative"><h2>☹ 단점</h2><p>{selected.improvement}</p></S.Insight></S.FeedbackRow></S.DetailContent>
</S.DetailGrid>;

export default MultiFeedback;
