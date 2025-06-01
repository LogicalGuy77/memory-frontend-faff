import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import LoadingSpinner from "./ui/LoadingSpinner";

const ChatView = ({ chatId, memories, loading, onExtractMemories }) => {
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleExtract = async () => {
    try {
      setExtracting(true);
      const result = await onExtractMemories(chatId);
      setExtractionResult(result);
    } catch (error) {
      console.error("Extraction failed:", error);
    } finally {
      setExtracting(false);
    }
  };

  const getMemoryTypeColor = (type) => {
    const colors = {
      food_preference: "bg-green-900 text-green-300 border-green-700",
      travel_preference: "bg-blue-900 text-blue-300 border-blue-700",
      personal_info: "bg-purple-900 text-purple-300 border-purple-700",
      delivery_instruction: "bg-orange-900 text-orange-300 border-orange-700",
      hobby_interest: "bg-pink-900 text-pink-300 border-pink-700",
      routine_timing: "bg-yellow-900 text-yellow-300 border-yellow-700",
    };
    return colors[type] || "bg-gray-900 text-gray-300 border-gray-700";
  };

  const formatMemoryType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Chat Analysis</h2>
          <p className="text-gray-400 mt-1">Chat ID: {chatId}</p>
        </div>
        <Button
          onClick={handleExtract}
          disabled={extracting}
          loading={extracting}
        >
          {extracting ? "Extracting..." : "Extract Memories"}
        </Button>
      </div>

      {/* Extraction Result */}
      {extractionResult && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Extraction Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {extractionResult.created || 0}
                </div>
                <div className="text-sm text-gray-400">New Memories</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {extractionResult.updated || 0}
                </div>
                <div className="text-sm text-gray-400">Updated</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {extractionResult.conflicts_resolved || 0}
                </div>
                <div className="text-sm text-gray-400">Conflicts Resolved</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Memories Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Extracted Memories
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">
                No memories found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Click "Extract Memories" to analyze this chat for memorable
                information.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {memories.slice(0, 5).map((memory) => (
                <div
                  key={memory.memory_id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${getMemoryTypeColor(
                        memory.memory_type
                      )}`}
                    >
                      {formatMemoryType(memory.memory_type)}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>
                        Confidence: {(memory.confidence * 100).toFixed(0)}%
                      </span>
                      <span>•</span>
                      <span>
                        {memory.extraction_method === "llm" ? "AI" : "Rules"}
                      </span>
                    </div>
                  </div>
                  <p className="text-white">{memory.content}</p>
                  {memory.reasoning && (
                    <p className="text-sm text-gray-400 mt-2 italic">
                      {memory.reasoning}
                    </p>
                  )}
                </div>
              ))}

              {memories.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-gray-400">
                    Showing 5 of {memories.length} memories.
                    <span className="text-blue-400 ml-1 cursor-pointer hover:underline">
                      View all in Memories tab
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatView;
