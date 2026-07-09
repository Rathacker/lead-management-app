import { api } from "./client";

export interface LoginResponse {
  token: string;
  user: { id: string; email: string };
}

export const AuthApi = {
  login(email: string, password: string) {
    return api.post<LoginResponse>("/auth/login", { email, password }).then((r) => r.data);
  },
};
