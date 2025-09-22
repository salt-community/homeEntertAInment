import React from "react";
import CheckboxGroup from "./fields/CheckboxGroup";
import type { ThemeValue } from "../types";

interface ThemeSelectorProps {
  selected: ThemeValue[];
  onChange: (next: ThemeValue[]) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
}

const THEME_LABELS: Record<ThemeValue, string> = {
  ADVENTURE: "Adventure",
  SCI_FI: "Sci-Fi",
  MYSTERY: "Mystery",
  ROMANCE: "Romance",
  EDUCATIONAL: "Educational",
  HISTORY: "History",
  COMEDY: "Comedy",
  FANTASY: "Fantasy",
  DRAMA: "Drama",
};

export default function ThemeSelector({
  selected,
  onChange,
  label = "Theme * (select up to 2)",
  disabled,
  error,
}: ThemeSelectorProps) {
  return (
    <CheckboxGroup<ThemeValue>
      label={label}
      selected={selected}
      onChange={onChange}
      options={Object.entries(THEME_LABELS).map(([value, labelText]) => ({
        value: value as ThemeValue,
        label: labelText,
      }))}
      disabled={disabled}
      error={error}
      maxSelected={2}
    />
  );
}
