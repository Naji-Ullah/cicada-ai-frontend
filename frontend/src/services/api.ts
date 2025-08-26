const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  user_message: ChatMessage;
  ai_response: ChatMessage;
}

export interface ChatMessage {
  id: string;
  message_type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

class ApiService {
  private getAccessToken(): string | null {
    return localStorage.getItem("access");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh");
  }

  private async refreshToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }), // ✅ DRF SimpleJWT expects "refresh"
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      if (data.access) { // ✅ DRF returns "access"
        localStorage.setItem("access", data.access);
        return data.access;
      }
      return null;
    } catch (err) {
      console.error("Token refresh failed:", err);
      this.clearBrowserStorage();
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API request to: ${url}`);

    let accessToken = this.getAccessToken();

    let config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    let response = await fetch(url, config);

    // If token expired, try refreshing
    if (response.status === 401) {
      accessToken = await this.refreshToken();
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  private clearBrowserStorage(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(
            /=.*/,
            "=;expires=" + new Date().toUTCString() + ";path=/"
          );
      });
    } catch (error) {
      console.warn("Error clearing browser storage:", error);
    }
  }

  async login(data: LoginRequest): Promise<{ user: User; access: string; refresh: string }> {
    const res = await this.request<{ user: User; access: string; refresh: string }>(
      "/auth/login/",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // ✅ Save tokens with correct keys
    if (res.access && res.refresh) {
      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
    } else {
      console.warn("Login response did not include tokens:", res);
    }

    return res;
  }

  async register(data: RegisterRequest): Promise<{ user: User; message: string }> {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

async logout(): Promise<{ message: string }> {
    try {
        const refresh = this.getRefreshToken();
        const response = await this.request<{ message: string }>("/auth/logout/", {
            method: "POST",
            body: JSON.stringify({ refresh }), // Send refresh token
        });

        this.clearBrowserStorage();
        return response;
    } catch (error) {
        console.error("Logout request failed:", error);
        this.clearBrowserStorage();
        return { message: "Logout completed" };
    }
}

  async getProfile(): Promise<User> {
    try {
      return await this.request<User>("/auth/profile/");
    } catch (error) {
      if (error instanceof Error && error.message.includes("403")) {
        throw new Error("Not authenticated");
      }
      throw error;
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return this.request("/chat/");
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    return this.request("/chat/", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async clearChat(): Promise<{ message: string }> {
    return this.request("/chat/clear/", {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
