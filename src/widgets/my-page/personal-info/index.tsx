import type { MyPageUser } from "@/features/my-page/api/getMyPageData";

import * as S from "./style";

interface PersonalInfoProps {
  errorMessage: string | null;
  isLoading: boolean;
  user: MyPageUser | null;
}

const getInfoFields = (user: MyPageUser) => [
  {
    label: "이름",
    value: user.username,
  },
  {
    label: "닉네임",
    value: user.nickname,
  },
  {
    label: "이메일",
    value: user.email,
  },
  {
    label: "전공",
    value: user.major,
  },
];

const PersonalInfo = ({ errorMessage, isLoading, user }: PersonalInfoProps) => {
  const fields = user ? getInfoFields(user) : [];

  return (
    <S.PersonalInfoWrapper>
      <S.Title>개인정보</S.Title>

      {isLoading ? (
        <S.StatusText>유저 정보를 불러오는 중입니다.</S.StatusText>
      ) : errorMessage ? (
        <S.StatusText role="alert">{errorMessage}</S.StatusText>
      ) : (
        <S.InfoList>
          {fields.map((field) => (
            <S.InfoRow key={field.label}>
              <S.Label>{field.label}</S.Label>
              <S.Value>{field.value || "-"}</S.Value>
            </S.InfoRow>
          ))}
        </S.InfoList>
      )}

      <S.EditButton type="button">회원정보 수정</S.EditButton>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;
