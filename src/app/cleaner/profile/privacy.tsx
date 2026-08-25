
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';
export default function PrivacyScreen() {
    return <StaticContentScreen title="Privacy Policy" sections={LEGAL_CONTENT} />;
}