// types.ts
export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
      height: number;
      width: number;
    };
  };
}

export interface FacebookContextType {
  user: FacebookUser | null;
  token: string | null;
  setUser: (user: FacebookUser | null) => void;
  setToken: (token: string | null) => void;
}
