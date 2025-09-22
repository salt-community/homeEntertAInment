import TextInput from "./fields/TextInput";

interface CharacterFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}

export default function CharacterField({
  value,
  onChange,
  error,
  disabled,
  maxLength = 50,
}: CharacterFieldProps) {
  return (
    <div>
      <TextInput
        id="character"
        label="Character *"
        value={value}
        onChange={onChange}
        placeholder="A brave rabbit named Barnaby"
        disabled={disabled}
        error={error}
        maxLength={maxLength}
      />
      <p className="text-xs text-gray-500 mt-1">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
}
