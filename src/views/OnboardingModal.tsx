import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, User } from 'lucide-react';
import { useMindVibe } from '../hooks/useMindVibe';
import { Button } from '../components/common/Button';

const GOAL_OPTIONS = [
  'Productivity',
  'Time Management',
  'Study Routine',
  'Stress Management',
  'Habit Building',
  'Work-Life Balance',
];

const BUSYNESS_OPTIONS = [
  { label: 'Pretty chill', desc: 'Lots of free time, lighter course load' },
  { label: 'Kinda busy', desc: 'Steady mix of classes, study, and social life' },
  { label: 'Always busy', desc: 'Heavy course load, tight deadlines, packed calendar' },
];

export const OnboardingModal: React.FC = () => {
  const { profile, saveProfile, setView, closeModal, currentView, uiState } = useMindVibe();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(profile.name || 'Sneha');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile.onboardingGoals.length > 0 ? profile.onboardingGoals : ['Productivity', 'Study Routine']
  );
  const [busyness, setBusyness] = useState<string>(
    profile.onboardingBusyness || 'Kinda busy'
  );
  const [error, setError] = useState<string | null>(null);

  // Show if currentView === 'onboarding' OR activeModal === 'onboarding'
  const isVisible = currentView === 'onboarding' || uiState.activeModal === 'onboarding';

  useEffect(() => {
    if (isVisible) {
      setStep(1);
      setError(null);
      setName(profile.name || 'Sneha');
      if (profile.onboardingGoals.length > 0) {
        setSelectedGoals(profile.onboardingGoals);
      }
      if (profile.onboardingBusyness) {
        setBusyness(profile.onboardingBusyness);
      }
    }
  }, [isVisible, profile]);

  if (!isVisible) return null;

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    if (error) setError(null);
  };

  const handleNext = () => {
    if (selectedGoals.length === 0) {
      setError('Please select at least one goal to improve.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    saveProfile({
      name: name.trim(),
      onboardingGoals: selectedGoals,
      onboardingBusyness: busyness,
      onboardingComplete: true,
    });

    closeModal();
    setView('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-modal p-6 sm:p-8 animate-slide-up flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-textPrimary">MindVibe Setup</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-1.5 rounded-full transition-all ${
                step === 1 ? 'bg-primary' : 'bg-primary/40'
              }`}
            />
            <span
              className={`w-6 h-1.5 rounded-full transition-all ${
                step === 2 ? 'bg-primary' : 'bg-slate-200'
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-accentRose/10 border border-accentRose/20 text-accentRose text-xs font-semibold">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
                What do you want to improve?
              </h2>
              <p className="text-xs text-textSecondary mt-1">
                Select areas where you'd like MindVibe to help calibrate your habits and workload.
              </p>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Your First Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sneha"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
              />
            </div>

            {/* Multi-select goals */}
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-2">
                Select your focus goals (at least 1 required):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      type="button"
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                          : 'border-border bg-background hover:border-slate-300 text-textPrimary'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNext}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
                How busy are your days usually?
              </h2>
              <p className="text-xs text-textSecondary mt-1">
                We'll use this to tailor default energy capacity suggestions.
              </p>
            </div>

            {/* Single-select busyness */}
            <div className="space-y-2.5">
              {BUSYNESS_OPTIONS.map((opt) => {
                const isSelected = busyness === opt.label;
                return (
                  <button
                    type="button"
                    key={opt.label}
                    onClick={() => setBusyness(opt.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-border bg-background hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-textPrimary">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary stroke-[2.5]" />}
                    </div>
                    <p className="text-xs text-textSecondary mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                size="md"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep(1)}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Enter MindVibe
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
