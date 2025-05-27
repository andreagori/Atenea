import React from 'react';

type PageSize = 5 | 10 | 25 | 50 | 'Todas';

interface PageSizeSelectorProps {
  pageSize: PageSize;
  onPageSizeChange: (size: PageSize) => void;
  totalItems: number;
  variant?: 'blue' | 'purple'; // Nueva prop para el color
  className?: string;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  onPageSizeChange,
  totalItems,
  variant = 'blue',
  className = ""
}) => {
  const options: PageSize[] = [5, 10, 25, 50, 'Todas'];

  // Colores según la variante
  const colors = {
    blue: {
      bg: 'bg-darkComponent',
      hover: 'hover:bg-darkComponent2',
      border: 'border-darkComponentElement focus:border-darkSecondary',
      text: 'text-white'
    },
    purple: {
      bg: 'bg-darkPrimaryPurple',
      hover: 'hover:bg-darkPrimaryPurple2',
      border: 'border-darkComponentElement focus:border-darkSecondaryPurple',
      text: 'text-white'
    }
  };

  const colorScheme = colors[variant];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-darkInfo">Mostrar:</span>
      <select
        value={pageSize.toString()}
        onChange={(e) => {
          const value = e.target.value === 'Todas' ? 'Todas' : Number(e.target.value);
          onPageSizeChange(value as PageSize);
        }}
        className={`px-2 py-1 text-sm rounded ${colorScheme.bg} ${colorScheme.hover} ${colorScheme.text} border ${colorScheme.border} focus:outline-none transition-colors duration-200 cursor-pointer`}
      >
        {options.map((size) => (
          <option key={size.toString()} value={size} className="bg-darkComponent text-white">
            {size === 'Todas' ? `Todas` : size}
          </option>
        ))}
      </select>
    </div>
  );
};