interface MockComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  selected?: string[];
  id?: string;
  label?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}

// Mock components for testing
export const MockCharacterField = ({
  value,
  onChange,
  disabled,
  error,
}: MockComponentProps) => (
  <div>
    <label htmlFor="character">Character *</label>
    <input
      id="character"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid="character-input"
    />
    {error && <span data-testid="character-error">{error}</span>}
  </div>
);

export const MockThemeSelector = ({
  selected,
  onChange,
  disabled,
  error,
}: MockComponentProps) => (
  <div>
    <label>Theme *</label>
    <div data-testid="theme-selector">
      {["ADVENTURE", "FANTASY", "FRIENDSHIP"].map((theme) => (
        <label key={theme}>
          <input
            type="checkbox"
            checked={selected.includes(theme)}
            onChange={() => {
              const newSelected = selected.includes(theme)
                ? selected.filter((t: string) => t !== theme)
                : [...selected, theme];
              onChange(newSelected);
            }}
            disabled={disabled}
          />
          {theme}
        </label>
      ))}
    </div>
    {error && <span data-testid="theme-error">{error}</span>}
  </div>
);

export const MockStoryLengthSelector = ({
  selected,
  onChange,
  disabled,
  error,
}: MockComponentProps) => (
  <div>
    <label>Story Length *</label>
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid="story-length-select"
    >
      <option value="">Select length</option>
      <option value="SHORT">Short</option>
      <option value="MEDIUM">Medium</option>
      <option value="FULL">Full</option>
    </select>
    {error && <span data-testid="story-length-error">{error}</span>}
  </div>
);

export const MockSelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  error,
}: MockComponentProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      data-testid={`${id}-select`}
    >
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span data-testid={`${id}-error`}>{error}</span>}
  </div>
);

export const MockTextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  multiline,
  rows,
  maxLength,
}: MockComponentProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    {multiline ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        data-testid={`${id}-textarea`}
      />
    ) : (
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        data-testid={`${id}-input`}
      />
    )}
    {error && <span data-testid={`${id}-error`}>{error}</span>}
  </div>
);
