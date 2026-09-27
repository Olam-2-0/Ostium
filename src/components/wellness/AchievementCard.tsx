import React from 'react';
import type { Achievement } from '../../types';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 flex items-start gap-3.5 ${
        achievement.unlocked
          ? 'bg-card border-border shadow-subtle hover:shadow-card hover:border-slate-300'
          : 'bg-background/60 border-dashed border-border opacity-50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 select-none ${
          achievement.unlocked
            ? 'bg-primary/10 border border-primary/20 shadow-xs'
            : 'bg-black/5 border border-border grayscale'
        }`}
      >
        {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-textSecondary" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm font-bold tracking-tight truncate ${
              achievement.unlocked ? 'text-textPrimary' : 'text-textSecondary'
            }`}
          >
            {achievement.title}
          </h4>
          {achievement.unlocked ? (
            <span className="px-2 py-0.5 rounded-full bg-accentGreen/15 text-accentGreen text-[10px] font-semibold shrink-0">
              Unlocked
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-black/5 text-textSecondary text-[10px] font-medium shrink-0">
              Locked
            </span>
          )}
        </div>
        <p className="text-xs text-textSecondary mt-0.5 leading-snug">{achievement.description}</p>
      </div>
    </div>
  );
};
