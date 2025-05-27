import { useAnalytics } from "@/hooks/useAnalytics";

function StatsAnalysisSummary() {
    const { data, loading, error } = useAnalytics({ days: 30 });

    if (loading) {
        return (
            <div className="stats stats-horizontal lg:stats-horizontal text-white text-center animate-pulse">
                <div className="stat">
                    <div className="stat-title text-2xl mb-2">Minutos estudiados</div>
                    <div className="stat-value text-4xl mb-2 bg-darkSecondaryPurple rounded h-12 w-24"></div>
                    <div className="stat-desc text-lg">Última sesión</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-2xl mb-2">Sesiones realizadas</div>
                    <div className="stat-value text-4xl mb-2 bg-darkSecondaryPurple rounded h-12 w-16"></div>
                    <div className="stat-desc text-lg">Total</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-2xl mb-2">Última calificación</div>
                    <div className="stat-value text-4xl mb-2 bg-darkSecondaryPurple rounded h-12 w-20"></div>
                    <div className="stat-desc text-lg">Último test</div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="stats stats-horizontal lg:stats-horizontal text-white text-center">
                <div className="stat">
                    <div className="stat-title text-xl text-darkDanger">Error al cargar datos</div>
                    <div className="stat-desc text-sm">Intenta recargar la página</div>
                </div>
            </div>
        );
    }

    // 📊 Obtener datos directos del usuario específico
    const lastSession = data.dailyStudyTime?.[data.dailyStudyTime.length - 1];
    
    // 🎯 Calcular sesiones reales del usuario (suma de todas las sesiones por día)
    const totalUserSessions = data.dailyStudyTime?.reduce((acc, day) => {
        return acc + (day.minutes > 0 ? 1 : 0);
    }, 0) || 0;
    
    const lastTest = data.testScores?.[data.testScores.length - 1];

    return (
        <div className="stats stats-horizontal lg:stats-horizontal text-white text-center">
            <div className="stat">
                <div className="stat-title text-2xl mb-2 text-darkSecondaryPurple">Minutos estudiados</div>
                <div className="stat-value text-4xl mb-2 text-white">
                    {lastSession?.minutes || 0} MIN
                </div>
                <div className="stat-desc text-lg text-darkInfo">
                    Última sesión de estudio
                </div>
            </div>

            <div className="stat">
                <div className="stat-title text-2xl mb-2 text-darkSecondaryPurple">Sesiones realizadas</div>
                <div className="stat-value text-4xl mb-2 text-white">
                    {totalUserSessions}
                </div>
                <div className="stat-desc text-lg text-darkInfo">
                    Total del usuario
                </div>
            </div>

            <div className="stat">
                <div className="stat-title text-2xl mb-2 text-darkSecondaryPurple">Última calificación</div>
                <div className="stat-value text-4xl text-white">
                    {lastTest ? `${lastTest.score}%` : "Sin tests"}
                </div>
                <div className="stat-desc text-lg text-darkInfo">
                    {lastTest ? "Último test realizado" : "No hay tests"}
                </div>
            </div>
        </div>
    );
}

export default StatsAnalysisSummary;