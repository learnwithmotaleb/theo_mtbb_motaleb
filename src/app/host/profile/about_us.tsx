import { useT } from '@/i18n';
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';

export default function AboutUsScreen() {
    const t = useT();
    return (
        <StaticContentScreen
            title={t("About us")}
            contentType="about_us"
            sections={LEGAL_CONTENT}
        />
    );
}
