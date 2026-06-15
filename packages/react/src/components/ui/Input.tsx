import { type ChangeEvent, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  fullWidth = false,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={`bg-gray-900 border rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
    </div>
  );
}
