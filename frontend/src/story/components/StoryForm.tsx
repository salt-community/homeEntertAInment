import { useState } from "react";
import type {
  StoryRequest,
  ThemeValue,
  AgeGroupValue,
  TwistValue,
  StoryLengthValue,
} from "../types";
import { AgeGroup, Twist } from "../types";
import CharacterField from "./CharacterField";
import ThemeSelector from "./ThemeSelector";
import StoryLengthSelector from "./StoryLengthSelector";
import SelectField from "./fields/SelectField";
import TextInput from "./fields/TextInput";

interface StoryFormProps {
  onSubmit: (payload: StoryRequest) => void | Promise<void>;
  disabled?: boolean;
}

// labels moved to ThemeSelector

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
  const [storyLength, setStoryLength] = useState<StoryLengthValue | "">("");
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

    if (!storyLength) {
      newErrors.storyLength = "Story length is required";
    }

    if (custom && custom.length > 200) {
      newErrors.custom = "Custom field must be 200 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThemeChange = (next: ThemeValue[]) => setSelectedThemes(next);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: StoryRequest = {
      character: character.trim(),
      theme: selectedThemes,
      ageGroup: ageGroup as AgeGroupValue,
      storyLength: storyLength as StoryLengthValue,
      ...(twist && { twist: twist as TwistValue }),
      ...(custom.trim() && { custom: custom.trim() }),
    };

    await onSubmit(payload);
  };

  // styling handled in field components

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Character Input */}
      <CharacterField
        value={character}
        onChange={setCharacter}
        disabled={disabled}
        error={errors.character}
      />

      {/* Theme Checkboxes */}
      <ThemeSelector
        selected={selectedThemes}
        onChange={handleThemeChange}
        disabled={disabled}
        error={errors.themes}
      />

      {/* Age Group Dropdown */}
      <SelectField<AgeGroupValue>
        id="ageGroup"
        label="Age Group *"
        value={ageGroup}
        onChange={(val) => setAgeGroup(val as AgeGroupValue | "")}
        options={[
          { value: "", label: "Select age group" },
          ...Object.entries(AGE_GROUP_LABELS).map(([value, label]) => ({
            value: value as AgeGroupValue,
            label,
          })),
        ]}
        disabled={disabled}
        error={errors.ageGroup}
      />

      {/* Story Length Selector */}
      <StoryLengthSelector
        selected={storyLength}
        onChange={(value) => setStoryLength(value)}
        disabled={disabled}
        error={errors.storyLength}
      />

      {/* Twist Dropdown */}
      <SelectField<TwistValue>
        id="twist"
        label="Twist (Optional)"
        value={twist}
        onChange={(val) => setTwist(val as TwistValue | "")}
        options={[
          { value: "", label: "No twist" },
          ...Object.entries(TWIST_LABELS).map(([value, label]) => ({
            value: value as TwistValue,
            label,
          })),
        ]}
        disabled={disabled}
      />

      {/* Custom Input */}
      <div>
        <TextInput
          id="custom"
          label="Custom (Optional)"
          value={custom}
          onChange={setCustom}
          placeholder="Add something extra you want in your story..."
          disabled={disabled}
          error={errors.custom}
          multiline
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {custom.length}/200 characters
        </p>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        disabled={disabled}
      >
        Create Your Story
      </button>
    </form>
  );
}
