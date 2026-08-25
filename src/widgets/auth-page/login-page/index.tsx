import MailIcon from '@/shared/img/auth-page/auth-email.svg?url';
import LockIcon from '@/shared/img/auth-page/auth-lock.svg?url';
import { useNavigate } from 'react-router-dom';

import * as S from './style';
import type { LoginPanelProps } from './type';

const LoginPanel = ({
  errors,
  isSubmitting,
  onSubmit,
  register,
  submitError,
}: LoginPanelProps) => {
  const navigate = useNavigate();

  return (
    <S.Section>
      <S.AuthNav aria-label="인증 메뉴">
        <S.NavTextButton type="button" onClick={() => navigate('/signup')}>
          회원가입
        </S.NavTextButton>
        <S.NavPrimaryButton type="button" aria-current="page">
          로그인
        </S.NavPrimaryButton>
      </S.AuthNav>

      <S.Panel>
        <S.Title>로그인</S.Title>

        <S.Form onSubmit={onSubmit}>
          <S.InputWrapper>
            <S.Label htmlFor="login-email">이메일</S.Label>
            <S.InputBox>
              <S.InputIcon src={MailIcon} alt="" aria-hidden="true" />
            <S.Input
              id="login-email"
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
            </S.InputBox>

            {errors.email && (
              <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          <S.InputWrapper>
            <S.Label htmlFor="login-password">비밀번호</S.Label>
            <S.InputBox>
              <S.InputIcon src={LockIcon} alt="" aria-hidden="true" />
            <S.Input
              id="login-password"
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
            </S.InputBox>

            {errors.password && (
              <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          {submitError && (
            <S.StatusMessage role="alert">{submitError}</S.StatusMessage>
          )}

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '확인 중...' : '로그인'}
          </S.SubmitButton>
        </S.Form>
      </S.Panel>
    </S.Section>
  );
};

export default LoginPanel;
