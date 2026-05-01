import { PublicLayout } from "@/components/layout";
import {
  WelcomeHero,
  SectionMethods,
  SectionModes,
  SectionAnalysis,
  WelcomeFinalCTA,
  WelcomeFooter,
  BackToTop,
} from "@/components/welcome";

/**
 * Public welcome page (`/`).
 *
 * Pure composition — every section lives in `@/components/welcome` and is
 * independently editable. Sections that depended on un-validated stats
 * (spaced-repetition retention claim, habit/streak data, deck previews)
 * are intentionally omitted until backed by real product data.
 */
const Home = () => (
  <PublicLayout>
    <WelcomeHero />
    <SectionMethods />
    <SectionModes />
    <SectionAnalysis />
    <WelcomeFinalCTA />
    <WelcomeFooter />
    <BackToTop />
  </PublicLayout>
);

export default Home;
