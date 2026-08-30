import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormField } from '../../components/auth/FormField';
import { AlertBanner } from '../../components/auth/AlertBanner';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n/useTranslation';
import { requestPasswordReset } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import type { TranslationKey } from '../../i18n/types';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<TranslationKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setFieldError(t('auth.errors.emailRequired'));
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError(t('auth.errors.emailInvalid'));
      return;
    }
    setFieldError(undefined);
    setFormError(null);
    setSubmitting(true);
    const result = await requestPasswordReset(email.trim());
    setSubmitting(false);

    if (result.errorKey) {
      setFormError(result.errorKey);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title={t('auth.forgotPassword.successTitle')}>
        <AlertBanner variant="success">{t('auth.forgotPassword.successDescription')}</AlertBanner>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.forgotPassword.title')} subtitle={t('auth.forgotPassword.subtitle')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <AlertBanner variant="error">{t(formError)}</AlertBanner>}

        <FormField
          id="forgot-password-email"
          type="email"
          label={t('auth.forgotPassword.emailLabel')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldError}
          autoComplete="email"
        />

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submitButton')}
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:underline dark:text-slate-300"
      >
        {t('auth.forgotPassword.backToLogin')}
      </Link>
    </AuthLayout>
  );
}
