import { StoryForm } from "../story/components";
import { useGenerateStory } from "../story/hooks";

export default function StoryGenerator() {
  const { data, loading, error, submit } = useGenerateStory();

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Story Generator</h2>
        <p className="text-sm text-gray-600">
          Enter prompts to generate a story.
        </p>
      </div>

      <StoryForm
        onSubmit={async (payload) => {
          await submit(payload);
        }}
        disabled={loading}
      />

      {loading && <p>Generating...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data?.story && (
        <div className="max-w-2xl">
          <h3 className="text-xl font-medium mb-2">Result</h3>
          <div className="whitespace-pre-wrap border rounded p-3">
            {data.story}
          </div>
        </div>
      )}
    </div>
  );
}
