
import { StaticContentScreen } from '@/components/Profiles/StaticContentScreen';
import { LEGAL_CONTENT } from '@/constants/legalContent';
export default function AboutUsScreen() {
    return <StaticContentScreen title="About us" sections={LEGAL_CONTENT} />;
}