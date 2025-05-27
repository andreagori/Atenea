import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number | 'Todas';
  totalItems: number;
  variant?: 'blue' | 'purple';
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  variant = 'blue',
  className = ""
}) => {
  if (pageSize === 'Todas' || totalPages <= 1) {
    return null;
  }

  // Colores según la variante
  const colors = {
    blue: {
      bg: 'bg-darkComponent',
      hover: 'hover:bg-darkComponent2',
      active: 'bg-gradient-to-r from-darkSecondary to-darkPrimary',
      text: 'text-white'
    },
    purple: {
      bg: 'bg-darkPrimaryPurple',
      hover: 'hover:bg-darkPrimaryPurple2',
      active: 'bg-gradient-to-r from-darkSecondaryPurple to-darkPrimaryPurple',
      text: 'text-white'
    }
  };

  const colorScheme = colors[variant];

  // Calcular rango simplificado (solo mostrar 3 páginas máximo)
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar página actual y adyacentes
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-1 mt-4 relative ${className}`}>
      {/* Página anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-8 h-8 rounded ${colorScheme.bg} ${colorScheme.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${colorScheme.text} relative`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Números de página */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-8 h-8 text-darkInfo text-sm relative">
              ···
            </span>
          ) : (
            <button
              onClick={() => onPageChange(Number(page))}
              className={`flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition-all duration-200 relative ${
                currentPage === page
                  ? `${colorScheme.active} ${colorScheme.text} shadow-md`
                  : `${colorScheme.bg} ${colorScheme.hover} ${colorScheme.text}`
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Página siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-8 h-8 rounded ${colorScheme.bg} ${colorScheme.hover} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${colorScheme.text} relative`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};