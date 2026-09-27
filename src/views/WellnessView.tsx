import React, { useState } from 'react';
import { useMindVibe } from '../hooks/useMindVibe';
import { DailyCheckInCard } from '../components/dashboard/DailyCheckInCard';
import { MoodChart } from '../components/wellness/MoodChart';
import { HabitCard } from '../components/wellness/HabitCard';
import { AchievementCard } from '../components/wellness/AchievementCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Plus, Award, CheckCircle2 } from 'lucide-react';

const EMOJI_OPTIONS = ['📚', '💧', '🏃', '🌙', '🧘', '🥗', '🚶', '🎯', '🌿', '📖'];

export const WellnessView: React.FC = () => {
  const { checkIns, habits, addHabit, achievements } = useMindVibe();

  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('📚');

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    addHabit(habitTitle.trim(), habitEmoji);
    setHabitTitle('');
    setAddHabitOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary tracking-tight">
            Wellness & Daily Habits
          </h2>
          <p className="text-xs text-textSecondary mt-0.5">
            Holistic balance • Physical capacity and positive study habits
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setAddHabitOpen(true)}
        >
          Add Habit
        </Button>
      </div>

      {/* Row 1: Check-in & Mood History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyCheckInCard />
        <MoodChart checkIns={checkIns} />
      </div>

      {/* Row 2: Habits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accentGreen/15 text-accentGreen flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                Daily Habit Routines
              </h3>
              <p className="text-xs text-textSecondary">
                Consistency matters • Tap to log completion
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-textSecondary">
            {habits.filter((h) => h.completedToday).length} of {habits.length} done today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>

      {/* Row 3: Achievements Section */}
      <div className="space-y-4 pt-4 border-t border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accentAmber/15 text-[#B76E00] flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-textPrimary tracking-tight">
              Milestone Badges
            </h3>
            <p className="text-xs text-textSecondary">
              Derived automatically from your study consistency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </div>

      {/* Add Habit Modal */}
      <Modal
        isOpen={addHabitOpen}
        onClose={() => setAddHabitOpen(false)}
        title="Add Daily Habit"
        subtitle="Track a micro-routine that keeps you grounded"
      >
        <form onSubmit={handleCreateHabit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10m Reading, Posture Stretch"
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-textPrimary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-textPrimary mb-2">
              Choose an Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setHabitEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl border text-xl flex items-center justify-center transition-all ${
                    habitEmoji === emoji
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border bg-background hover:bg-black/5'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setAddHabitOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!habitTitle.trim()}
            >
              Create Habit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
