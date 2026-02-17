import axios, { type InternalAxiosRequestConfig } from "axios";
import { config } from "~/config";

class AuthInterceptor {
  public getToken: (() => Promise<string>) | undefined = undefined;
  private logout:
    | ((options?: { logoutParams: { returnTo: any } }) => Promise<void>)
    | undefined = undefined;

  public setAuthGetter(getToken?: () => Promise<string>): void {
    this.getToken = getToken;
  }

  public setLogout(
    logout?: (options?: { logoutParams: { returnTo: any } }) => Promise<void>,
  ) {
    this.logout = logout;
  }

  public intercept = async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    if (!this.getToken || !this.logout) {
      console.error(
        "AuthInterceptor misconfigured, you must set the getToken and logout methods",
      );
      return config;
    }

    try {
      const token = await this.getToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      if (this.isHardAuthError(error)) {
        // Clear Auth0 SDK state
        this.logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      }
      throw error;
    }

    return config;
  };

  private isHardAuthError(error: any) {
    return (
      error?.error === "missing_refresh_token" ||
      error?.error === "invalid_grant" ||
      error?.error === "login_required"
    );
  }
}

export const authInterceptor = new AuthInterceptor();

export const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(authInterceptor.intercept);