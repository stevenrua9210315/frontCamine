import {
  Auth0Provider as Auth0ProviderBase,
  useAuth0,
  User,
  type AppState,
  type Auth0ProviderOptions,
  type GetTokenSilentlyOptions,
} from "@auth0/auth0-react";
import { useEffect, useEffectEvent, useRef } from "react";
import { useNavigate } from "react-router";
import { authInterceptor } from "~/api/api";

export const Auth0Provider = <TUser extends User = User>(
  props: Auth0ProviderOptions<TUser>,
) => {
  const { children, ...others } = props;

  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState, user?: TUser) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0ProviderBase onRedirectCallback={onRedirectCallback} {...others}>
      <AuthInject />
      {children}
    </Auth0ProviderBase>
  );
};

const AuthInject: React.FC = () => {
  const { getAccessTokenSilently, logout } = useAuth0();
  const isFirstCall = useRef(true);

  const getAccessToken = useEffectEvent(async () => {
    // Force refresh on first call to get token with most recent permissions
    const options: GetTokenSilentlyOptions = isFirstCall.current
      ? { cacheMode: "off" }
      : {};
    isFirstCall.current = false;
    return await getAccessTokenSilently(options);
  });

  useEffect(() => {
    authInterceptor.setAuthGetter(getAccessToken);
    authInterceptor.setLogout(logout);

    return () => {
      authInterceptor.setAuthGetter(undefined);
      authInterceptor.setLogout(undefined);
    };
  }, []);

  return null;
};
