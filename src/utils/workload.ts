import type { Task, CheckIn, Mood, Energy, WorkloadInfo, WorkloadState } from '../types';
import { todayISO } from './dateUtils';

const BASE_HOURS: Record<Energy, number> = {
  Low: 4,
  Medium: 6,
  High: 8,
};

const MOOD_MODIFIERS: Record<Mood, number> = {
  Overwhelmed: 0.5,
  Stressed: 0.75,
  Good: 1.0,
  Okay: 1.0,
};

export function calculateWorkload(tasks: Task[], todayCheckIn: CheckIn | undefined): WorkloadInfo {
  const today = todayISO();
  const pendingTodayTasks = tasks.filter(
    (t) => !t.completed && t.dueDate <= today
  );

  const todayMinutes = pendingTodayTasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);

  // If no check-in, use Energy = Medium, Mood = Okay for temporary calculations only
  const hasCheckIn = !!todayCheckIn;
  const energy: Energy = todayCheckIn?.energy || 'Medium';
  const mood: Mood = todayCheckIn?.mood || 'Okay';

  const baseHours = BASE_HOURS[energy] ?? 6;
  const moodModifier = MOOD_MODIFIERS[mood] ?? 1.0;
  const availableHours = baseHours * moodModifier;

  if (pendingTodayTasks.length === 0) {
    return {
      state: 'Balanced',
      subtitle: 'Nothing urgent today 🎉',
      loadRatio: 0,
      todayMinutes: 0,
      availableHours,
      progressPercent: 0,
      hasCheckIn,
    };
  }

  const loadRatio = availableHours > 0 ? (todayMinutes / 60) / availableHours : 0;
  const progressPercent = Math.min(Math.max(loadRatio * 100, 0), 100);

  let state: WorkloadState;
  let subtitle: string;

  if (loadRatio < 0.6) {
    state = 'Balanced';
    subtitle = 'Fits nicely';
  } else if (loadRatio < 0.9) {
    state = 'Busy';
    subtitle = 'A few things going on';
  } else if (loadRatio < 1.2) {
    state = 'High Workload';
    subtitle = "Let's prioritize";
  } else {
    state = 'Overloaded';
    subtitle = 'More work than available time';
  }

  return {
    state,
    subtitle,
    loadRatio: Number(loadRatio.toFixed(2)),
    todayMinutes,
    availableHours: Number(availableHours.toFixed(1)),
    progressPercent: Math.round(progressPercent),
    hasCheckIn,
  };
}
