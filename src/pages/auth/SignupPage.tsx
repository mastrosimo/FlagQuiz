import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormField } from '../../components/auth/FormField';
import { AlertBanner } from '../../components/auth/AlertBanner';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuthStore } from '../../store/authStore';
import { signUp, resendConfirmationEmail } from '../../services/authService';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../../utils/validation';
import type { TranslationKey } from '../../i18n/types';

type FieldErrors = { email?: string; password?: string; confirmPassword?: string };

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (status === 'authenticated' && !awaitingConfirmation) navigate('/', { replace: true });
  }, [status, awaitingConfirmation, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = t('auth.errors.emailRequired');
    else if (!isValidEmail(email)) errors.email = t('auth.errors.emailInvalid');
    if (!password) errors.password = t('auth.errors.passwordRequired');
    else if (password.length < MIN_PASSWORD_LENGTH) errors.password = t('auth.errors.passwordTooShort');
    if (confirmPassword !== password) errors.confirmPassword = t('auth.errors.passwordMismatch');

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.errorKey) {
      setFormError(result.errorKey);
      return;
    }
    if (result.needsEmailConfirmation) {
      setAwaitingConfirmation(true);
      return;
    }
    navigate('/', { replace: true });
  };

  const handleResend = async () => {
    setResendState('sending');
    await resendConfirmationEmail(email.trim());
    setResendState('sent');
  };

  if (awaitingConfirmation) {
    return (
      <AuthLayout title={t('auth.signup.successTitle')}>
        <AlertBanner variant="success">{t('auth.signup.successDescription')}</AlertBanner>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendState !== 'idle'}
          className="mt-4 block text-sm font-semibold text-brand-600 underline underline-offset-2 disabled:opacity-60 dark:text-brand-400"
        >
          {t('auth.signup.resendButton')}
        </button>
        {resendState === 'sent' && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('auth.signup.resendSuccess')}</p>
        )}
        <Link
          to="/"
          className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:underline dark:text-slate-300"
        >
          {t('auth.signup.backHome')}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.signup.title')} subtitle={t('auth.signup.subtitle')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <AlertBanner variant="error">{t(formError)}</AlertBanner>}

        <FormField
          id="signup-email"
          type="email"
          label={t('auth.signup.emailLabel')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <FormField
          id="signup-password"
          type="password"
          label={t('auth.signup.passwordLabel')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          hint={t('auth.signup.passwordHint')}
          autoComplete="new-password"
        />
        <FormField
          id="signup-confirm-password"
          type="password"
          label={t('auth.signup.confirmPasswordLabel')}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('auth.signup.submitting') : t('auth.signup.submitButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.signup.hasAccount')}{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t('auth.signup.loginLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}
