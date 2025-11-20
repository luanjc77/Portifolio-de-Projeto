import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // NOTE: intentionally insecure redirect logic for study of open-redirect vulnerabilities.
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo");

    if (returnTo) {
      // Mitigation: only allow redirects to the same origin (internal paths).
      // We intentionally keep a weak validation so the vulnerability can be explored later,
      // but external/site-to-site open redirects are blocked.
      try {
        const dest = new URL(returnTo, window.location.origin);
        if (dest.origin === window.location.origin) {
          // safe-ish: follow internal path
          window.location.href = dest.pathname + dest.search + dest.hash;
          return;
        }
      } catch (err) {
        // invalid URL string -> ignore and fallthrough to safe navigation
      }
    }

    // fallback behaviour: navigate to home for now
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-3">Login</h1>
      <p className="mb-4 text-sm text-muted-foreground">Página de login de demonstração. O parâmetro <code>returnTo</code> será seguido sem validação (open-redirect) — usar apenas em ambiente de estudo.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full input" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="btn btn-primary">Entrar</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
