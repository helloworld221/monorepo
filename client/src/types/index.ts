export interface User {
  name: string;
  _id: string;
  googleId: string;
  email: string;
  picture?: string;
}

export interface Media {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileType: string;
  s3Key: string;
  url: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}
