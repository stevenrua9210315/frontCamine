import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { getMe } from "~/api/queries";

export default function Home() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0();

  // Handlers
  const handleSignup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });
  const handleLogin = () => login();
  const handleLogout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  // Pantalla de carga estilizada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Cargando sesión...
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated) {
      getMe();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {isAuthenticated ? (
          <div className="flex flex-col items-center text-center">
            {/* Foto de Perfil */}
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-sm mb-4"
              />
            )}

            <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido!</h1>
            <p className="text-gray-500 mb-6">{user?.email}</p>

            {/* Datos del Perfil (JSON formateado) */}
            <div className="w-full text-left bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
              <p className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-widest">
                User Raw Data
              </p>
              <pre className="text-xs text-green-400 font-mono">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Mi Aplicación
            </h1>
            <p className="text-gray-500 mb-8">
              Inicia sesión para acceder a tu perfil
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700 text-sm">Error: {error.message}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all active:scale-95"
              >
                Iniciar Sesión
              </button>

              <button
                onClick={handleSignup}
                className="w-full bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-400 text-xs uppercase tracking-widest">
        Powered by Auth0 & Gemini
      </p>
    </div>
  );
}
