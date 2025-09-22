interface Option<V extends string> {
  value: V | "";
  label: string;
}

interface SelectFieldProps<V extends string> {
  id: string;
  label: string;
  value: V | "";
  onChange: (value: V | "") => void;
  options: Array<Option<V>>;
  disabled?: boolean;
  error?: string;
}

export default function SelectField<V extends string>({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  error,
}: SelectFieldProps<V>) {
  const inputClass =
    "border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium mb-2";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`${inputClass} ${error ? "border-red-500" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value as V | "")}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
