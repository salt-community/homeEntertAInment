import { useState } from "react";

interface SaveToPdfButtonProps {
  storyMarkdown: string;
  coverImageUrl?: string;
}

export function SaveToPdfButton({
  storyMarkdown,
  coverImageUrl,
}: SaveToPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveToPdf = async () => {
    if (!storyMarkdown) {
      setError("No story content available");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Prepare the markdown content with cover image if available
      let fullMarkdown = storyMarkdown;
      if (coverImageUrl) {
        fullMarkdown = `![Cover Image](${coverImageUrl})\n\n# Story\n\n${storyMarkdown}`;
      }

      // Base64 encode the markdown content
      const base64Markdown = btoa(unescape(encodeURIComponent(fullMarkdown)));

      // Prepare the request body for ConvertAPI
      const requestBody = {
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: "story.md",
              Data: base64Markdown,
            },
          },
          {
            Name: "StoreFile",
            Value: true,
          },
        ],
      };

      // Call ConvertAPI
      const response = await fetch(
        "https://v2.convertapi.com/convert/md/to/pdf",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 6mLcI1qSg0ckRpf1FQkmUqkm2oukSw8J",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `ConvertAPI request failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Check if we got a file URL
      if (!result.Files || !result.Files[0] || !result.Files[0].Url) {
        throw new Error("No file URL received from ConvertAPI");
      }

      const fileUrl = result.Files[0].Url;

      // Download the PDF file
      const pdfResponse = await fetch(fileUrl);
      if (!pdfResponse.ok) {
        throw new Error(
          `Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`
        );
      }

      const pdfBlob = await pdfResponse.blob();

      // Create download link and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "story.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleSaveToPdf}
        disabled={isGenerating}
        className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isGenerating ? (
          <>
            <div className="flex space-x-1 mr-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-white animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Save to PDF
          </>
        )}
      </button>

      {error && (
        <div className="text-red-600 text-sm text-center max-w-xs">{error}</div>
      )}
    </div>
  );
}
