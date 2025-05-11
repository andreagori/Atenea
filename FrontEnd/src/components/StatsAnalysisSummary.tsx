
function StatsAnalysisSummary() {
    return (
        <div className="stats stats-horizontal lg:stats-horizontal text-white text-center">
            <div className="stat">
                <div className="stat-title text-2xl mb-2">Minutos estudiado</div>
                <div className="stat-value text-4xl mb-2">40 MIN</div>
                <div className="stat-desc text-lg">Última sesión de estudio</div>
            </div>

            <div className="stat">
                <div className="stat-title text-2xl mb-2">Cartas estudiadas</div>
                <div className="stat-value text-4xl mb-2">58</div>
                <div className="stat-desc text-lg">↗︎ de Mazos totales</div>
            </div>

            <div className="stat">
                <div className="stat-title text-2xl mb-2">Última calificación</div>
                <div className="stat-value text-4xl ">77/100</div>
                <div className="stat-desc text-lg">↘︎ Pruebas simuladas n.10</div>
            </div>
        </div>
    )
}

export default StatsAnalysisSummary