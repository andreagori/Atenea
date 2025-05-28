import { useAnalytics } from "@/hooks/useAnalytics";

function StatsAnalysisSummary() {
    const { data, loading, error } = useAnalytics({ days: 30 });

    if (loading) {
        return (
            <div className="w-full px-8 py-6">
                <div className="grid grid-cols-3 gap-8 animate-pulse">
                    <div className="text-center">
                        <div className="text-lg mb-3 text-darkSecondaryPurple">Minutos estudiados</div>
                        <div className="bg-darkSecondaryPurple rounded h-12 w-20 mx-auto mb-3"></div>
                        <div className="text-sm text-darkInfo">Última sesión</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg mb-3 text-darkSecondaryPurple">Sesiones realizadas</div>
                        <div className="bg-darkSecondaryPurple rounded h-12 w-16 mx-auto mb-3"></div>
                        <div className="text-sm text-darkInfo">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg mb-3 text-darkSecondaryPurple">Última calificación</div>
                        <div className="bg-darkSecondaryPurple rounded h-12 w-20 mx-auto mb-3"></div>
                        <div className="text-sm text-darkInfo">Último test</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="w-full px-8 py-6">
                <div className="text-center">
                    <div className="text-xl text-red-400 mb-2">Error al cargar datos</div>
                    <div className="text-sm text-gray-400">Intenta recargar la página</div>
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
        <div className="w-full px-8 py-6">
            <div className="grid grid-cols-3 gap-8">
                
                {/* Minutos estudiados */}
                <div className="text-center px-4">
                    <div className="text-lg font-semibold mb-4 text-darkSecondaryPurple">
                        Minutos estudiados
                    </div>
                    <div className="text-5xl font-bold mb-3 text-white">
                        {lastSession?.minutes || 0}
                    </div>
                    <div className="text-xs uppercase tracking-wide mb-2 text-gray-300">
                        MINUTOS
                    </div>
                    <div className="text-sm text-darkInfo">
                        Última sesión de estudio
                    </div>
                </div>

                {/* Sesiones realizadas */}
                <div className="text-center px-4 border-l border-r border-darkSecondaryPurple border-opacity-30">
                    <div className="text-lg font-semibold mb-4 text-darkSecondaryPurple">
                        Sesiones realizadas
                    </div>
                    <div className="text-5xl font-bold mb-3 text-white">
                        {totalUserSessions}
                    </div>
                    <div className="text-xs uppercase tracking-wide mb-2 text-gray-300">
                        SESIONES
                    </div>
                    <div className="text-sm text-darkInfo">
                        Total del usuario
                    </div>
                </div>

                {/* Última calificación */}
                <div className="text-center px-4">
                    <div className="text-lg font-semibold mb-4 text-darkSecondaryPurple">
                        Última calificación
                    </div>
                    <div className="text-5xl font-bold mb-3 text-white">
                        {lastTest ? lastTest.score : "--"}
                    </div>
                    <div className="text-xs uppercase tracking-wide mb-2 text-gray-300">
                        {lastTest ? "PORCENTAJE" : "SIN DATOS"}
                    </div>
                    <div className="text-sm text-darkInfo">
                        {lastTest ? "Último test realizado" : "No hay tests disponibles"}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default StatsAnalysisSummary;