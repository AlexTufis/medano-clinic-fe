// Simple token storage utility
class TokenStorage {
  private static token: string | null = null;

  static setToken(token: string): void {
    this.token = token;
    // Optionally store in localStorage for persistence
    localStorage.setItem("authToken", token);
  }

  static getToken(): string | null {
    if (this.token) {
      return this.token;
    }
    // Try to get from localStorage
    return localStorage.getItem("authToken");
  }

  static clearToken(): void {
    this.token = null;
    localStorage.removeItem("authToken");
  }
}

export default TokenStorage;
