import { useEffect, useRef, useState } from "react";
import AppButton from "../AppButton";
import { useTranslation } from "../../locale/LocaleProvider";

function EmailVerificationModal({
  email,
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}) {
  const { translate } = useTranslation();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", "", "", ""]);
      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) {
      return;
    }

    event.preventDefault();
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(digits.join(""));
  };

  return (
    <div className="settings-modal" role="presentation" onClick={onClose}>
      <div
        className="settings-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-verification-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="settings-verification-title">{translate("settings.verificationTitle")}</h2>
        <p className="settings-modal__text">
          {translate("settings.verificationText")} <strong>{email}</strong>
        </p>

        <form className="settings-modal__form" onSubmit={handleSubmit}>
          <div className="settings-modal__code-inputs" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="settings-modal__code-input"
                value={digit}
                disabled={isSubmitting}
                aria-label={`${translate("settings.verificationDigit")} ${index + 1}`}
                onChange={(event) => handleDigitChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="settings-page__message settings-page__message--error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="settings-modal__actions">
            <AppButton
              type="button"
              variant="ghost"
              className="settings-modal__cancel"
              disabled={isSubmitting}
              onClick={onClose}
            >
              {translate("settings.verificationCancel")}
            </AppButton>
            <AppButton
              type="submit"
              variant="danger"
              className="settings-modal__confirm"
              disabled={isSubmitting || digits.some((digit) => !digit)}
            >
              {isSubmitting
                ? translate("settings.deleting")
                : translate("settings.verificationConfirm")}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailVerificationModal;
