import EmailIcon from '@/shared/img/auth-page/auth-email.svg?url';
import LockIcon from '@/shared/img/auth-page/auth-lock.svg?url';
import { useState, type FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from './style';
import type { SignUpPanelProps } from './type';

const SignUpPanel = ({
  errors,
  isSubmitting,
  onSubmit,
  register,
  submitError,
  trigger,
}: SignUpPanelProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  const handleNextStep = async () => {
    const isValid = await trigger(['name', 'nickname', 'email']);

    if (!isValid) {
      return;
    }

    setStep(2);
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    if (step === 1) {
      event.preventDefault();
      await handleNextStep();
      return;
    }

    onSubmit(event);
  };

  return (
    <S.Section>
      <S.AuthNav aria-label="인증 메뉴">
        <S.NavPrimaryButton type="button" aria-current="page">
          회원가입
        </S.NavPrimaryButton>
        <S.NavTextButton type="button" onClick={() => navigate('/login')}>
          로그인
        </S.NavTextButton>
      </S.AuthNav>

      <S.Panel>
        <S.Title>회원가입</S.Title>

        <S.Form onSubmit={handleFormSubmit}>
          {step === 1 ? (
            <S.FirstStepLayout>
              <S.StepFields>
                <S.InputWrapper>
                  <S.Label htmlFor="signup-email">이메일</S.Label>
                  <S.FieldBox>
                    <S.FieldIcon src={EmailIcon} alt="" aria-hidden="true" />
                    <S.Input
                      id="signup-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      disabled={isSubmitting}
                      {...register('email', {
                        required: '이메일을 입력해주세요.',
                        pattern: {
                          value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                          message: '올바른 이메일 형식이 아닙니다.',
                        },
                      })}
                    />
                  </S.FieldBox>

                  {errors.email && (
                    <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
                  )}
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.Label htmlFor="signup-name">이름</S.Label>
                  <S.FieldBox>
                    <S.Input
                      id="signup-name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      disabled={isSubmitting}
                      {...register('name', {
                        required: '이름을 입력해주세요.',
                      })}
                    />
                  </S.FieldBox>

                  {errors.name && (
                    <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>
                  )}
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.Label htmlFor="signup-nickname">닉네임</S.Label>
                  <S.FieldBox>
                    <S.Input
                      id="signup-nickname"
                      type="text"
                      placeholder="닉네임을 입력하세요"
                      disabled={isSubmitting}
                      {...register('nickname', {
                        required: '닉네임을 입력해주세요.',
                      })}
                    />
                  </S.FieldBox>

                  {errors.nickname && (
                    <S.ErrorMessage>{errors.nickname.message}</S.ErrorMessage>
                  )}
                </S.InputWrapper>
              </S.StepFields>

              <S.NextStepButton
                type="button"
                aria-label="다음 단계로 이동"
                onClick={handleNextStep}
              >
                다음
              </S.NextStepButton>
            </S.FirstStepLayout>
          ) : (
            <S.SecondStepLayout>
              <S.StepFields>
                <S.InputWrapper>
                  <S.Label htmlFor="signup-password">비밀번호</S.Label>
                  <S.FieldBox>
                    <S.FieldIcon src={LockIcon} alt="" aria-hidden="true" />
                    <S.Input
                      id="signup-password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      disabled={isSubmitting}
                      {...register('password', {
                        required: '비밀번호를 입력해주세요.',
                        minLength: {
                          value: 8,
                          message: '비밀번호는 8자 이상이어야 합니다.',
                        },
                      })}
                    />
                  </S.FieldBox>

                  {errors.password && (
                    <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
                  )}
                </S.InputWrapper>

                <S.InputWrapper>
                  <S.Label htmlFor="signup-password-confirm">비밀번호 확인</S.Label>
                  <S.FieldBox>
                    <S.FieldIcon src={LockIcon} alt="" aria-hidden="true" />
                    <S.Input
                      id="signup-password-confirm"
                      type="password"
                      placeholder="비밀번호를 확인 할 수 있도록 다시 입력하세요"
                      disabled={isSubmitting}
                      {...register('passwordConfirm', {
                        required: '비밀번호 확인을 입력해주세요.',
                        validate: (value, formValues) =>
                          value === formValues.password ||
                          '비밀번호가 일치하지 않습니다.',
                      })}
                    />
                  </S.FieldBox>

                  {errors.passwordConfirm && (
                    <S.ErrorMessage>{errors.passwordConfirm.message}</S.ErrorMessage>
                  )}
                </S.InputWrapper>
              </S.StepFields>
              <S.SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '가입 중...' : '회원가입'}
              </S.SubmitButton>
            </S.SecondStepLayout>
          )}

          {submitError && (
            <S.StatusMessage role="alert">{submitError}</S.StatusMessage>
          )}
        </S.Form>
      </S.Panel>
    </S.Section>
  );
};

export default SignUpPanel;