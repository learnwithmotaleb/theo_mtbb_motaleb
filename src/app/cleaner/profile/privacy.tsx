import { useT } from '@/i18n';
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';

export default function PrivacyScreen() {
    const t = useT();
    return (
        <StaticContentScreen
            title={t("Privacy Policy")}
            contentType="privacy_policy"
            sections={LEGAL_CONTENT}
        />
    );
}
