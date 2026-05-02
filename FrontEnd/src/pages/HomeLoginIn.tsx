import { useUser } from "@/hooks/useUser";
import { useDecks } from "@/hooks/useDeck";
import {
  DashboardHeader,
  DashboardKpiRow,
  DashboardActions,
  RecentDecksSection,
} from "@/components/dashboard";

/**
 * Authenticated home page. Renders inside the AppShell sidebar layout
 * (wired in AppRouter), so this component composes only the inner sections.
 */
const HomeLoginIn = () => {
  const { user, loading: userLoading } = useUser();
  const { decks, loading: decksLoading } = useDecks();

  return (
    <div className="animate-v2-fade">
      <DashboardHeader username={user?.username} loading={userLoading} />
      <DashboardKpiRow deckCount={decks.length} decksLoading={decksLoading} />
      <DashboardActions />
      <RecentDecksSection decks={decks} loading={decksLoading} />
    </div>
  );
};

export default HomeLoginIn;
