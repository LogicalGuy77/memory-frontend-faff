import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const ApiStatus = ({ className = "" }) => {
  const [status, setStatus] = useState("checking"); // 'checking', 'online', 'offline'
  const [lastChecked, setLastChecked] = useState(null);

  const checkApiStatus = async () => {
    try {
      setStatus("checking");
      await ApiService.checkHealth();
      setStatus("online");
      setLastChecked(new Date());
    } catch (error) {
      setStatus("offline");
      setLastChecked(new Date());
      console.error("API health check failed:", error);
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkApiStatus();

    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-900/20 border-green-700";
      case "offline":
        return "text-red-400 bg-red-900/20 border-red-700";
      case "checking":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-700";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-700";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
        );
      case "offline":
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
          </svg>
        );
      case "checking":
        return (
          <svg
            className="w-3 h-3 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "API Online";
      case "offline":
        return "API Offline";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  const formatLastChecked = () => {
    if (!lastChecked) return "";
    const now = new Date();
    const diff = Math.floor((now - lastChecked) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastChecked.toLocaleTimeString();
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs ${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      <span className="font-medium">{getStatusText()}</span>
      {lastChecked && status !== "checking" && (
        <span className="opacity-75">• {formatLastChecked()}</span>
      )}
      <button
        onClick={checkApiStatus}
        className="ml-1 hover:opacity-80 transition-opacity"
        title="Refresh status"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};

export default ApiStatus;
