import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (result.redirected) return;
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent you a verification link." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-10 h-10 text-primary" />
            <span className="font-display text-2xl font-bold tracking-wider text-foreground">
              DARE<span className="text-primary">UP</span>
            </span>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back, warrior." : "Join the accountability revolution."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border h-12"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border h-12"
              required
              minLength={6}
            />
            <Button variant="hero" className="w-full h-12" type="submit" disabled={loading}>
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
