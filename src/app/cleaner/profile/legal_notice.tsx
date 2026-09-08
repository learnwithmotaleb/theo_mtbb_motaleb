import { useT } from '@/i18n';
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';

export default function LegalNoticeScreen() {
    const t = useT();
    return (
        <StaticContentScreen
            title={t("Legal Notice")}
            contentType="legal_notice"
            sections={LEGAL_CONTENT}
        />
    );
}
