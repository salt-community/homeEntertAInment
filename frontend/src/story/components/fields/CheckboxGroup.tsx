export interface CheckboxOption<V extends string> {
  value: V;
  label: string;
}

interface CheckboxGroupProps<V extends string> {
  label: string;
  selected: V[];
  onChange: (next: V[]) => void;
  options: Array<CheckboxOption<V>>;
  disabled?: boolean;
  error?: string;
  maxSelected?: number;
}

export default function CheckboxGroup<V extends string>({
  label,
  selected,
  onChange,
  options,
  disabled,
  error,
  maxSelected,
}: CheckboxGroupProps<V>) {
  const labelClass = "block text-sm font-medium mb-2";
  const errorClass = "text-red-600 text-sm mt-1";

  const handleToggle = (value: V, checked: boolean) => {
    if (checked) {
      if (maxSelected && selected.length >= maxSelected) {
        return;
      }
      onChange([...selected, value]);
    } else {
      onChange(selected.filter((v) => v !== value));
    }
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={(e) => handleToggle(opt.value, e.target.checked)}
              disabled={disabled}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
