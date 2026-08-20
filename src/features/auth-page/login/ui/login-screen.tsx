import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from '@/pages/auth-page/style';
import Loading from "@/shared/components/loading";
import { AUTH_PAGE_SIDE_CONTENT } from '@/shared/constants/auth-page';
import AuthSidePanel from '@/widgets/auth-page/auth-side';

import LoginForm from './index';

const LoginScreen = () => {
  const navigate = useNavigate();
  const sideContent = AUTH_PAGE_SIDE_CONTENT.login;
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <S.Container 
      $isLogin 
      onSubmitCapture={() => setIsSubmitting(true)}
    >
      {/* 1. 화면 전체를 덮는 감싸기 영역 추가 */}
      {isSubmitting && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // 배경을 약간 어둡게/밝게 가림
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // 패널들보다 위에 배치
          }}
        >
          <Loading />
        </div>
      )}

      <AuthSidePanel
        description={sideContent.description}
        imageAlt={sideContent.imageAlt}
        switchAuthLabel={sideContent.switchAuthLabel}
        onSwitchAuth={() => navigate(sideContent.switchAuthPath)}
      />

      <LoginForm />
    </S.Container>
  );
};

export default LoginScreen;