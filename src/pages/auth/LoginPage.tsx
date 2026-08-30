import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormField } from '../../components/auth/FormField';
import { AlertBanner } from '../../components/auth/AlertBanner';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuthStore } from '../../store/authStore';
import { signIn, resendConfirmationEmail } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import type { TranslationKey } from '../../i18n/types';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (status === 'authenticated') navigate(redirectTo, { replace: true });
  }, [status, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = t('auth.errors.emailRequired');
    else if (!isValidEmail(email)) errors.email = t('auth.errors.emailInvalid');
    if (!password) errors.password = t('auth.errors.passwordRequired');

    setFieldErrors(errors);
    setFormError(null);
    setResendState('idle');
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (result.errorKey) {
      setFormError(result.errorKey);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  const handleResend = async () => {
    setResendState('sending');
    await resendConfirmationEmail(email.trim());
    setResendState('sent');
  };

  return (
    <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && (
          <AlertBanner variant="error">
            {t(formError)}
            {formError === 'auth.errors.emailNotConfirmed' && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState !== 'idle'}
                className="mt-2 block font-semibold underline underline-offset-2 disabled:opacity-60"
              >
                {t('auth.login.resendConfirmationButton')}
              </button>
            )}
            {resendState === 'sent' && (
              <p className="mt-1 text-xs">{t('auth.login.resendConfirmationSuccess')}</p>
            )}
          </AlertBanner>
        )}

        <FormField
          id="login-email"
          type="email"
          label={t('auth.login.emailLabel')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <FormField
          id="login-password"
          type="password"
          label={t('auth.login.passwordLabel')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            {t('auth.login.forgotPasswordLink')}
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('auth.login.submitting') : t('auth.login.submitButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.login.noAccount')}{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          {t('auth.login.signupLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}
