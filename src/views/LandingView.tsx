import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CalendarDays,
  Timer,
  HeartPulse,
  BarChart3,
  CheckCircle2,
  Activity,
  Flame,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useMindVibe } from '../hooks/useMindVibe';
import { Button } from '../components/common/Button';

export const LandingView: React.FC = () => {
  const { setView, toggleDemoMode, demoMode } = useMindVibe();

  const handleGetStarted = () => {
    setView('onboarding');
  };

  const handleExploreDemo = () => {
    if (!demoMode) {
      toggleDemoMode();
    } else {
      setView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary antialiased flex flex-col selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="w-full border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white shadow-card shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondaryIndigo bg-clip-text text-transparent">
              MindVibe
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExploreDemo}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-black/5 text-textPrimary transition-all"
            >
              Explore Demo
            </button>
            <Button variant="primary" size="sm" onClick={handleGetStarted}>
              Get Started / Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sync your work to your energy</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-textPrimary max-w-4xl leading-tight">
          Your student life, <span className="bg-gradient-to-r from-primary to-secondaryIndigo bg-clip-text text-transparent">in sync</span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-textSecondary max-w-2xl leading-relaxed">
          Plan your academic workload, stay focused, and make room for yourself — with an AI assistant that adapts to your day.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={handleGetStarted}
          >
            Get Started / Register
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={<Sparkles className="w-5 h-5 text-secondaryIndigo" />}
            onClick={handleExploreDemo}
          >
            Explore Demo
          </Button>
        </div>

        {/* AI Philosophy Pill */}
        <div className="mt-6 flex items-center gap-2 text-xs text-textSecondary">
          <ShieldCheck className="w-4 h-4 text-accentGreen" />
          <span>AI suggests. You decide. All recommendations require explicit confirmation.</span>
        </div>

        {/* Visual Dashboard Mockup */}
        <div className="mt-14 w-full max-w-5xl rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-modal relative overflow-hidden text-left">
          {/* Mockup header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accentRose/80" />
              <div className="w-3 h-3 rounded-full bg-accentAmber/80" />
              <div className="w-3 h-3 rounded-full bg-accentGreen/80" />
              <span className="text-xs font-semibold text-textSecondary ml-2">MindVibe Dashboard Live Preview</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accentAmber/10 border border-accentAmber/25 text-[#B76E00] text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-[#E8A84A] text-[#E8A84A]" />
                <span>5d streak</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-accentGreen/15 text-accentGreen text-xs font-semibold">
                Balanced (0.5x)
              </span>
            </div>
          </div>

          {/* Mockup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: AI Schedule */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Today's AI Plan
                </span>
                <span className="text-[10px] text-textSecondary">Energy Calibrated</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-textPrimary">OOP Assignment</p>
                    <p className="text-[10px] text-textSecondary">120m • Computer Science</p>
                  </div>
                  <span className="text-[11px] font-mono text-primary font-bold">09:00</span>
                </div>

                <div className="p-2 rounded-xl border border-dashed border-accentGreen/30 bg-accentGreen/5 text-[11px] text-accentGreen flex items-center justify-between">
                  <span>☕ 15m Hydration & Rest</span>
                  <span className="font-mono text-[10px]">11:00</span>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-textPrimary">Mathematics Revision</p>
                    <p className="text-[10px] text-textSecondary">60m • Medium Priority</p>
                  </div>
                  <span className="text-[11px] font-mono text-primary font-bold">11:15</span>
                </div>
              </div>
            </div>

            {/* Column 2: Workload & Check-in */}
            <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5 mb-2">
                  <Activity className="w-3.5 h-3.5 text-accentBlue" /> Workload Indicator
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-textSecondary">Capacity demand</span>
                    <span className="font-mono font-bold text-textPrimary">3.0h / 6.0h (50%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accentGreen rounded-full w-1/2" />
                  </div>
                  <p className="text-[11px] text-accentGreen font-medium mt-1">Fits nicely • No overload</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-xs font-bold text-textPrimary block mb-1">Physical Check-In</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-card border border-border text-xs">😊 Good</span>
                  <span className="px-2 py-1 rounded-lg bg-card border border-border text-xs">⚡ Medium</span>
                  <span className="px-2 py-1 rounded-lg bg-card border border-border text-xs">🌙 7h 45m</span>
                </div>
              </div>
            </div>

            {/* Column 3: Habits & Quick Actions */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
              <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accentGreen" /> Daily Habits
              </span>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                  <span>📚 Study Routine</span>
                  <span className="text-accentGreen font-bold">5d ✓</span>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                  <span>💧 Drink Water</span>
                  <span className="text-accentGreen font-bold">3d ✓</span>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                  <span>🏃 Exercise</span>
                  <span className="text-textSecondary">4d</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Six Feature Cards */}
        <section className="mt-20 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">
              Designed for academic clarity
            </h2>
            <p className="text-xs sm:text-sm text-textSecondary mt-2">
              Every feature aligns your study schedule with real human capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {/* Card 1 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Adaptive AI Planning</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Reorders study blocks based on whether your energy is low, medium, or high — inserting hydration and buffers when you need them.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-secondaryIndigo/10 text-secondaryIndigo flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Smart Tasks</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Break intimidating assignments into bite-sized subtasks with deterministic estimates for requirements, implementation, and review.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-accentGreen/10 text-accentGreen flex items-center justify-center mb-4">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Focus Mode</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Timestamp-based drift-free timer with customizable focus presets, natural completion celebrations, and post-session wellness advice.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-accentRose/10 text-accentRose flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Wellness & Habits</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Track daily mood, energy level, and sleep alongside custom habit streaks. Never fall into silent academic burnout.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-accentAmber/10 text-[#C98220] flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Weekly Insights</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Automated pattern recognition detects when you move tasks to mornings and synthesizes actionable recommendations for next week.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all">
              <div className="w-10 h-10 rounded-xl bg-accentBlue/10 text-accentBlue flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-textPrimary">Adaptive Rescheduling</h3>
              <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                Didn't complete a task? No guilt. Move it to tomorrow morning, split it into two manageable sessions, or defer lower-priority work.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-textSecondary bg-card">
        <p>MindVibe — "Your pace. Your balance."</p>
        <p className="mt-1 text-[11px] text-textSecondary/80">
          Client-only local execution • Zero external tracking • 100% Privacy
        </p>
      </footer>
    </div>
  );
};
