import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import LoadingSpinner from "./ui/LoadingSpinner";
import ApiService from "../services/ApiService";

const ChatUpload = ({ onUploadSuccess }) => {
  const exampleJson = `[
  {
    "message_id": "msg_001",
    "timestamp": "2024-01-15T10:30:00Z",
    "sender": "user",
    "content": "Hi! I'd like to order some food for delivery to my apartment",
    "chat_id": "chat_demo_001"
  },
  {
    "message_id": "msg_002",
    "timestamp": "2024-01-15T10:30:15Z", 
    "sender": "assistant",
    "content": "Hello! I'd be happy to help you order food. What would you like to eat today?",
    "chat_id": "chat_demo_001"
  },
  {
    "message_id": "msg_003",
    "timestamp": "2024-01-15T10:30:45Z",
    "sender": "user", 
    "content": "I'm vegetarian and I love Italian food. Can you recommend something? Also, my address is 456 Oak Street, Apt 3B, New York, NY 10001",
    "chat_id": "chat_demo_001"
  },
  {
    "message_id": "msg_004",
    "timestamp": "2024-01-15T10:31:00Z",
    "sender": "assistant",
    "content": "Perfect! I've noted that you're vegetarian and love Italian food. I've also saved your address. I'd recommend the Margherita pizza or pasta primavera from Tony's Italian Kitchen. They have excellent vegetarian options!",
    "chat_id": "chat_demo_001"
  },
  {
    "message_id": "msg_005", 
    "timestamp": "2024-01-15T10:31:30Z",
    "sender": "user",
    "content": "The pasta primavera sounds great! I usually eat dinner around 7 PM, so please schedule it for delivery at 6:45 PM. Also, please leave it with the doorman in the lobby - his name is James.",
    "chat_id": "chat_demo_001"
  },
  {
    "message_id": "msg_006",
    "timestamp": "2024-01-15T10:32:00Z", 
    "sender": "assistant",
    "content": "Excellent choice! I've ordered pasta primavera for delivery at 6:45 PM to 456 Oak Street, Apt 3B. I've noted to leave it with James, the doorman. Your order will be ready right before your usual 7 PM dinner time!",
    "chat_id": "chat_demo_001"
  }
]`;

  // Pre-fill with example data
  const [jsonText, setJsonText] = useState(exampleJson);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!jsonText.trim()) {
      setError("Please paste your chat JSON data");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const chatData = JSON.parse(jsonText);

      // Transform data to match the API format
      const transformedData = chatData.map((msg) => ({
        message_id: msg.message_id,
        timestamp: new Date(msg.timestamp).toISOString(),
        sender: msg.sender,
        content: msg.content,
        chat_id: msg.chat_id,
      }));

      // Upload to API
      const result = await ApiService.uploadChatMessages(transformedData);

      setUploadResult({
        ...result,
        chatId: transformedData[0]?.chat_id,
        messageCount: transformedData.length,
        uniqueChatIds: [...new Set(transformedData.map((msg) => msg.chat_id))],
      });

      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(transformedData[0]?.chat_id);
      }
    } catch (err) {
      setError(err.message || "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setJsonText("");
    setError(null);
    setUploadResult(null);
  };

  const loadExample = () => {
    setJsonText(exampleJson);
    setError(null);
    setUploadResult(null);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError("Invalid JSON format. Cannot format.");
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Upload Chat Data
            </h3>
            <p className="text-gray-400 mt-1">
              Example data loaded - ready to submit or modify
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={loadExample}>
              Reset Example
            </Button>
            {jsonText && (
              <>
                <Button variant="ghost" size="sm" onClick={formatJson}>
                  Format JSON
                </Button>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {!uploadResult ? (
          <div className="space-y-4">
            {/* JSON Text Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Chat Messages JSON
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste your chat JSON here..."
                className="w-full h-96 p-4 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 font-mono text-sm resize-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>
                  {jsonText.trim()
                    ? `${jsonText.length} characters`
                    : "No data"}
                </span>
                <span>
                  Required fields: message_id, timestamp, sender, content,
                  chat_id
                </span>
              </div>
            </div>

            {/* Format Requirements */}
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
                Format Requirements
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Must be a valid JSON array of message objects</li>
                <li>
                  • Each message needs: message_id, timestamp, sender, content,
                  chat_id
                </li>
                <li>
                  • Timestamp format: ISO 8601 (e.g., "2024-01-15T10:30:00Z")
                </li>
                <li>
                  • All messages in the same conversation should have the same
                  chat_id
                </li>
              </ul>
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!jsonText.trim() || uploading}
                loading={uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {uploading ? "Processing..." : "Upload Chat Data"}
              </Button>
            </div>
          </div>
        ) : (
          /* Success Result */
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-green-300 font-medium">
                  Upload Successful!
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-gray-400">Messages Uploaded</div>
                  <div className="text-white text-xl font-semibold">
                    {uploadResult.messageCount}
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-gray-400">Chat IDs</div>
                  <div className="text-white">
                    {uploadResult.uniqueChatIds.length}
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-gray-400">Status</div>
                  <div className="text-green-400 font-medium">
                    {uploadResult.status || "Success"}
                  </div>
                </div>
              </div>

              {uploadResult.uniqueChatIds.length > 0 && (
                <div className="mt-4 p-3 bg-gray-800 rounded">
                  <div className="text-gray-400 text-sm mb-2">
                    Primary Chat ID:
                  </div>
                  <div className="text-white font-mono text-sm">
                    {uploadResult.chatId}
                  </div>
                  {uploadResult.uniqueChatIds.length > 1 && (
                    <div className="text-gray-400 text-xs mt-1">
                      + {uploadResult.uniqueChatIds.length - 1} other chat(s)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button onClick={resetUpload}>Upload Another Chat</Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-800 rounded-lg p-4">
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
                <h4 className="text-red-300 font-medium">Upload Failed</h4>
                <p className="text-red-200 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatUpload;
