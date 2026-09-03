import { useNavigate } from 'react-router-dom';

import { useLoginForm } from '@/features/auth-page/login/model/useLoginForm';
import * as S from '@/pages/auth-page/style';
import Loading from '@/shared/components/loading';
import LoginPanel from '@/widgets/auth-page/login-page';

const LoginForm = () => {
  const navigate = useNavigate();
  const form = useLoginForm(() => navigate('/main'));

  return (
    <>
      {form.isSubmitting && (
        <S.FullOverlay role="status" aria-live="polite">
          <Loading />
        </S.FullOverlay>
      )}

      <LoginPanel {...form} />
    </>
  );
};

export default LoginForm;
