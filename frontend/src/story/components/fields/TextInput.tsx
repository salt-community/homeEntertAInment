interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  maxLength,
  multiline = false,
  rows,
}: TextInputProps) {
  const inputClass =
    "border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium mb-2";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${inputClass} ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
        />
      ) : (
        <input
          id={id}
          className={`${inputClass} ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
