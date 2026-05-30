import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminCertificates } from "@/components/admin/AdminCertificates";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Tab = "projects" | "certificates" | "messages";

function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("projects");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center font-mono text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account doesn't have admin privileges.</p>
          <button onClick={() => signOut()} className="mt-6 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold">Sign out</button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "certificates", label: "Certificates" },
    { id: "messages", label: "Messages" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-primary">← back to site</Link>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight">Admin control</h1>
          </div>
          <button onClick={() => signOut()} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest border border-border hover:border-primary hover:text-primary transition">
            <LogOut className="size-3" /> Sign out
          </button>
        </div>
        <div className="mx-auto max-w-7xl px-6 flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        {tab === "projects" && <AdminProjects />}
        {tab === "certificates" && <AdminCertificates />}
        {tab === "messages" && <AdminMessages />}
      </main>
    </div>
  );
}
