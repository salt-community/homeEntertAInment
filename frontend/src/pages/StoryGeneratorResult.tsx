import { useEffect, useMemo, useRef } from "react";
import { useGenerateStory, useGenerateImage } from "../story/hooks";
import { StoryViewer, SaveToPdfButton } from "../story/components";
import type { StoryRequest } from "../story/types";
import { Link } from "@tanstack/react-router";
import { generateCoverImagePrompt } from "../story/utils/storyAnalyzer";

export default function StoryGeneratorResult() {
  const hasStartedRef = useRef(false);
  const { data, loading, error, submit } = useGenerateStory();
  const {
    data: imageData,
    loading: imageLoading,
    error: imageError,
    submit: generateImage,
  } = useGenerateImage();

  const request: StoryRequest | null = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("storyRequest");
      return raw ? (JSON.parse(raw) as StoryRequest) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!hasStartedRef.current && request) {
      hasStartedRef.current = true;
      void submit(request).finally(() => {
        sessionStorage.removeItem("storyRequest");
      });
    }
  }, [request, submit]);

  const handleGenerateCoverImage = async () => {
    if (!data?.story || !request) return;

    // Generate dynamic prompt based on the actual story content
    const description = generateCoverImagePrompt(data.story, request.character);

    console.log("Generated dynamic cover image prompt:", description);

    try {
      await generateImage({ description });
    } catch (err) {
      console.error("Failed to generate cover image:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-2xl flex justify-end">
        <Link
          to="/story-generator"
          className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white !text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="text-white">Generate new story</span>
        </Link>
      </div>
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-white">Story Result</h2>
        <p className="text-sm text-white/80">
          Your generated story will appear below.
        </p>
      </div>

      {!request && (
        <div className="w-full max-w-2xl text-center">
          <p className="text-white/80">No request found.</p>
          <Link to="/story-generator" className="text-indigo-400 underline">
            Go back to Story Generator
          </Link>
        </div>
      )}

      {loading && (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-3 py-8">
          <GradientSpinner />
          <p className="text-sm text-white/80">Generating your story...</p>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl">
          <p className="text-red-400">{error}</p>
          <Link to="/story-generator" className="text-indigo-400 underline">
            Try again
          </Link>
        </div>
      )}

      {data?.story && (
        <div className="w-full max-w-2xl">
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-300">
                  Story Generated and Saved!
                </h3>
                <p className="text-sm text-green-200 mt-1">
                  Your story has been automatically saved to your account. You
                  can find it in your saved stories.
                </p>
                <div className="mt-2">
                  <Link
                    to="/story-generator/saved"
                    className="text-sm font-medium text-green-300 hover:text-green-200 underline"
                  >
                    View Your Saved Stories →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-medium mb-2 text-white">
            Your Generated Story
          </h3>

          {/* Action Buttons */}
          <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleGenerateCoverImage}
              disabled={imageLoading}
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {imageLoading ? (
                <>
                  <GradientSpinner />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                "Generate Cover Image"
              )}
            </button>

            <SaveToPdfButton
              storyMarkdown={data.story}
              coverImageUrl={imageData?.imageUrl}
            />
          </div>

          {/* Image Error Display */}
          {imageError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">
                Failed to generate cover image: {imageError}
              </p>
            </div>
          )}

          {/* Cover Image Display */}
          {imageData?.imageUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={imageData.imageUrl}
                alt="Story cover"
                className="max-w-full h-auto rounded-lg shadow-lg border"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}

          {/* Story Content */}
          <div className="border border-gray-700 rounded p-4 shadow-sm bg-black">
            <div className="prose prose-invert max-w-none">
              <StoryViewer markdown={data.story} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GradientSpinner() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
