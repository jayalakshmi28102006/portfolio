import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (res.error) { toast.error(res.error); return; }
    if (mode === "signup") toast.success("Check your inbox to confirm your email.");
    else navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background grid-bg">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-primary">← back to site</Link>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Authenticate to manage portfolio content." : "First account becomes admin automatically."}
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-sm" />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-sm" />
          </label>
          <button type="submit" disabled={busy}
            className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs font-mono text-muted-foreground hover:text-primary">
          {mode === "signin" ? "Need an account? Sign up →" : "Already have one? Sign in →"}
        </button>
      </div>
    </div>
  );
}
