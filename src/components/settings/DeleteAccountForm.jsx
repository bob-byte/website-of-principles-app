import { useState } from "react";
import AppButton from "../AppButton";
import EmailVerificationModal from "./EmailVerificationModal";
import { getDeletionMessageKey, startAccountDeletion, confirmAccountDeletion } from "../../api/deleteAccount";
import { useTranslation } from "../../locale/LocaleProvider";

function DeleteAccountForm() {
  const { translate } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [deletionSession, setDeletionSession] = useState(null);

  const resetAfterSuccess = () => {
    setEmail("");
    setPassword("");
    setConfirmed(false);
    setDeletionSession(null);
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setIsSuccess(false);
    setModalError(null);

    if (!confirmed) {
      setMessage(translate("settings.confirmRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await startAccountDeletion({
        email: email.trim(),
        password,
      });
      setDeletionSession(session);
      setIsModalOpen(true);
    } catch (error) {
      setMessage(translate(getDeletionMessageKey(error)));
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsModalOpen(false);
    setModalError(null);
    setDeletionSession(null);
  };

  const handleConfirmCode = async (code) => {
    if (!deletionSession) {
      return;
    }

    setModalError(null);
    setIsSubmitting(true);
    try {
      const result = await confirmAccountDeletion({
        token: deletionSession.token,
        code,
        verificationCode: deletionSession.verificationCode,
      });
      setMessage(result);
      setIsSuccess(true);
      resetAfterSuccess();
    } catch (error) {
      setModalError(translate(getDeletionMessageKey(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="settings-page__form" onSubmit={handleSubmit} noValidate>
        <div className="settings-page__field">
          <label htmlFor="settings-email">{translate("settings.emailLabel")}</label>
          <input
            id="settings-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </div>

        <div className="settings-page__field">
          <label htmlFor="settings-password">{translate("settings.passwordLabel")}</label>
          <input
            id="settings-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting || isSuccess}
          />
        </div>

        <label className="settings-page__checkbox">
          <input
            type="checkbox"
            name="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={isSubmitting || isSuccess}
            required
          />
          <span>{translate("settings.confirmLabel")}</span>
        </label>

        {message && (
          <p
            className={`settings-page__message${isSuccess ? " settings-page__message--success" : " settings-page__message--error"}`}
            role={isSuccess ? "status" : "alert"}
          >
            {message}
          </p>
        )}

        <AppButton
          type="submit"
          variant="danger"
          className="settings-page__submit"
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? translate("settings.sendingCode") : translate("settings.deleteButton")}
        </AppButton>
      </form>

      <EmailVerificationModal
        email={email.trim()}
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCode}
      />
    </>
  );
}

export default DeleteAccountForm;
