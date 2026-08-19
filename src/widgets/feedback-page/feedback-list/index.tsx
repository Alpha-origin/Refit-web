import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import type { FeedbackListProps } from "./type";

type SortOrder = "oldest" | "latest";

const getDateTime = (date: string) => {
  const parsedDate = new Date(date.split("/").join("-"));

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
};

const getNormalizedStatusLabel = (statusLabel: string) =>
  statusLabel.replace(/\s/g, "");

const getStatusDisplayLabel = (statusLabel: string) => {
  if (getNormalizedStatusLabel(statusLabel) === "분석완료") {
    return "분석 완료";
  }

  if (statusLabel === "진행중") {
    return "분석중";
  }

  return statusLabel;
};

type InternalProps = FeedbackListProps & {
  onItemClick?: (item: FeedbackListProps["items"][number]) => void;
};

const FeedbackList = ({
  emptyMessage = "아직 저장된 면접 결과가 없습니다.",
  errorMessage,
  isLoading = false,
  items,
  onRetry,
  title,
  onItemClick,
}: InternalProps) => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest");
  const sortedItems = useMemo(
    () =>
      [...items].sort((left, right) => {
        const leftTime = getDateTime(left.date);
        const rightTime = getDateTime(right.date);

        return sortOrder === "oldest"
          ? leftTime - rightTime
          : rightTime - leftTime;
      }),
    [items, sortOrder],
  );

  return (
    <S.Page>
      <S.Panel>
        <S.Toolbar>
          <S.SectionTitle>{title}</S.SectionTitle>
          <S.SortSelectWrapper>
            <S.SortSelect
              aria-label="면접 목록 정렬"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
            >
              <option value="oldest">오래된 순</option>
              <option value="latest">최신순</option>
            </S.SortSelect>
          </S.SortSelectWrapper>
        </S.Toolbar>

        {isLoading ? (
          <S.StateCard aria-live="polite">
            <S.StateText>지난 면접 목록을 불러오는 중입니다.</S.StateText>
          </S.StateCard>
        ) : errorMessage ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage}</S.StateText>
            {onRetry ? (
              <S.RetryButton type="button" onClick={onRetry}>
                다시 시도
              </S.RetryButton>
            ) : null}
          </S.StateCard>
        ) : items.length === 0 ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{emptyMessage}</S.StateText>
          </S.StateCard>
        ) : (
          <S.List>
            {sortedItems.map((item) => {
              const isComplete = getNormalizedStatusLabel(
                item.statusLabel,
              ).includes("완료");

              return (
                <S.FeedbackCard
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick(item);
                      return;
                    }

                    navigate(`/main/feedback/overall/${item.id}`);
                  }}
                >
                  <S.CardImage
                    src={item.imageUrl}
                    alt={`${item.interviewerName} 이미지`}
                  />
                  <S.CardBody>
                    <S.CardTitle>{item.title}</S.CardTitle>
                    <S.MetaGroup>
                      <S.MetaLabel>스타일/난이도</S.MetaLabel>
                      <S.TagGroup>
                        <S.Tag>{item.styleLabel}</S.Tag>
                        <S.Tag>{item.levelLabel}</S.Tag>
                      </S.TagGroup>
                    </S.MetaGroup>
                    <S.MetaGroup>
                      <S.MetaLabel>면접관</S.MetaLabel>
                      <S.TagGroup>
                        <S.Tag>{item.interviewerName}</S.Tag>
                      </S.TagGroup>
                    </S.MetaGroup>
                    <S.CardDate>{item.date}</S.CardDate>
                  </S.CardBody>
                  <S.StatusBadge $complete={isComplete}>
                    {getStatusDisplayLabel(item.statusLabel)}
                  </S.StatusBadge>
                </S.FeedbackCard>
              );
            })}
          </S.List>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackList;
