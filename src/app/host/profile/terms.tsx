import { useT } from '@/i18n';
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';

export default function TermsScreen() {
    const t = useT();
    return (
        <StaticContentScreen
            title={t("Terms & Conditions")}
            contentType="terms_of_use"
            sections={LEGAL_CONTENT}
        />
    );
}
