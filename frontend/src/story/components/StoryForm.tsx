import { useState } from "react";
import type { StoryRequest } from "../types";

interface StoryFormProps {
  onSubmit: (payload: StoryRequest) => void | Promise<void>;
  disabled?: boolean;
}

export default function StoryForm({ onSubmit, disabled }: StoryFormProps) {
  const [hero, setHero] = useState("");
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState("");
  const [twist, setTwist] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StoryRequest = { hero, theme, tone, twist };
    await onSubmit(payload);
  };

  const inputClass = "border rounded px-3 py-2 w-full";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className={labelClass} htmlFor="hero">
          Hero
        </label>
        <input
          id="hero"
          className={inputClass}
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          placeholder="a brave rabbit"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="theme">
          Theme
        </label>
        <input
          id="theme"
          className={inputClass}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="friendship"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="tone">
          Tone
        </label>
        <input
          id="tone"
          className={inputClass}
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="funny"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="twist">
          Twist
        </label>
        <input
          id="twist"
          className={inputClass}
          value={twist}
          onChange={(e) => setTwist(e.target.value)}
          placeholder="the moon talks"
          disabled={disabled}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Generate Story
      </button>
    </form>
  );
}
