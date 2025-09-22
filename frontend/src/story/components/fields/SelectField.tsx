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
    "w-full px-4 py-3 border-2 border-white/30 rounded-lg " +
    "focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:border-[#F930C7] " +
    "bg-black text-white text-base disabled:opacity-50 disabled:cursor-not-allowed";

  const labelClass = "block text-sm font-medium text-white mb-2";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`${inputClass} ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value as V | "")}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-white bg-black"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
