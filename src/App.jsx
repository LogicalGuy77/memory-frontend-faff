import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import ChatView from "./components/ChatView";
import MemoryView from "./components/MemoryView";
import ChatUpload from "./components/ChatUpload";
import MemoryQuery from "./components/MemoryQuery";
import ApiStatus from "./components/ApiStatus";
import ApiService from "./services/ApiService";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getChats();
      setChats(data.chats || []);
    } catch (err) {
      setError("Failed to load chats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMemories = async (chatId) => {
    try {
      setLoading(true);
      const data = await ApiService.getMemories(chatId);
      setMemories(data.memories || []);
    } catch (err) {
      setError("Failed to load memories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setActiveView("chat");
    loadMemories(chatId);
  };

  const handleExtractMemories = async (chatId) => {
    try {
      setLoading(true);
      const result = await ApiService.extractMemories(chatId);
      await loadMemories(chatId);
      return result;
    } catch (err) {
      setError("Failed to extract memories");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async (chatId) => {
    // Refresh the chats list after successful upload
    await loadChats();

    // Optionally select the uploaded chat and switch to chat view
    if (chatId) {
      setSelectedChatId(chatId);
      setActiveView("chat");
      await loadMemories(chatId);
    }

    // Clear any existing errors
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">
                Memory Extraction
              </h1>
              <div className="text-sm text-gray-400">
                AI-Powered Conversation Analysis
              </div>
              {/* API Status Indicator */}
              <ApiStatus />
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView("upload")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "upload"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                Upload Chat
              </button>
              <button
                onClick={() => setActiveView("query")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "query"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                Search Memories
              </button>
              {selectedChatId && (
                <>
                  <button
                    onClick={() => setActiveView("chat")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeView === "chat"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    Chat Analysis
                  </button>
                  <button
                    onClick={() => setActiveView("memories")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeView === "memories"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    Memories
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {activeView === "dashboard" && (
          <Dashboard
            chats={chats}
            loading={loading}
            onChatSelect={handleChatSelect}
            onRefresh={loadChats}
          />
        )}

        {activeView === "upload" && (
          <ChatUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {activeView === "query" && <MemoryQuery />}

        {activeView === "chat" && selectedChatId && (
          <ChatView
            chatId={selectedChatId}
            memories={memories}
            loading={loading}
            onExtractMemories={handleExtractMemories}
          />
        )}

        {activeView === "memories" && selectedChatId && (
          <MemoryView
            chatId={selectedChatId}
            memories={memories}
            loading={loading}
            onRefresh={() => loadMemories(selectedChatId)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
