
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';
export default function TermsScreen() {
    return <StaticContentScreen title="Terms & Conditions" sections={LEGAL_CONTENT} />;
}