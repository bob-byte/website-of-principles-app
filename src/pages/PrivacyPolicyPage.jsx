import LegalPage from "../components/legal/LegalPage";
import {
  privacyPolicyIntroHtml,
  privacyPolicySections,
} from "../content/legalDocuments";

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy of Principles"
      updatedAt="Last updated December 31, 2024"
      introHtml={privacyPolicyIntroHtml}
      sections={privacyPolicySections}
    />
  );
}

export default PrivacyPolicyPage;
