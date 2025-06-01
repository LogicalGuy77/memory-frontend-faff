import { useState } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import Button from "./ui/Button";
import Card from "./ui/Card";

const Dashboard = ({ chats, loading, onChatSelect, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.chat_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Chat Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Manage and analyze your conversation data
          </p>
        </div>
        <Button onClick={onRefresh} disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : "Refresh"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Chats</p>
                <p className="text-2xl font-semibold text-white">
                  {chats.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m13 0h-6m-9-3h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">
                  Total Messages
                </p>
                <p className="text-2xl font-semibold text-white">
                  {chats.reduce((sum, chat) => sum + chat.message_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">
                  Avg Messages/Chat
                </p>
                <p className="text-2xl font-semibold text-white">
                  {chats.length > 0
                    ? Math.round(
                        chats.reduce(
                          (sum, chat) => sum + chat.message_count,
                          0
                        ) / chats.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Chats
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredChats.length === 0 ? (
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">
                No chats found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Upload some chat data to get started."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChats.map((chat) => (
                <div
                  key={chat.chat_id}
                  onClick={() => onChatSelect(chat.chat_id)}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 
                           cursor-pointer transition-all hover:bg-gray-750 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {chat.chat_id}
                      </h4>
                      <div className="flex items-center mt-1 text-sm text-gray-400 space-x-4">
                        <span>{chat.message_count} messages</span>
                        <span>•</span>
                        <span>Last: {formatDate(chat.last_message)}</span>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
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

export default Dashboard;
