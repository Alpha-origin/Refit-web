import RepitLogo from '@/shared/img/logo/Repit-logo.svg?url';

import * as S from './style';
import type { AuthSidePanelProps } from './type';

const AuthSidePanel = ({
  description,
  imageAlt,
  switchAuthLabel,
  onSwitchAuth,
}: AuthSidePanelProps) => {
  // const isLoginPage = switchAuthLabel === '회원가입';

  return (
    <S.Section aria-label={imageAlt}>
      <S.Header>
        <S.LogoLink to="/" aria-label="Repit 홈으로 이동">
          <img src={RepitLogo} alt="Repit" />
        </S.LogoLink>

        {/* <S.Navigation aria-label="인증 페이지 이동">
          <S.NavButton
            type="button"
            $active={!isLoginPage}
            disabled={!isLoginPage}
            onClick={isLoginPage ? onSwitchAuth : undefined}
          >
            회원가입
          </S.NavButton>
          <S.NavButton
            type="button"
            $active={isLoginPage}
            disabled={isLoginPage}
            onClick={isLoginPage ? undefined : onSwitchAuth}
          >
            로그인
          </S.NavButton>
        </S.Navigation> */}
        
      </S.Header>

      <S.Content>
        <S.ContentStack>
          <S.Title>
            Hello
            <br />
            WELCOME!
          </S.Title>
          <S.Description>{description}</S.Description>
          <S.SwitchButton
            type="button"
            aria-label={switchAuthLabel}
            onClick={onSwitchAuth}
          >
            {switchAuthLabel}
          </S.SwitchButton>
        </S.ContentStack>
      </S.Content>
    </S.Section>
  );
};

export default AuthSidePanel;
