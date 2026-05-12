import { useUser } from "@/hooks/useUser";
import { useDecks } from "@/hooks/useDeck";
import { useDueToday } from "@/hooks/useDueToday";
import {
  DashboardHeader,
  DashboardKpiRow,
  DashboardActions,
  RecentDecksSection,
  DueTodaySection,
} from "@/components/dashboard";

const HomeLoginIn = () => {
  const { user, loading: userLoading } = useUser();
  const { decks, loading: decksLoading } = useDecks();
  const { decks: dueDecks, total: dueTotal, loading: dueLoading } = useDueToday();

  return (
    <div className="animate-v2-fade">
      <DashboardHeader username={user?.username} loading={userLoading} />
      <DueTodaySection decks={dueDecks} total={dueTotal} loading={dueLoading} />
      <DashboardKpiRow deckCount={decks.length} decksLoading={decksLoading} />
      <DashboardActions />
      <RecentDecksSection decks={decks} loading={decksLoading} />
    </div>
  );
};

export default HomeLoginIn;
