// Enhanced token storage utility with expiration handling
interface TokenData {
  token: string;
  expiresAt: number;
  email: string;
  role: string;
}

class TokenStorage {
  private static token: string | null = null;
  private static readonly TOKEN_KEY = "authTokenData";
  private static readonly DEFAULT_EXPIRY_MINUTES = 3; // 3 minutes as requested

  static setToken(
    token: string,
    email: string,
    role: string,
    expiryMinutes: number = this.DEFAULT_EXPIRY_MINUTES
  ): void {
    this.token = token;

    const tokenData: TokenData = {
      token,
      email,
      role,
      expiresAt: Date.now() + expiryMinutes * 60 * 1000, // Convert minutes to milliseconds
    };

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
  }

  static getToken(): string | null {
    if (this.token && this.isTokenValid()) {
      return this.token;
    }

    // Try to get from localStorage
    const tokenDataStr = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenDataStr) {
      return null;
    }

    try {
      const tokenData: TokenData = JSON.parse(tokenDataStr);

      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      this.token = tokenData.token;
      return tokenData.token;
    } catch (error) {
      console.error("Error parsing token data:", error);
      this.clearToken();
      return null;
    }
  }

  static getTokenData(): TokenData | null {
    const tokenDataStr = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenDataStr) {
      return null;
    }

    try {
      const tokenData: TokenData = JSON.parse(tokenDataStr);

      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error("Error parsing token data:", error);
      this.clearToken();
      return null;
    }
  }

  static isTokenValid(): boolean {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) {
      return false;
    }

    try {
      const data: TokenData = JSON.parse(tokenData);
      return Date.now() < data.expiresAt;
    } catch (error) {
      return false;
    }
  }

  static getRemainingTime(): number {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) {
      return 0;
    }

    try {
      const data: TokenData = JSON.parse(tokenData);
      const remaining = data.expiresAt - Date.now();
      return Math.max(0, remaining);
    } catch (error) {
      return 0;
    }
  }

  static extendToken(
    additionalMinutes: number = this.DEFAULT_EXPIRY_MINUTES
  ): void {
    const tokenDataStr = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenDataStr) {
      return;
    }

    try {
      const tokenData: TokenData = JSON.parse(tokenDataStr);
      tokenData.expiresAt = Date.now() + additionalMinutes * 60 * 1000;
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
      console.error("Error extending token:", error);
    }
  }

  static clearToken(): void {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

export default TokenStorage;
