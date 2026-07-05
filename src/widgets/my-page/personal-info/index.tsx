import type { ChangeEvent } from "react";

import { useMyInfo } from "@/features/my-page/personal-info/model/useMyInfo";

import * as S from "./style";

const PERSONAL_INFO_FIELDS = [
  { key: "name", label: "이름" },
  { key: "nickname", label: "닉네임" },
  { key: "email", label: "이메일" },
] as const;

const PersonalInfo = () => {
  const {
    draft,
    errorMessage,
    isEditing,
    isLoading,
    isSaving,
    onFieldChange,
    onToggleEdit,
  } = useMyInfo();

  return (
    <S.PersonalInfoWrapper>
      <S.Title>개인정보</S.Title>

      <S.InfoList>
        {PERSONAL_INFO_FIELDS.map((field) => (
          <S.InfoRow key={field.key}>
            <S.Label>{field.label}</S.Label>

            {isEditing ? (
              <S.EditInput
                type={field.key === "email" ? "email" : "text"}
                value={draft[field.key]}
                disabled={isSaving}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange(field.key, event.target.value)
                }
              />
            ) : (
              <S.Value>
                {isLoading ? "불러오는 중..." : draft[field.key] || "-"}
              </S.Value>
            )}
          </S.InfoRow>
        ))}
      </S.InfoList>

      {errorMessage && <S.ErrorText role="alert">{errorMessage}</S.ErrorText>}

      <S.EditButton
        type="button"
        disabled={isLoading || isSaving}
        onClick={onToggleEdit}
      >
        {isSaving ? "저장 중..." : isEditing ? "완료" : "회원정보 수정"}
      </S.EditButton>
    </S.PersonalInfoWrapper>
  );
};

export default PersonalInfo;