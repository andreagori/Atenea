import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { SpacedRepetitionData } from '../../types/analytics.types';

interface SpacedRepetitionChartProps {
    data: SpacedRepetitionData[];
    loading: boolean;
}

const DIFFICULTY_COLORS = {
    facil: '#10B981',      // Verde
    bien: '#3B82F6',       // Azul
    masomenos: '#F59E0B',  // Amarillo/Naranja
    dificil: '#EF4444'     // Rojo
};

const DIFFICULTY_LABELS = {
    facil: 'Fácil',
    bien: 'Bien',
    masomenos: 'Más o Menos',
    dificil: 'Difícil'
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div className="bg-darkPrimaryPurple2 border border-darkPrimaryPurple rounded-lg p-4 shadow-lg max-w-sm">
                <p className="text-white font-semibold mb-2">{label}</p>

                {Object.entries(data).map(([key, value]: [string, any]) => {
                    if (key === 'sessionName' || key === 'sessionId' || key === 'cardsDetails') return null;

                    const cards = data.cardsDetails?.[key] || [];
                    const count = typeof value === 'number' ? value : 0;

                    if (count === 0) return null;

                    return (
                        <div key={key} className="mb-2">
                            <p className="text-sm font-medium" style={{ color: DIFFICULTY_COLORS[key as keyof typeof DIFFICULTY_COLORS] }}>
                                {DIFFICULTY_LABELS[key as keyof typeof DIFFICULTY_LABELS]}: {count}
                            </p>
                            {cards.length > 0 && (
                                <div className="ml-2 max-h-20 overflow-y-auto">
                                    {cards.slice(0, 2).map((card: any, index: number) => (
                                        <p key={index} className="text-xs text-gray-300 truncate">
                                            • {card.title}
                                        </p>
                                    ))}
                                    {cards.length > 2 && (
                                        <p className="text-xs text-gray-400">... y {cards.length - 2} más</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

export const SpacedRepetitionChart: React.FC<SpacedRepetitionChartProps> = ({
    data,
    loading
}) => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'best' | 'worst'>('recent');
    const [maxSessions, setMaxSessions] = useState(5);

    // Procesar y filtrar datos
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let sortedData = [...data];

        switch (selectedFilter) {
            case 'recent':
                sortedData = sortedData
                    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
                    .slice(0, maxSessions);
                break;
            case 'best':
                sortedData = sortedData
                    .sort((a, b) => {
                        const aGood = a.cardsByDifficulty.facil.length + a.cardsByDifficulty.bien.length;
                        const bGood = b.cardsByDifficulty.facil.length + b.cardsByDifficulty.bien.length;
                        return bGood - aGood;
                    })
                    .slice(0, maxSessions);
                break;
            case 'worst':
                sortedData = sortedData
                    .sort((a, b) => {
                        const aBad = a.cardsByDifficulty.dificil.length + a.cardsByDifficulty.masomenos.length;
                        const bBad = b.cardsByDifficulty.dificil.length + b.cardsByDifficulty.masomenos.length;
                        return bBad - aBad;
                    })
                    .slice(0, maxSessions);
                break;
            case 'all':
            default:
                sortedData = sortedData.slice(0, maxSessions);
                break;
        }

        return sortedData;
    }, [data, selectedFilter, maxSessions]);

    const chartData = filteredData.map(session => ({
        sessionId: session.sessionId,
        sessionName: `${new Date(session.sessionDate).toLocaleDateString()} - ${session.deckName.substring(0, 15)}${session.deckName.length > 15 ? '...' : ''}`,
        facil: session.cardsByDifficulty.facil.length,
        bien: session.cardsByDifficulty.bien.length,
        masomenos: session.cardsByDifficulty.masomenos.length,
        dificil: session.cardsByDifficulty.dificil.length,
        cardsDetails: session.cardsByDifficulty
    }));

    // Datos para el gráfico de pie (basado en datos filtrados)
    const totalData = filteredData.reduce((acc, session) => {
        acc.facil += session.cardsByDifficulty.facil.length;
        acc.bien += session.cardsByDifficulty.bien.length;
        acc.masomenos += session.cardsByDifficulty.masomenos.length;
        acc.dificil += session.cardsByDifficulty.dificil.length;
        return acc;
    }, { facil: 0, bien: 0, masomenos: 0, dificil: 0 });

    if (loading) {
        return (
            <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                    Memorización Espaciada - Dificultad
                </h3>
                <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>No hay datos de memorización espaciada disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white rounded-xl p-6">
            {/* Header con filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-white">
                    Memorización Espaciada - Dificultad
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Filtro de tipo */}
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value as any)}
                        className="bg-darkPrimaryPurple2 text-white text-sm rounded-lg px-3 py-2 border border-white focus:border-purple-500 focus:outline-none"
                    >
                        <option value="recent">Más Recientes</option>
                        <option value="best">Mejores Resultados</option>
                        <option value="worst">Peores Resultados</option>
                        <option value="all">Todas</option>
                    </select>

                    {/* Filtro de cantidad */}
                    <select
                        value={maxSessions}
                        onChange={(e) => setMaxSessions(Number(e.target.value))}
                        className="bg-darkPrimaryPurple2 text-white text-sm rounded-lg px-3 py-2 border border-white focus:border-purple-500 focus:outline-none"
                    >
                        <option value={3}>3 sesiones</option>
                        <option value={5}>5 sesiones</option>
                        <option value={10}>10 sesiones</option>
                        <option value={20}>20 sesiones</option>
                    </select>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500/70 rounded-lg p-3 text-center">
                    <div className="text-green-400 text-2xl font-bold">{totalData.facil}</div>
                    <div className="text-gray-300 text-sm">Fácil</div>
                </div>
                <div className="bg-blue-500/70 rounded-lg p-3 text-center">
                    <div className="text-blue-400 text-2xl font-bold">{totalData.bien}</div>
                    <div className="text-gray-300 text-sm">Bien</div>
                </div>
                <div className="bg-yellow-500/70 rounded-lg p-3 text-center">
                    <div className="text-yellow-400 text-2xl font-bold">{totalData.masomenos}</div>
                    <div className="text-gray-300 text-sm">Más o Menos</div>
                </div>
                <div className="bg-red-500/70 rounded-lg p-3 text-center">
                    <div className="text-red-400 text-2xl font-bold">{totalData.dificil}</div>
                    <div className="text-gray-300 text-sm">Difícil</div>
                </div>
            </div>

            <div className="w-full">
                <h4 className="text-lg font-medium text-white mb-4">Por Sesión</h4>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A0B7B" />
                        <XAxis
                            dataKey="sessionName"
                            stroke="#9CA3AF"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="facil" name="Fácil" fill={DIFFICULTY_COLORS.facil} radius={[2, 2, 0, 0]} />
                        <Bar dataKey="bien" name="Bien" fill={DIFFICULTY_COLORS.bien} radius={[2, 2, 0, 0]} />
                        <Bar dataKey="masomenos" name="Más o Menos" fill={DIFFICULTY_COLORS.masomenos} radius={[2, 2, 0, 0]} />
                        <Bar dataKey="dificil" name="Difícil" fill={DIFFICULTY_COLORS.dificil} radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};