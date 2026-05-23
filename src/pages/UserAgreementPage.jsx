import LegalPage from "../components/legal/LegalPage";
import {
  userAgreementIntroHtml,
  userAgreementSections,
} from "../content/legalDocuments";

function UserAgreementPage() {
  return (
    <LegalPage
      title="User Agreement of Principles"
      updatedAt="Last updated December 31, 2024"
      introHtml={userAgreementIntroHtml}
      sections={userAgreementSections}
    />
  );
}

export default UserAgreementPage;
