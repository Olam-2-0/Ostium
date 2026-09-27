import type { Task, CheckIn, Habit, FocusSession, WeeklyMetrics, Achievement, WorkloadState } from '../types';
import { todayISO, addDays, isSameDay, getLastNDaysISO, parseISODate } from './dateUtils';

const MOOD_SCORES: Record<string, number> = {
  Good: 4,
  Okay: 3,
  Stressed: 2,
  Overwhelmed: 1,
};

const ENERGY_SCORES: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

/**
 * Calculates current streak.
 * Streak counts consecutive days with at least one completed task OR completed habit.
 * Streak can end today or yesterday.
 */
export function calculateStreak(tasks: Task[], habits: Habit[]): number {
  const today = todayISO();
  const yesterday = addDays(today, -1);

  // Set of dates with activity
  const activeDates = new Set<string>();

  // Habits with completions
  habits.forEach((h) => {
    if (h.completedToday) {
      activeDates.add(today);
    }
    if (h.lastCompletedDate) {
      activeDates.add(h.lastCompletedDate);
    }
  });

  // Completed tasks: we can check if task was completed and due on/before today
  tasks.forEach((t) => {
    if (t.completed) {
      activeDates.add(t.dueDate);
    }
  });

  // Determine starting point: today if active today, else yesterday if active yesterday
  let checkDate = activeDates.has(today) ? today : activeDates.has(yesterday) ? yesterday : null;
  if (!checkDate) {
    return 0;
  }

  let streak = 0;
  while (activeDates.has(checkDate)) {
    streak++;
    checkDate = addDays(checkDate, -1);
    if (streak > 365) break; // safety cap
  }

  return streak;
}

export function calculateWeeklyMetrics(
  tasks: Task[],
  checkIns: CheckIn[],
  focusSessions: FocusSession[],
  habits: Habit[]
): WeeklyMetrics {
  const last7Days = getLastNDaysISO(7);
  const streak = calculateStreak(tasks, habits);

  // 1. Tasks completed rate
  // Consider tasks due within last 7 days or all current tasks
  const recentTasks = tasks.filter((t) => {
    return last7Days.includes(t.dueDate) || isSameDay(t.dueDate, todayISO());
  });
  const completedCount = recentTasks.filter((t) => t.completed).length;
  const totalCount = recentTasks.length;
  const tasksCompletedRate = totalCount > 0 ? completedCount / totalCount : 0;

  // 2. Focus Hours in last 7 days
  const recentFocus = focusSessions.filter((fs) => last7Days.includes(fs.date));
  const focusMinutesTotal = recentFocus.reduce((sum, fs) => sum + (fs.durationMinutes || 0), 0);
  const focusHours = Number((focusMinutesTotal / 60).toFixed(1));

  // 3. Average Mood
  const recentCheckIns = checkIns.filter((ci) => last7Days.includes(ci.date));
  let averageMood = 0;
  if (recentCheckIns.length > 0) {
    const sumMood = recentCheckIns.reduce((sum, ci) => sum + (MOOD_SCORES[ci.mood] || 3), 0);
    averageMood = Number((sumMood / recentCheckIns.length).toFixed(1));
  }

  // Chart 1: Tasks completed by day
  const tasksByDay = last7Days.map((dateStr) => {
    const d = parseISODate(dateStr);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTasks = tasks.filter((t) => isSameDay(t.dueDate, dateStr));
    const dayCompleted = dayTasks.filter((t) => t.completed).length;
    return {
      date: dateStr,
      dayLabel,
      completed: dayCompleted,
      total: dayTasks.length,
    };
  });

  // Chart 2: Focus time by day
  const focusByDay = last7Days.map((dateStr) => {
    const d = parseISODate(dateStr);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const daySessions = focusSessions.filter((fs) => isSameDay(fs.date, dateStr));
    const minutes = daySessions.reduce((sum, fs) => sum + fs.durationMinutes, 0);
    return {
      date: dateStr,
      dayLabel,
      minutes,
    };
  });

  // Chart 3: Workload vs Energy
  const workloadVsEnergy = last7Days.map((dateStr) => {
    const d = parseISODate(dateStr);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const ci = checkIns.find((c) => isSameDay(c.date, dateStr));
    const energyScore = ci ? (ENERGY_SCORES[ci.energy] || 2) : 2;

    const dayTasks = tasks.filter((t) => isSameDay(t.dueDate, dateStr));
    const totalMins = dayTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
    // Workload: Balanced = 0, Busy = 1, High = 2, Overloaded = 3
    let workloadScore = 0;
    if (totalMins > 240) workloadScore = 3;
    else if (totalMins > 150) workloadScore = 2;
    else if (totalMins > 60) workloadScore = 1;

    return {
      date: dateStr,
      dayLabel,
      workloadScore,
      energyScore,
    };
  });

  // Weekly Insight rules in exact priority order
  // 1. If >= 3 tasks were rescheduled from evening to morning this week
  const rescheduledToMorningCount = tasks.filter((t) => {
    return t.rescheduledFrom && t.scheduledTime === '09:00';
  }).length;

  let weeklyInsight = '';
  if (rescheduledToMorningCount >= 3) {
    weeklyInsight =
      'MindVibe noticed you tend to move evening tasks to the next day. Suggestion: Try scheduling heavier assignments earlier when your energy is higher.';
  } else if (recentCheckIns.length >= 2 && averageMood < 2.5) {
    weeklyInsight =
      'Your mood has been on the lower side this week. Consider shorter focus blocks and more breaks between tasks.';
  } else if (recentFocus.length >= 5) {
    weeklyInsight = `Strong focus week — ${recentFocus.length} sessions logged. Keep protecting those blocks.`;
  } else if (totalCount >= 3 && tasksCompletedRate < 0.5) {
    weeklyInsight =
      'Several tasks stayed open this week. Try breaking big items into smaller subtasks.';
  } else {
    weeklyInsight =
      'Steady week. Keep logging check-ins so MindVibe can tune suggestions to your energy patterns.';
  }

  return {
    tasksCompletedRate: Number(tasksCompletedRate.toFixed(2)),
    focusHours,
    averageMood,
    currentStreak: streak,
    completedCount,
    totalCount,
    tasksByDay,
    focusByDay,
    workloadVsEnergy,
    weeklyInsight,
  };
}

export const ALL_ACHIEVEMENTS: { id: string; title: string; description: string; icon: string }[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed at least one task ever',
    icon: '🏆',
  },
  {
    id: 'seven_day_streak',
    title: '7 Day Streak',
    description: 'Maintained a 7-day active streak',
    icon: '🔥',
  },
  {
    id: 'on_track',
    title: 'On Track',
    description: 'Completed a focus session in the last 3 days',
    icon: '🎯',
  },
  {
    id: 'balanced_day',
    title: 'Balanced Day',
    description: 'Balanced workload and completed at least one habit today',
    icon: '⚖️',
  },
  {
    id: 'habit_builder',
    title: 'Habit Builder',
    description: 'Built any habit to a streak of 3 or more',
    icon: '🌱',
  },
];

export function deriveAchievements(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  todayWorkloadState: WorkloadState,
  savedAchievementIds: string[]
): { achievements: Achievement[]; newlyUnlockedIds: string[] } {
  const streak = calculateStreak(tasks, habits);
  const today = todayISO();
  const last3Days = getLastNDaysISO(3);

  const hasCompletedTask = tasks.some((t) => t.completed);
  const hasStreak7 = streak >= 7;
  const hasFocusLast3Days = focusSessions.some((fs) => last3Days.includes(fs.date));
  const hasHabitCompletedToday = habits.some((h) => h.completedToday || isSameDay(h.lastCompletedDate || '', today));
  const hasBalancedDay = todayWorkloadState === 'Balanced' && hasHabitCompletedToday;
  const hasHabitStreak3 = habits.some((h) => h.streak >= 3);

  const unlockedMap: Record<string, boolean> = {
    first_step: hasCompletedTask || savedAchievementIds.includes('first_step'),
    seven_day_streak: hasStreak7 || savedAchievementIds.includes('seven_day_streak'),
    on_track: hasFocusLast3Days || savedAchievementIds.includes('on_track'),
    balanced_day: hasBalancedDay || savedAchievementIds.includes('balanced_day'),
    habit_builder: hasHabitStreak3 || savedAchievementIds.includes('habit_builder'),
  };

  const newlyUnlockedIds: string[] = [];
  const achievements: Achievement[] = ALL_ACHIEVEMENTS.map((a) => {
    const isUnlocked = !!unlockedMap[a.id];
    if (isUnlocked && !savedAchievementIds.includes(a.id)) {
      newlyUnlockedIds.push(a.id);
    }
    return {
      ...a,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked ? (savedAchievementIds.includes(a.id) ? 'Earlier' : 'Just now') : null,
    };
  });

  return { achievements, newlyUnlockedIds };
}
