const API_BASE_URL = "https://memory-api-faff.onrender.com";

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Add health check method
  static async checkHealth() {
    return this.request("/", {
      method: "GET",
    });
  }

  static async getChats() {
    return this.request("/api/chats");
  }

  static async getMemories(chatId) {
    return this.request(`/api/memories/${chatId}`);
  }

  static async extractMemories(chatId) {
    return this.request(`/api/memories/extract/${chatId}`, {
      method: "POST",
    });
  }

  static async queryMemories(query, chatId = null, memoryTypes = null) {
    return this.request("/api/memories/query", {
      method: "POST",
      body: JSON.stringify({
        query,
        chat_id: chatId,
        memory_types: memoryTypes,
      }),
    });
  }

  static async uploadChatMessages(messages) {
    return this.request("/api/chat/upload", {
      method: "POST",
      body: JSON.stringify(messages),
    });
  }

  static async getMemoryTypes() {
    return this.request("/api/memory-types");
  }

  static async cleanupDuplicateMemories(chatId) {
    return this.request(`/api/memories/cleanup/${chatId}`, {
      method: "POST",
    });
  }
}

export default ApiService;
