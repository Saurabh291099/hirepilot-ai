export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
