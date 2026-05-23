import Header from './components/Header';
import SeoHead from './components/SeoHead';
import GetStarted from './components/GetStarted';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserAgreementPage from './pages/UserAgreementPage';
import SettingsPage from './pages/SettingsPage';
import { getPageSeo } from './config/seo';
import { useTranslation } from './locale/LocaleProvider';

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const { locale } = useTranslation();

  const isPrivacyPolicy = pathname === "/privacypolicy";
  const isUserAgreement = pathname === "/useragreement";
  const isSettings = pathname === "/settings";
  const isHome = !isPrivacyPolicy && !isUserAgreement && !isSettings;

  const route = isPrivacyPolicy
    ? "privacyPolicy"
    : isUserAgreement
      ? "userAgreement"
      : isSettings
        ? "settings"
        : "home";

  const seo = getPageSeo(route, locale);

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={pathname}
        includeWebsiteSchema={isHome}
      />
      <Header />
      {isPrivacyPolicy && <PrivacyPolicyPage />}
      {isUserAgreement && <UserAgreementPage />}
      {isSettings && <SettingsPage />}
      {isHome && <GetStarted />}
    </>
  );
}

export default App;
