import { useState, useMemo } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import LoadingSpinner from "./ui/LoadingSpinner";

const MemoryView = ({ chatId, memories, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("updated_at");

  const memoryTypes = [
    "food_preference",
    "travel_preference",
    "personal_info",
    "delivery_instruction",
    "hobby_interest",
    "routine_timing",
  ];

  const filteredAndSortedMemories = useMemo(() => {
    let filtered = memories.filter((memory) => {
      const matchesSearch = memory.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(memory.memory_type);
      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "confidence") {
        return b.confidence - a.confidence;
      } else if (sortBy === "created_at") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        // updated_at
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });
  }, [memories, searchTerm, selectedTypes, sortBy]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Memory Database</h2>
          <p className="text-gray-400 mt-1">
            {filteredAndSortedMemories.length} of {memories.length} memories
          </p>
        </div>
        <Button onClick={onRefresh} disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 transition-colors"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Type Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Memory Types
            </label>
            <div className="flex flex-wrap gap-2">
              {memoryTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-3 py-1 text-xs font-medium rounded border transition-all ${
                    selectedTypes.includes(type)
                      ? getMemoryTypeColor(type)
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {formatMemoryType(type)}
                </button>
              ))}
            </div>
            {selectedTypes.length > 0 && (
              <button
                onClick={() => setSelectedTypes([])}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            >
              <option value="updated_at">Last Updated</option>
              <option value="created_at">Date Created</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Memory List */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredAndSortedMemories.length === 0 ? (
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
                {searchTerm || selectedTypes.length > 0
                  ? "Try adjusting your search criteria."
                  : "No memories available for this chat."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedMemories.map((memory) => (
                <div
                  key={memory.memory_id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
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

                  <p className="text-white mb-3">{memory.content}</p>

                  {memory.reasoning && (
                    <p className="text-sm text-gray-400 mb-3 italic">
                      Reasoning: {memory.reasoning}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="space-x-4">
                      <span>Created: {formatDate(memory.created_at)}</span>
                      <span>Updated: {formatDate(memory.updated_at)}</span>
                    </div>
                    <span>Sources: {memory.source_messages?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemoryView;
