import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/auth/FormField';
import { AlertBanner } from '../components/auth/AlertBanner';
import { useTranslation } from '../i18n/useTranslation';
import { useAuthStore } from '../store/authStore';
import { signOut, updateEmail, updatePassword } from '../services/authService';
import { updateDisplayName, deleteAccount } from '../services/accountService';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../utils/validation';
import type { TranslationKey } from '../i18n/types';

export function AccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [displayName, setDisplayName] = useState('');
  const [nameError, setNameError] = useState<TranslationKey | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const nameLocked = profile?.displayNameLocked ?? false;

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<TranslationKey | null>(null);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [passwordError, setPasswordError] = useState<TranslationKey | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<TranslationKey | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
  }, [profile]);

  if (!user) return null;

  const handleSaveName = async (event: FormEvent) => {
    event.preventDefault();
    if (nameLocked) return;
    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError('account.displayNameRequired');
      return;
    }
    setNameError(null);
    setSavingName(true);
    setNameSuccess(false);
    const result = await updateDisplayName(user.id, trimmed);
    setSavingName(false);
    if (result.errorKey) {
      setNameError(result.errorKey);
      return;
    }
    setDisplayName(trimmed);
    setNameSuccess(true);
    // Aggiorna subito lo store condiviso: la navbar riflette il nuovo nome
    // senza reload, e il campo passa in stato "bloccato" immediatamente.
    setProfile({ displayName: trimmed, displayNameLocked: true });
  };

  const handleChangeEmail = async (event: FormEvent) => {
    event.preventDefault();
    setEmailSuccess(false);
    if (!isValidEmail(newEmail)) {
      setEmailError('auth.errors.emailInvalid');
      return;
    }
    setEmailError(null);
    setSavingEmail(true);
    const result = await updateEmail(newEmail.trim());
    setSavingEmail(false);
    if (result.errorKey) {
      setEmailError(result.errorKey);
      return;
    }
    setEmailSuccess(true);
    setNewEmail('');
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordSuccess(false);
    const errors: { password?: string; confirm?: string } = {};
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.password = t('auth.errors.passwordTooShort');
    }
    if (confirmPassword !== newPassword) {
      errors.confirm = t('auth.errors.passwordMismatch');
    }
    setPasswordFieldErrors(errors);
    setPasswordError(null);
    if (Object.keys(errors).length > 0) return;

    setSavingPassword(true);
    const result = await updatePassword(newPassword);
    setSavingPassword(false);
    if (result.errorKey) {
      setPasswordError(result.errorKey);
      return;
    }
    setPasswordSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteAccount();
    setDeleting(false);
    if (result.errorKey) {
      setDeleteError(result.errorKey);
      return;
    }
    setConfirmDeleteOpen(false);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{t('account.title')}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('account.subtitle')}</p>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('account.profileSectionTitle')}</p>
        {nameLocked ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{displayName}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('account.displayNameLockedNotice')}</p>
          </div>
        ) : (
          <>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSaveName}>
              <div className="flex-1">
                <FormField
                  id="account-display-name"
                  label={t('account.displayNameLabel')}
                  placeholder={t('account.displayNamePlaceholder')}
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setNameSuccess(false);
                    setNameError(null);
                  }}
                  error={nameError ? t(nameError) : undefined}
                  maxLength={60}
                />
              </div>
              <Button type="submit" disabled={savingName}>
                {savingName ? t('account.saving') : t('account.saveButton')}
              </Button>
            </form>
            {nameSuccess && (
              <p className="mt-2 text-sm text-success-600 dark:text-success-500">{t('account.saveSuccess')}</p>
            )}
          </>
        )}
      </Card>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('account.emailSectionTitle')}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('account.currentEmailLabel')}: <span className="font-medium text-slate-700 dark:text-slate-200">{user.email}</span>
        </p>
        {emailSuccess ? (
          <AlertBanner variant="success">
            <p className="font-semibold">{t('account.changeEmailSuccessTitle')}</p>
            <p className="mt-1 font-normal">{t('account.changeEmailSuccessDescription')}</p>
          </AlertBanner>
        ) : (
          <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleChangeEmail}>
            <div className="flex-1">
              <FormField
                id="account-new-email"
                type="email"
                label={t('account.newEmailLabel')}
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                error={emailError ? t(emailError) : undefined}
                autoComplete="email"
              />
            </div>
            <Button type="submit" disabled={savingEmail}>
              {savingEmail ? t('account.saving') : t('account.changeEmailButton')}
            </Button>
          </form>
        )}
      </Card>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('account.passwordSectionTitle')}</p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleChangePassword}>
          {passwordError && <AlertBanner variant="error">{t(passwordError)}</AlertBanner>}
          {passwordSuccess && <AlertBanner variant="success">{t('account.changePasswordSuccess')}</AlertBanner>}
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              id="account-new-password"
              type="password"
              label={t('account.newPasswordLabel')}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setPasswordSuccess(false);
              }}
              error={passwordFieldErrors.password}
              autoComplete="new-password"
            />
            <FormField
              id="account-confirm-password"
              type="password"
              label={t('account.confirmPasswordLabel')}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordSuccess(false);
              }}
              error={passwordFieldErrors.confirm}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="self-start" disabled={savingPassword}>
            {savingPassword ? t('account.saving') : t('account.changePasswordButton')}
          </Button>
        </form>
      </Card>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('account.sessionSectionTitle')}</p>
        <Button variant="secondary" className="mt-4" onClick={handleLogout}>
          {t('account.logoutButton')}
        </Button>
      </Card>

      <Card className="mt-6 p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{t('account.dangerZoneTitle')}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('account.dangerZoneDescription')}</p>
        <Button variant="danger" className="mt-4" onClick={() => setConfirmDeleteOpen(true)}>
          {t('account.deleteAccountButton')}
        </Button>
      </Card>

      <Modal open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{t('account.deleteConfirmTitle')}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('account.deleteConfirmDescription')}</p>
        {deleteError && (
          <div className="mt-3">
            <AlertBanner variant="error">{t(deleteError)}</AlertBanner>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>
            {t('account.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? t('account.deleting') : t('account.deleteConfirmButton')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
