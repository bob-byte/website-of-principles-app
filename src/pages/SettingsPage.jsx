import DeleteAccountForm from "../components/settings/DeleteAccountForm";
import { useTranslation } from "../locale/LocaleProvider";

const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.set.principles";
const IOS_STORE_URL = "https://apps.apple.com/app/id6503646940";

function SettingsPage() {
  const { translate } = useTranslation();

  return (
    <main className="settings-page">
      <section className="settings-page__card container">
        <h1>{translate("settings.title")}</h1>

        <p className="settings-page__notice">
          <b>{translate("settings.importantLabel")}</b> {translate("settings.importantText")}
        </p>

        <p className="settings-page__notice">{translate("settings.aiNotice")}</p>

        <DeleteAccountForm />
      </section>

      <section className="settings-page__downloads container">
        <h2>{translate("settings.downloadTitle")}</h2>
        <p>{translate("settings.downloadText")}</p>
        <div className="settings-page__store-links">
          <a
            href={ANDROID_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="settings-page__store-btn settings-page__store-btn--android"
          >
            {translate("settings.android")}
          </a>
          <a
            href={IOS_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="settings-page__store-btn settings-page__store-btn--ios"
          >
            {translate("settings.ios")}
          </a>
        </div>
      </section>
    </main>
  );
}

export default SettingsPage;
