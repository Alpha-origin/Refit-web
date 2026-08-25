import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as S from '@/pages/auth-page/style';
import Loading from "@/shared/components/loading";
import { AUTH_PAGE_SIDE_CONTENT } from '@/shared/constants/auth-page';
import AuthSidePanel from '@/widgets/auth-page/auth-side';

import SignUpForm from './index';

const SignUpScreen = () => {
  const navigate = useNavigate();
  const sideContent = AUTH_PAGE_SIDE_CONTENT.signup;
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <S.Container 
      $isLogin={false}
      onSubmitCapture={() => setIsSubmitting(true)}
    >
      {isSubmitting && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
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

      <SignUpForm />
    </S.Container>
  );
};

export default SignUpScreen;