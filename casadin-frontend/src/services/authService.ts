import api from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: "fiance" | "guest";
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const TOKEN_KEY = 'auth_token';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/login', data);
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/register', data);
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Token não encontrado');
    const response = await api.get('auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  logout: () => localStorage.removeItem(TOKEN_KEY),

  getLogsCsv: async (): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Token não encontrado');
    const response = await api.get('log-test/csv', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};