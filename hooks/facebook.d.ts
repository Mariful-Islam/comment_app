declare global {
  interface Window {
    fbAsyncInit: () => void;
  }

  interface FBAuthResponse {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain?: string;
    data_access_expiration_time?: number;
  }

  interface FBLoginStatusResponse {
    status: "connected" | "not_authorized" | "unknown";
    authResponse: FBAuthResponse | null;
  }

  interface FBLoginOptions {
    scope?: string;
    return_scopes?: boolean;
    enable_profile_selector?: boolean;
    profile_selector_ids?: string[];
  }

  interface FB {
    init: (params: {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }) => void;

    getLoginStatus: (cb: (response: FBLoginStatusResponse) => void) => void;

    login: (
      cb: (response: FBLoginStatusResponse) => void,
      options?: FBLoginOptions
    ) => void;

    api: (path: string, cb: (res: any) => void) => void;
  }

  const FB: FB;
}

export {};
