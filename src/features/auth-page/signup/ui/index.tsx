import { useNavigate } from 'react-router-dom';

import { useSignUpForm } from '@/features/auth-page/signup/model/useSignUpForm';
import * as S from '@/pages/auth-page/style';
import Loading from '@/shared/components/loading';
import SignUpPanel from '@/widgets/auth-page/signup-page';

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useSignUpForm(() => navigate('/login'));

  return (
    <>
      {form.isSubmitting && (
        <S.FullOverlay role="status" aria-live="polite">
          <Loading />
        </S.FullOverlay>
      )}

      <SignUpPanel {...form} />
    </>
  );
};

export default SignUpForm;
