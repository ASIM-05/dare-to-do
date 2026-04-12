import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Users, Zap, Flame, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: Target, title: "Daily Tasks", description: "Set goals, crush them daily. Your tasks, your rules." },
  { icon: Users, title: "Social Pressure", description: "Friends verify your tasks. No hiding, no excuses." },
  { icon: Zap, title: "Dare Engine", description: "Fail a task? Face a dare. Complete it or lose points." },
  { icon: Trophy, title: "Leaderboards", description: "Compete with friends. Climb the ranks. Be legendary." },
  { icon: Flame, title: "Streaks", description: "Build unstoppable momentum. Don't break the chain." },
  { icon: Shield, title: "Anti-Cheat", description: "Friends verify. Proof required. No faking allowed." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-dare/5 rounded-full blur-[100px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-primary" />
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            DARE<span className="text-primary">UP</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-pulse-glow">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Social Accountability Reimagined</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
          <span className="text-foreground">FAIL A TASK.</span>
          <br />
          <span className="text-gradient">FACE A DARE.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          The gamified accountability platform where friends keep you honest.
          Complete tasks, earn points, or face hilarious dares. No more excuses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="hero" size="lg" className="text-lg px-10 py-6" onClick={handleStart}>
            Start Your Streak 🔥
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-muted-foreground/30" onClick={handleStart}>
            See How It Works
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "500K+", label: "Tasks Completed" },
            { value: "50K+", label: "Dares Survived" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          HOW IT <span className="text-primary">WORKS</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          A ruthlessly effective system designed to make you unstoppable.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32 max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-2xl bg-card border border-primary/20 glow-primary">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
            READY TO GET <span className="text-primary">DISCIPLINED</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands who are crushing their goals through social pressure and gamification.
          </p>
          <Button variant="hero" size="lg" className="text-lg px-12 py-6" onClick={handleStart}>
            Join DareUp Now 🚀
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
