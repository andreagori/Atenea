import React, { useState } from 'react';
import { Calendar, Filter, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { TimeRange } from '../types/analytics.types';

interface AnalyticsFiltersProps {
  onTimeRangeChange: (timeRange: TimeRange) => void;
  currentTimeRange: TimeRange;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  onTimeRangeChange,
  currentTimeRange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);

  const quickRanges = [
    { label: '7 días', days: 7, icon: Clock },
    { label: '30 días', days: 30, icon: Target },
    { label: '1 año', days: 365, icon: Calendar }
  ];

  const handleQuickRangeSelect = (days: number) => {
    onTimeRangeChange({ days });
    setShowCustomRange(false);
    setIsExpanded(false); // Colapsar después de seleccionar
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onTimeRangeChange({
      ...currentTimeRange,
      [field]: value,
      days: undefined
    });
  };

  const clearFilters = () => {
    onTimeRangeChange({ days: 30 });
    setShowCustomRange(false);
    setIsExpanded(false);
  };

  const toggleCustomRange = () => {
    setShowCustomRange(!showCustomRange);
    if (!showCustomRange) {
      if (currentTimeRange.days) {
        onTimeRangeChange({
          startDate: '',
          endDate: ''
        });
      }
    }
  };

  const getCurrentFilterText = () => {
    if (currentTimeRange.days) {
      return `${currentTimeRange.days} días`;
    }
    if (currentTimeRange.startDate && currentTimeRange.endDate) {
      return 'Personalizado';
    }
    return '30 días';
  };

  return (
    <div className="mb-6">
      {/* Botón compacto cuando está colapsado */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 bg-darkPrimaryPurple text-white rounded-lg border border-darkSecondaryPurple hover:bg-[#774CFB] transition-all duration-200 shadow-lg"
      >
        <Filter size={16} />
        <span className="text-sm font-medium">Filtros</span>
        <span className="text-xs opacity-70">({getCurrentFilterText()})</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="mt-3 bg-darkPrimaryPurple rounded-xl p-4 border border-darkSecondaryPurple shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Header del panel expandido */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-darkSecondaryPurple">Seleccionar rango</h3>
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-xs bg-darkSecondaryPurple2 text-white rounded-md hover:bg-[#774CFB] transition-colors"
            >
              Resetear
            </button>
          </div>
            
          {/* Todos los filtros en una sola fila */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {/* Quick Range Buttons */}
            {quickRanges.map((range) => {
              const IconComponent = range.icon;
              const isActive = currentTimeRange.days === range.days;
              
              return (
                <button
                  key={range.days}
                  onClick={() => handleQuickRangeSelect(range.days)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? 'bg-gradient-to-b from-[#774CFB] to-[#2A0B7B] text-white shadow-lg scale-105'
                      : 'bg-darkSecondaryPurple2 text-white hover:bg-[#2A0B7B]'
                  }`}
                >
                  <IconComponent size={14} />
                  <span className="font-medium whitespace-nowrap">{range.label}</span>
                </button>
              );
            })}

            {/* Botón Personalizado */}
            <button
              onClick={toggleCustomRange}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                showCustomRange 
                  ? 'bg-gradient-to-b from-[#774CFB] to-[#2A0B7B] text-white shadow-lg scale-105'
                  : 'bg-darkSecondaryPurple2 text-white hover:bg-[#774CFB]'
              }`}
            >
              <Calendar size={14} />
              <span className="font-medium whitespace-nowrap">Personalizado</span>
            </button>

            {/* Campos de fecha inline cuando está activo */}
            {showCustomRange && (
              <>
                <input
                  type="date"
                  value={currentTimeRange.startDate || ''}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  placeholder="Inicio"
                  className="px-3 py-2 bg-white text-darkSecondaryPurple2 rounded-lg border border-[#774CFB] focus:outline-none focus:ring-1 focus:ring-[#774CFB] text-sm"
                />
                <input
                  type="date"
                  value={currentTimeRange.endDate || ''}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  placeholder="Fin"
                  className="px-3 py-2 bg-white text-darkSecondaryPurple2 rounded-lg border border-[#774CFB] focus:outline-none focus:ring-1 focus:ring-[#774CFB] text-sm"
                />
              </>
            )}
          </div>

          {/* Current Filter Summary */}
          <div className="p-2 bg-[#784cfb9c] rounded-lg border border-[#784cfb]">
            <div className="text-xs text-white text-center">
              <span className="font-medium">🔍 Aplicando: </span>
              <span className="opacity-90">
                {currentTimeRange.days 
                  ? `Últimos ${currentTimeRange.days} días`
                  : currentTimeRange.startDate && currentTimeRange.endDate
                    ? `${new Date(currentTimeRange.startDate).toLocaleDateString('es-ES')} - ${new Date(currentTimeRange.endDate).toLocaleDateString('es-ES')}`
                    : 'Últimos 30 días'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};