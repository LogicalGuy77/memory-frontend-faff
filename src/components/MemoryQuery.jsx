import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import LoadingSpinner from "./ui/LoadingSpinner";
import ApiService from "../services/ApiService";

const MemoryQuery = () => {
  const [query, setQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const memoryTypes = [
    "food_preference",
    "travel_preference",
    "personal_info",
    "delivery_instruction",
    "hobby_interest",
    "routine_timing",
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.queryMemories(
        query,
        selectedChatId || null,
        selectedTypes.length > 0 ? selectedTypes : null
      );
      setResults(response.memories || []);
      setHasSearched(true);
    } catch (err) {
      setError("Failed to search memories: " + err.message);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setQuery("");
    setSelectedChatId("");
    setSelectedTypes([]);
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  const toggleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Memory Search</h2>
          <p className="text-gray-400 mt-1">
            Search across all memories with advanced filters
          </p>
        </div>
        {(hasSearched || selectedTypes.length > 0 || selectedChatId) && (
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Search Form */}
      <Card>
        <div className="p-6 space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Search Query
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for memories... (e.g., 'vegetarian', 'address', 'delivery')"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || loading}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chat ID Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Chat ID (Optional)
              </label>
              <input
                type="text"
                value={selectedChatId}
                onChange={(e) => setSelectedChatId(e.target.value)}
                placeholder="Filter by specific chat ID..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            {/* Memory Types Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Memory Types (Optional)
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
                  Clear type filters
                </button>
              )}
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Search Tips
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Search is case-insensitive and matches partial words</li>
              <li>
                • Use specific terms like "vegetarian", "address", "delivery
                instructions"
              </li>
              <li>
                • Combine text search with type filters for precise results
              </li>
              <li>• Leave Chat ID empty to search across all conversations</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Results */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-red-300 font-medium">Search Failed</h4>
              <p className="text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {hasSearched && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Search Results
              </h3>
              <div className="text-sm text-gray-400">
                {results.length} {results.length === 1 ? "memory" : "memories"}{" "}
                found
                {selectedChatId && <span> in chat {selectedChatId}</span>}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : results.length === 0 ? (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">
                  No memories found
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((memory) => (
                  <div
                    key={memory.memory_id}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded border ${getMemoryTypeColor(
                            memory.memory_type
                          )}`}
                        >
                          {formatMemoryType(memory.memory_type)}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {memory.chat_id}
                        </span>
                      </div>
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

                    <p className="text-white mb-3">
                      {highlightSearchTerm(memory.content, query)}
                    </p>

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
                      <span>
                        Sources: {memory.source_messages?.length || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MemoryQuery;
