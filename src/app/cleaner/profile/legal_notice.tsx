
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';
export default function LegalNoticeScreen() {
    return <StaticContentScreen title="Legal Notice" sections={LEGAL_CONTENT} />;
}