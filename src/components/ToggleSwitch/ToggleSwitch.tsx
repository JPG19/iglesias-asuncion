import React, { useRef } from 'react';

interface ToggleSwitchProps {
  // Whether the toggle is checked
  checked: boolean;
  // Function to call when the toggle state changes
  onChange: (checked: boolean) => void;
  // Optional label for the toggle
  label?: string;
  // Optional disabled state
  disabled?: boolean;
  // Optional ID for the input
  id?: string;
  // Optional CSS class for styling
  className?: string;
  textClassName?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id = `toggle-switch-${Math.random().toString(36).substring(2, 11)}`,
  className = '',
  textClassName = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    if (!disabled && inputRef.current) {
      const newChecked = !checked;
      onChange(newChecked);
    }
  };

  return (
    <div className={`flex items-center w-full ${className}`}>
      <div 
        onClick={handleClick}
        className={`relative inline-flex items-center w-full ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => {}}
          disabled={disabled}
          className="sr-only peer"
          aria-labelledby={label ? `${id}-label` : undefined}
        />
        <div 
          className={`
            relative w-full h-8 bg-gray-200 rounded-full p-1 transition-colors duration-200 ease-in-out
            ${checked ? 'bg-blue-600' : ''}
          `}
        >
          <div 
            className={`
              absolute h-6 w-6 bg-white border-gray-300 border rounded-full 
              transition-all duration-200 ease-in-out
              ${checked ? 'right-1 left-auto' : 'left-1 right-auto'}
            `}
            style={{
              top: '4px'
            }}
          ></div>
        </div>
        {label && (
          <span 
            id={`${id}-label`}
            className={`${textClassName} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ToggleSwitch;