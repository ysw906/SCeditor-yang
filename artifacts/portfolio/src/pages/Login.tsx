import { useState } from "react";
import { useLogin, useGetMe } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button, Input, Label, Card } from "@/components/UI";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: user, isLoading } = useGetMe({ query: { retry: false } });
  const loginMut = useLogin();

  if (isLoading) return null;
  if (user?.isLoggedIn && user?.isAdmin) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMut.mutate({ data: { username, password } }, {
      onSuccess: (res) => {
        if (res.success) {
          window.location.href = "/admin"; // hard reload to reset query states
        } else {
          setError("Invalid credentials");
        }
      },
      onError: () => {
        setError("Invalid credentials");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Link href="/" className="fixed top-8 left-8 text-xs font-sans uppercase tracking-widest hover:opacity-50 transition-opacity">
        ← Back to Site
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="font-sans text-4xl uppercase tracking-tight mb-2">Admin Portal</h1>
          <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest">Sign in to edit portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {error && <p className="text-destructive text-sm font-sans">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={loginMut.isPending}>
            {loginMut.isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
