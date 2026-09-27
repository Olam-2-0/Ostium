export type View =
  | "landing"
  | "onboarding"
  | "dashboard"
  | "planner"
  | "focus"
  | "wellness"
  | "insights";

export type ActiveModal =
  | "none"
  | "onboarding"
  | "quickAddTask"
  | "taskBreakdown"
  | "reschedule"
  | "editTask";

export type Mood = "Good" | "Okay" | "Stressed" | "Overwhelmed";
export type Energy = "Low" | "Medium" | "High";
export type Priority = "High" | "Medium" | "Low";

export interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  durationMinutes: number;
  completed: boolean;
  scheduledTime: string | null; // e.g. "09:00"
  subtasks: Subtask[];
  rescheduledFrom?: string;
  splitFromId?: string;
}

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  energy: Energy;
  sleep: string;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  streak: number;
  completedToday: boolean;
  lastCompletedDate: string | null;
}

export interface FocusSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  taskTitle: string | null;
}

export interface Profile {
  name: string;
  onboardingGoals: string[];
  onboardingBusyness: string;
  onboardingComplete: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export type WorkloadState = "Balanced" | "Busy" | "High Workload" | "Overloaded";

export interface WorkloadInfo {
  state: WorkloadState;
  subtitle: string;
  loadRatio: number;
  todayMinutes: number;
  availableHours: number;
  progressPercent: number;
  hasCheckIn: boolean;
}

export interface DailyPlanSlot {
  id: string;
  taskId?: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  type: "task" | "break" | "water" | "walk" | "buffer";
  subject?: string;
  priority?: Priority;
}

export interface DailyPlanResult {
  taskSlots: DailyPlanSlot[];
  wellnessSlots: DailyPlanSlot[];
  deferredTasks: Task[];
}

export interface WeeklyMetrics {
  tasksCompletedRate: number;
  focusHours: number;
  averageMood: number;
  currentStreak: number;
  completedCount: number;
  totalCount: number;
  tasksByDay: { date: string; dayLabel: string; completed: number; total: number }[];
  focusByDay: { date: string; dayLabel: string; minutes: number }[];
  workloadVsEnergy: { date: string; dayLabel: string; workloadScore: number; energyScore: number }[];
  weeklyInsight: string;
}
