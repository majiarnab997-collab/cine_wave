const API_BASE = 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  public async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T | null> {
    try {
      let url = `${this.baseUrl}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined) searchParams.append(key, String(val));
        });
        const qs = searchParams.toString();
        if (qs) url += `?${qs}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[ApiClient GET ${endpoint} offline/fallback]`, err);
      return null;
    }
  }

  public async post<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[ApiClient POST ${endpoint} offline/fallback]`, err);
      return null;
    }
  }

  public async put<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[ApiClient PUT ${endpoint} offline/fallback]`, err);
      return null;
    }
  }

  public async delete<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T | null> {
    try {
      let url = `${this.baseUrl}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined) searchParams.append(key, String(val));
        });
        const qs = searchParams.toString();
        if (qs) url += `?${qs}`;
      }

      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[ApiClient DELETE ${endpoint} offline/fallback]`, err);
      return null;
    }
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();
