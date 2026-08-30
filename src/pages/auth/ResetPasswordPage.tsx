import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormField } from '../../components/auth/FormField';
import { AlertBanner } from '../../components/auth/AlertBanner';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuthStore } from '../../store/authStore';
import { updatePassword } from '../../services/authService';
import { MIN_PASSWORD_LENGTH } from '../../utils/validation';
import type { TranslationKey } from '../../i18n/types';

type FieldErrors = { password?: string; confirmPassword?: string };

// Il link ricevuto via email stabilisce automaticamente una sessione di
// recupero (gestita da AuthProvider tramite onAuthStateChange, vedi
// src/providers/AuthProvider.tsx): qui ci limitiamo a leggere lo stato
// risultante da authStore, senza logica di parsing URL duplicata.
export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (status === 'loading') {
    return (
      <AuthLayout title={t('auth.resetPassword.title')}>
        <div className="flex flex-col items-center gap-3 py-4 text-sm text-slate-500 dark:text-slate-400">
          <Spinner />
          {t('auth.resetPassword.checkingLink')}
        </div>
      </AuthLayout>
    );
  }

  if (status === 'guest' && !done) {
    return (
      <AuthLayout title={t('auth.resetPassword.invalidLinkTitle')}>
        <AlertBanner variant="error">{t('auth.resetPassword.invalidLinkDescription')}</AlertBanner>
        <Link
          to="/forgot-password"
          className="mt-6 block text-center text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          {t('auth.resetPassword.requestNewLink')}
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title={t('auth.resetPassword.successTitle')}>
        <AlertBanner variant="success">{t('auth.resetPassword.successDescription')}</AlertBanner>
        <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/')}>
          {t('auth.resetPassword.successCta')}
        </Button>
      </AuthLayout>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!password) errors.password = t('auth.errors.passwordRequired');
    else if (password.length < MIN_PASSWORD_LENGTH) errors.password = t('auth.errors.passwordTooShort');
    if (confirmPassword !== password) errors.confirmPassword = t('auth.errors.passwordMismatch');

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (result.errorKey) {
      setFormError(result.errorKey);
      return;
    }
    setDone(true);
  };

  return (
    <AuthLayout title={t('auth.resetPassword.title')} subtitle={t('auth.resetPassword.subtitle')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <AlertBanner variant="error">{t(formError)}</AlertBanner>}

        <FormField
          id="reset-password"
          type="password"
          label={t('auth.resetPassword.passwordLabel')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <FormField
          id="reset-password-confirm"
          type="password"
          label={t('auth.resetPassword.confirmPasswordLabel')}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submitButton')}
        </Button>
      </form>
    </AuthLayout>
  );
}
