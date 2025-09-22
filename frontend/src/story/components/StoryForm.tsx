import { useState } from "react";
import type {
  StoryRequest,
  ThemeValue,
  AgeGroupValue,
  TwistValue,
} from "../types";
import { Theme, AgeGroup, Twist } from "../types";

interface StoryFormProps {
  onSubmit: (payload: StoryRequest) => void | Promise<void>;
  disabled?: boolean;
}

const THEME_LABELS: Record<ThemeValue, string> = {
  [Theme.ADVENTURE]: "Adventure",
  [Theme.SCI_FI]: "Sci-Fi",
  [Theme.MYSTERY]: "Mystery",
  [Theme.ROMANCE]: "Romance",
  [Theme.EDUCATIONAL]: "Educational",
  [Theme.HISTORY]: "History",
  [Theme.COMEDY]: "Comedy",
  [Theme.FANTASY]: "Fantasy",
  [Theme.DRAMA]: "Drama",
};

const AGE_GROUP_LABELS: Record<AgeGroupValue, string> = {
  [AgeGroup.AGE_3_4]: "Ages 3-4",
  [AgeGroup.AGE_5_6]: "Ages 5-6",
  [AgeGroup.AGE_7_8]: "Ages 7-8",
  [AgeGroup.AGE_9_10]: "Ages 9-10",
  [AgeGroup.AGE_11_12]: "Ages 11-12",
};

const TWIST_LABELS: Record<TwistValue, string> = {
  [Twist.SECRET_DOOR]: "Secret Door",
  [Twist.TALKING_ANIMAL]: "Talking Animal",
  [Twist.HIDDEN_TREASURE]: "Hidden Treasure",
  [Twist.MAGIC_SPELL]: "Magic Spell",
  [Twist.UNEXPECTED_ALLY]: "Unexpected Ally",
  [Twist.LOST_AND_FOUND]: "Lost and Found",
  [Twist.TIME_TRAVEL]: "Time Travel",
  [Twist.DREAM_OR_REALITY]: "Dream or Reality",
  [Twist.DISGUISED_HERO]: "Disguised Hero",
  [Twist.FRIEND_TURNS_VILLAIN]: "Friend Turns Villain",
  [Twist.MAP_TO_ANOTHER_WORLD]: "Map to Another World",
  [Twist.WISH_COMES_TRUE]: "Wish Comes True",
};

export default function StoryForm({ onSubmit, disabled }: StoryFormProps) {
  const [character, setCharacter] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<ThemeValue[]>([]);
  const [ageGroup, setAgeGroup] = useState<AgeGroupValue | "">("");
  const [twist, setTwist] = useState<TwistValue | "">("");
  const [custom, setCustom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!character.trim()) {
      newErrors.character = "Character is required";
    } else if (character.length > 50) {
      newErrors.character = "Character must be 50 characters or less";
    }

    if (selectedThemes.length === 0) {
      newErrors.themes = "At least one theme is required";
    } else if (selectedThemes.length > 2) {
      newErrors.themes = "Maximum 2 themes can be selected";
    }

    if (!ageGroup) {
      newErrors.ageGroup = "Age group is required";
    }

    if (custom && custom.length > 200) {
      newErrors.custom = "Custom field must be 200 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThemeChange = (theme: ThemeValue, checked: boolean) => {
    if (checked) {
      if (selectedThemes.length < 2) {
        setSelectedThemes([...selectedThemes, theme]);
      }
    } else {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: StoryRequest = {
      character: character.trim(),
      theme: selectedThemes,
      ageGroup: ageGroup as AgeGroupValue,
      ...(twist && { twist: twist as TwistValue }),
      ...(custom.trim() && { custom: custom.trim() }),
    };

    await onSubmit(payload);
  };

  const inputClass =
    "border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium mb-2";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Character Input */}
      <div>
        <label className={labelClass} htmlFor="character">
          Character *
        </label>
        <input
          id="character"
          className={`${inputClass} ${
            errors.character ? "border-red-500" : ""
          }`}
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          placeholder="A brave rabbit named Barnaby"
          disabled={disabled}
          maxLength={50}
        />
        {errors.character && <p className={errorClass}>{errors.character}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {character.length}/50 characters
        </p>
      </div>

      {/* Theme Checkboxes */}
      <div>
        <label className={labelClass}>Theme * (select up to 2)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(THEME_LABELS).map(([value, label]) => (
            <label
              key={value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedThemes.includes(value as ThemeValue)}
                onChange={(e) =>
                  handleThemeChange(value as ThemeValue, e.target.checked)
                }
                disabled={disabled}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        {errors.themes && <p className={errorClass}>{errors.themes}</p>}
      </div>

      {/* Age Group Dropdown */}
      <div>
        <label className={labelClass} htmlFor="ageGroup">
          Age Group *
        </label>
        <select
          id="ageGroup"
          className={`${inputClass} ${errors.ageGroup ? "border-red-500" : ""}`}
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value as AgeGroupValue)}
          disabled={disabled}
        >
          <option value="">Select age group</option>
          {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.ageGroup && <p className={errorClass}>{errors.ageGroup}</p>}
      </div>

      {/* Twist Dropdown */}
      <div>
        <label className={labelClass} htmlFor="twist">
          Twist (Optional)
        </label>
        <select
          id="twist"
          className={inputClass}
          value={twist}
          onChange={(e) => setTwist(e.target.value as TwistValue)}
          disabled={disabled}
        >
          <option value="">No twist</option>
          {Object.entries(TWIST_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Input */}
      <div>
        <label className={labelClass} htmlFor="custom">
          Custom (Optional)
        </label>
        <textarea
          id="custom"
          className={`${inputClass} ${errors.custom ? "border-red-500" : ""}`}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Any additional story requirements..."
          disabled={disabled}
          rows={3}
          maxLength={200}
        />
        {errors.custom && <p className={errorClass}>{errors.custom}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {custom.length}/200 characters
        </p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={disabled}
      >
        Generate Story
      </button>
    </form>
  );
}
