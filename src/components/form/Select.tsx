interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  value: string;                // ✅ controlled value
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-11 w-full appearance-none rounded-lg border border-gray-300 
          bg-transparent px-4 pr-10 text-sm shadow-theme-xs
          focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10
          dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
          disabled:opacity-60 disabled:cursor-not-allowed
          ${value ? "text-gray-800 dark:text-white/90" : "text-gray-400"}
          ${className}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown icon */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        ▼
      </span>
    </div>
  );
};

export default Select;
