import React from 'react';

export function ButtonCustom({
    type = 'submit',
    text,
    onClick,
    disabled = false,
    height = 'auto',
    width = 'auto',
    isGradient = false,
    gradientColors = ['#00f', '#f00'],
    gradientDirection = 'to right',
    border = 'none',
    icon = null,
    fontSize = '16px',
    color = '#000',
    hoverColor = '#fff',
    hoverBackground = '#00f',
    disabledColor = '#ccc',
    disabledBackground = '#eee',
}: {
    type?: 'button' | 'submit' | 'reset';
    text: string;
    onClick: () => void;
    disabled?: boolean;
    height?: string;
    width?: string;
    isGradient?: boolean;
    gradientColors?: string[];
    gradientDirection?: string;
    border?: string;
    icon?: React.ReactNode;
    fontSize?: string;
    color?: string;
    hoverColor?: string;
    hoverBackground?: string;
    disabledColor?: string;
    disabledBackground?: string;
}) {
    const buttonStyle: React.CSSProperties = {
        height,
        width,
        border,
        fontSize,
        color,
        background: isGradient ? `linear-gradient(${gradientDirection}, ${gradientColors.join(', ')})` : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s, color 0.3s',
    };

    const disabledStyle: React.CSSProperties = {
        color: disabledColor,
        background: disabledBackground,
    };

    return (
        <button
            className={`btn btn-custom ${disabled ? 'btn-disabled' : ''}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={disabled ? { ...buttonStyle, ...disabledStyle } : buttonStyle}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.background = hoverBackground;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.color = color;
                    e.currentTarget.style.background = isGradient ? `linear-gradient(${gradientDirection}, ${gradientColors.join(', ')})` : color;
                }
            }}
        >
            {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
            {text}
        </button>
    );
}