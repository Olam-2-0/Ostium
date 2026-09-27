import React, { useState, useEffect } from 'react';
import { Check, Moon } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import type { Mood, Energy } from '../../types';
import { Button } from '../common/Button';

const MOODS: { label: Mood; emoji: string }[] = [
  { label: 'Good', emoji: '😊' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Stressed', emoji: '😓' },
  { label: 'Overwhelmed', emoji: '😫' },
];

const ENERGIES: { label: Energy; description: string }[] = [
  { label: 'Low', description: 'Need light work' },
  { label: 'Medium', description: 'Steady pace' },
  { label: 'High', description: 'Ready to crush' },
];

export const DailyCheckInCard: React.FC = () => {
  const { todayCheckIn, saveCheckIn } = useMindVibe();

  const [selectedMood, setSelectedMood] = useState<Mood>(todayCheckIn?.mood || 'Okay');
  const [selectedEnergy, setSelectedEnergy] = useState<Energy>(todayCheckIn?.energy || 'Medium');
  const [sleep, setSleep] = useState<string>(todayCheckIn?.sleep || '7h 20m');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (todayCheckIn) {
      setSelectedMood(todayCheckIn.mood);
      setSelectedEnergy(todayCheckIn.energy);
      setSleep(todayCheckIn.sleep);
    }
  }, [todayCheckIn]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCheckIn({
      mood: selectedMood,
      energy: selectedEnergy,
      sleep: sleep.trim() || '7h 20m',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-textPrimary tracking-tight flex items-center gap-1.5">
            <span>✨</span> Daily Energy & Mood Check-In
          </h3>
          <p className="text-xs text-textSecondary mt-0.5">
            Tuning your schedule to your physical state
          </p>
        </div>
        {todayCheckIn ? (
          <span className="px-2.5 py-1 rounded-full bg-accentGreen/15 text-accentGreen text-[11px] font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> Logged today
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-accentAmber/15 text-[#B76E00] text-[11px] font-medium">
            Pending check-in
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Mood Selection */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-2">
            How are you feeling right now?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MOODS.map((m) => (
              <button
                type="button"
                key={m.label}
                onClick={() => setSelectedMood(m.label)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedMood === m.label
                    ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                    : 'border-border bg-background hover:border-slate-300 text-textPrimary'
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Selection */}
        <div>
          <label className="block text-xs font-semibold text-textSecondary mb-2">
            Energy capacity level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ENERGIES.map((e) => (
              <button
                type="button"
                key={e.label}
                onClick={() => setSelectedEnergy(e.label)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  selectedEnergy === e.label
                    ? 'border-secondaryIndigo bg-secondaryIndigo/10 text-secondaryIndigo font-semibold ring-1 ring-secondaryIndigo'
                    : 'border-border bg-background hover:border-slate-300 text-textPrimary'
                }`}
              >
                <span className="text-xs font-semibold">{e.label}</span>
                <span className="text-[10px] text-textSecondary">{e.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Input & Save Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pt-1">
          <div className="flex-1 max-w-xs">
            <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" />
              Hours of Sleep
            </label>
            <input
              type="text"
              placeholder="e.g. 7h 20m"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-textPrimary font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={savedSuccess ? <Check className="w-4 h-4" /> : undefined}
          >
            {savedSuccess ? 'Saved ✓' : todayCheckIn ? 'Update Check-In' : 'Save Check-In'}
          </Button>
        </div>
      </form>
    </div>
  );
};
