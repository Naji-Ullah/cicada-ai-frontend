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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
        console.log(`Making API request to: ${url}`);

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch (error) {
      console.warn('Error clearing browser storage:', error);
    }
  }

  async login(data: LoginRequest): Promise<{ user: User; message: string }> {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<{ user: User; message: string }> {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.request<{ message: string }>('/auth/logout/', {
        method: 'POST',
      });
      
      this.clearBrowserStorage();
      
      return response;
    } catch (error) {
      console.error('Logout request failed:', error);
      this.clearBrowserStorage();
      return { message: 'Logout completed' };
    }
  }

  async getProfile(): Promise<User> {
    try {
      return await this.request<User>('/auth/profile/');
    } catch (error) {

      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Not authenticated');
      }
      throw error;
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return this.request('/chat/');
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    return this.request('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async clearChat(): Promise<{ message: string }> {
    return this.request('/chat/clear/', {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();