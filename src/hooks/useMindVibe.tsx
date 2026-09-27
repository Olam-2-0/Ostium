import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  View,
  ActiveModal,
  Task,
  CheckIn,
  Habit,
  FocusSession,
  Profile,
  WorkloadInfo,
  WeeklyMetrics,
  Achievement,
  DailyPlanResult,
  Priority,
  Subtask,
} from '../types';
import {
  GLOBAL_KEYS,
  getStorageKey,
  loadData,
  saveData,
  type StorageNamespace,
} from '../utils/storage';
import {
  todayISO,
  addDays,
  isToday,
  isSameDay,
} from '../utils/dateUtils';
import { calculateWorkload } from '../utils/workload';
import { calculateWeeklyMetrics, deriveAchievements, calculateStreak } from '../utils/insights';
import { generateDailyPlan as pureGenerateDailyPlan } from '../utils/aiPlanner';
import {
  getInitialDemoTasks,
  getInitialDemoHabits,
  getInitialDemoCheckIns,
  getInitialDemoFocusSessions,
  getInitialDemoProfile,
  getInitialDemoAchievements,
} from '../data/demoData';

interface UIState {
  activeModal: ActiveModal;
  aiDrawerOpen: boolean;
  editingTaskId: string | null;
  breakdownTaskId: string | null;
  rescheduleTaskId: string | null;
}

interface MindVibeContextType {
  // State
  currentView: View;
  uiState: UIState;
  demoMode: boolean;
  tasks: Task[];
  checkIns: CheckIn[];
  habits: Habit[];
  focusSessions: FocusSession[];
  profile: Profile;
  achievements: Achievement[];
  streak: number;
  workload: WorkloadInfo;
  todayCheckIn: CheckIn | undefined;

  // Actions
  setView: (view: View) => void;
  openModal: (modal: ActiveModal, targetTaskId?: string | null) => void;
  closeModal: () => void;
  openAIDrawer: () => void;
  closeAIDrawer: () => void;
  toggleDemoMode: () => void;

  // Data Mutations
  addTask: (task: Omit<Task, 'id' | 'completed' | 'scheduledTime' | 'subtasks'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  saveCheckIn: (checkIn: Omit<CheckIn, 'id' | 'date'>) => void;
  addHabit: (title: string, emoji: string) => void;
  completeHabit: (id: string) => void;
  addFocusSession: (durationMinutes: number, taskTitle: string | null) => void;
  updateTaskSchedule: (taskId: string, scheduledTime: string | null) => void;
  applyTaskBreakdown: (taskId: string, subtasks: Subtask[]) => void;
  rescheduleTask: (
    taskId: string,
    action: 'tomorrow' | 'split' | 'deferLower' | 'custom',
    customData?: { date: string; time: string }
  ) => void;
  saveProfile: (profile: Partial<Profile>) => void;
  replayOnboarding: () => void;
  logout: () => void;

  // Derived selectors
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getWeeklyMetrics: () => WeeklyMetrics;
  generateDailyPlan: () => DailyPlanResult;
}

const MindVibeContext = createContext<MindVibeContextType | null>(null);

export const MindVibeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo Mode state
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    return loadData<boolean>(GLOBAL_KEYS.demoMode, false);
  });

  const activeNamespace: StorageNamespace = demoMode ? 'demo' : 'user';

  // Navigation state
  const [currentView, setCurrentView] = useState<View>('landing');

  // UI state (separate from view state)
  const [uiState, setUiState] = useState<UIState>({
    activeModal: 'none',
    aiDrawerOpen: false,
    editingTaskId: null,
    breakdownTaskId: null,
    rescheduleTaskId: null,
  });

  // Entities state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    onboardingGoals: [],
    onboardingBusyness: '',
    onboardingComplete: false,
  });
  const [savedAchievementIds, setSavedAchievementIds] = useState<string[]>([]);

  // Function to load data for a given namespace
  const loadNamespaceData = useCallback((ns: StorageNamespace) => {
    const isDemo = ns === 'demo';

    if (isDemo) {
      // Check if demo data already initialized in localStorage
      const storedTasks = loadData<Task[] | null>(getStorageKey('demo', 'tasks'), null);
      if (storedTasks === null) {
        // Initialize dynamic demo data
        const initialTasks = getInitialDemoTasks();
        const initialHabits = getInitialDemoHabits();
        const initialCheckIns = getInitialDemoCheckIns();
        const initialFocus = getInitialDemoFocusSessions();
        const initialProfile = getInitialDemoProfile();
        const initialAch = getInitialDemoAchievements();

        saveData(getStorageKey('demo', 'tasks'), initialTasks);
        saveData(getStorageKey('demo', 'habits'), initialHabits);
        saveData(getStorageKey('demo', 'checkIns'), initialCheckIns);
        saveData(getStorageKey('demo', 'focusSessions'), initialFocus);
        saveData(getStorageKey('demo', 'profile'), initialProfile);
        saveData(getStorageKey('demo', 'achievements'), initialAch);

        setTasks(initialTasks);
        setHabits(initialHabits);
        setCheckIns(initialCheckIns);
        setFocusSessions(initialFocus);
        setProfile(initialProfile);
        setSavedAchievementIds(initialAch);
      } else {
        setTasks(storedTasks);
        setHabits(loadData<Habit[]>(getStorageKey('demo', 'habits'), []));
        setCheckIns(loadData<CheckIn[]>(getStorageKey('demo', 'checkIns'), []));
        setFocusSessions(loadData<FocusSession[]>(getStorageKey('demo', 'focusSessions'), []));
        setProfile(loadData<Profile>(getStorageKey('demo', 'profile'), getInitialDemoProfile()));
        setSavedAchievementIds(loadData<string[]>(getStorageKey('demo', 'achievements'), []));
      }
    } else {
      // User namespace
      const userProfile = loadData<Profile>(getStorageKey('user', 'profile'), {
        name: '',
        onboardingGoals: [],
        onboardingBusyness: '',
        onboardingComplete: false,
      });
      const userTasks = loadData<Task[]>(getStorageKey('user', 'tasks'), []);
      const userHabits = loadData<Habit[]>(getStorageKey('user', 'habits'), [
        { id: 'u-h-1', title: 'Study Routine', emoji: '📚', streak: 0, completedToday: false, lastCompletedDate: null },
        { id: 'u-h-2', title: 'Drink Water', emoji: '💧', streak: 0, completedToday: false, lastCompletedDate: null },
        { id: 'u-h-3', title: 'Exercise', emoji: '🏃', streak: 0, completedToday: false, lastCompletedDate: null },
      ]);
      const userCheckIns = loadData<CheckIn[]>(getStorageKey('user', 'checkIns'), []);
      const userFocus = loadData<FocusSession[]>(getStorageKey('user', 'focusSessions'), []);
      const userAch = loadData<string[]>(getStorageKey('user', 'achievements'), []);

      setProfile(userProfile);
      setTasks(userTasks);
      setHabits(userHabits);
      setCheckIns(userCheckIns);
      setFocusSessions(userFocus);
      setSavedAchievementIds(userAch);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNamespaceData(activeNamespace);

    // Initial view routing
    const initialProfile = loadData<Profile>(
      getStorageKey(activeNamespace, 'profile'),
      { name: '', onboardingGoals: [], onboardingBusyness: '', onboardingComplete: false }
    );
    if (demoMode) {
      setCurrentView('dashboard');
    } else if (initialProfile.onboardingComplete) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  }, [activeNamespace, demoMode, loadNamespaceData]);

  // Sync state mutations to active namespace in localStorage
  const persist = useCallback(
    <T,>(entity: string, data: T) => {
      saveData(getStorageKey(activeNamespace, entity), data);
    },
    [activeNamespace]
  );

  // Today's check-in
  const today = todayISO();
  const todayCheckIn = useMemo(() => {
    return checkIns.find((c) => isToday(c.date));
  }, [checkIns, today]);

  // Derived workload
  const workload = useMemo(() => {
    return calculateWorkload(tasks, todayCheckIn);
  }, [tasks, todayCheckIn]);

  // Derived streak
  const streak = useMemo(() => {
    return calculateStreak(tasks, habits);
  }, [tasks, habits]);

  // Derived achievements and auto-unlocking
  const { achievements, newlyUnlockedIds } = useMemo(() => {
    return deriveAchievements(tasks, habits, focusSessions, workload.state, savedAchievementIds);
  }, [tasks, habits, focusSessions, workload.state, savedAchievementIds]);

  // If new achievements were unlocked, persist without duplicate IDs
  const newlyUnlockedKey = newlyUnlockedIds.join(',');
  useEffect(() => {
    if (newlyUnlockedKey) {
      const ids = newlyUnlockedKey.split(',');
      setSavedAchievementIds((prev) => {
        const updated = Array.from(new Set([...prev, ...ids]));
        saveData(getStorageKey(activeNamespace, 'achievements'), updated);
        return updated;
      });
    }
  }, [newlyUnlockedKey, activeNamespace]);

  // Modal / UI actions
  const openModal = useCallback((modal: ActiveModal, targetTaskId: string | null = null) => {
    setUiState((prev) => ({
      ...prev,
      activeModal: modal,
      editingTaskId: modal === 'editTask' ? targetTaskId : prev.editingTaskId,
      breakdownTaskId: modal === 'taskBreakdown' ? targetTaskId : prev.breakdownTaskId,
      rescheduleTaskId: modal === 'reschedule' ? targetTaskId : prev.rescheduleTaskId,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      activeModal: 'none',
      editingTaskId: null,
      breakdownTaskId: null,
      rescheduleTaskId: null,
    }));
  }, []);

  const openAIDrawer = useCallback(() => {
    setUiState((prev) => ({ ...prev, aiDrawerOpen: true }));
  }, []);

  const closeAIDrawer = useCallback(() => {
    setUiState((prev) => ({ ...prev, aiDrawerOpen: false }));
  }, []);

  // Toggle Demo Mode (Lossless, never overwrites user data)
  const toggleDemoMode = useCallback(() => {
    const nextMode = !demoMode;
    saveData(GLOBAL_KEYS.demoMode, nextMode);
    setDemoMode(nextMode);

    // Switch namespace
    const nextNs: StorageNamespace = nextMode ? 'demo' : 'user';
    loadNamespaceData(nextNs);

    // If switching to demo, navigate to dashboard
    if (nextMode) {
      setCurrentView('dashboard');
    } else {
      // Switching to user: check if user onboarding is complete
      const userProfile = loadData<Profile>(getStorageKey('user', 'profile'), {
        name: '',
        onboardingGoals: [],
        onboardingBusyness: '',
        onboardingComplete: false,
      });
      if (userProfile.onboardingComplete) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    }
    // Close any open modals
    closeModal();
    closeAIDrawer();
  }, [demoMode, loadNamespaceData, closeModal, closeAIDrawer]);

  // Data Mutations
  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'completed' | 'scheduledTime' | 'subtasks'>) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        completed: false,
        scheduledTime: null,
        subtasks: [],
      };
      setTasks((prev) => {
        // Prevent duplicate creation
        if (prev.some((t) => t.id === newTask.id)) return prev;
        const updated = [newTask, ...prev];
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const completeTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, completed: true } : t));
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const saveCheckIn = useCallback(
    (checkInData: Omit<CheckIn, 'id' | 'date'>) => {
      const today = todayISO();
      setCheckIns((prev) => {
        const existingIndex = prev.findIndex((c) => isToday(c.date));
        let updated: CheckIn[];
        if (existingIndex >= 0) {
          // Replace today's check-in (no duplicate)
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...checkInData,
          };
        } else {
          const newCheckIn: CheckIn = {
            id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            date: today,
            ...checkInData,
          };
          updated = [newCheckIn, ...prev];
        }
        persist('checkIns', updated);
        return updated;
      });
    },
    [persist]
  );

  const addHabit = useCallback(
    (title: string, emoji: string) => {
      const newHabit: Habit = {
        id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        emoji: emoji || '🎯',
        streak: 0,
        completedToday: false,
        lastCompletedDate: null,
      };
      setHabits((prev) => {
        const updated = [...prev, newHabit];
        persist('habits', updated);
        return updated;
      });
    },
    [persist]
  );

  const completeHabit = useCallback(
    (id: string) => {
      const today = todayISO();
      setHabits((prev) => {
        const updated = prev.map((h) => {
          if (h.id === id) {
            // Prevent duplicate completion on same day
            if (h.completedToday || isSameDay(h.lastCompletedDate || '', today)) {
              return h;
            }
            return {
              ...h,
              completedToday: true,
              lastCompletedDate: today,
              streak: h.streak + 1,
            };
          }
          return h;
        });
        persist('habits', updated);
        return updated;
      });
    },
    [persist]
  );

  const addFocusSession = useCallback(
    (durationMinutes: number, taskTitle: string | null) => {
      const newSession: FocusSession = {
        id: `focus-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: todayISO(),
        durationMinutes,
        taskTitle,
      };
      setFocusSessions((prev) => {
        const updated = [newSession, ...prev];
        persist('focusSessions', updated);
        return updated;
      });
    },
    [persist]
  );

  const updateTaskSchedule = useCallback(
    (taskId: string, scheduledTime: string | null) => {
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === taskId ? { ...t, scheduledTime } : t));
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const applyTaskBreakdown = useCallback(
    (taskId: string, subtasks: Subtask[]) => {
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t));
        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const rescheduleTask = useCallback(
    (
      taskId: string,
      action: 'tomorrow' | 'split' | 'deferLower' | 'custom',
      customData?: { date: string; time: string }
    ) => {
      const tomorrow = addDays(todayISO(), 1);

      setTasks((prev) => {
        const target = prev.find((t) => t.id === taskId);
        if (!target) return prev;

        let updated: Task[] = [...prev];

        if (action === 'tomorrow') {
          updated = updated.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  dueDate: tomorrow,
                  scheduledTime: '09:00',
                  rescheduledFrom: target.dueDate,
                }
              : t
          );
        } else if (action === 'split') {
          // Split into two sessions: original keeps Math.ceil(dur / 2), second gets Math.floor(dur / 2)
          if (target.durationMinutes <= 40) return prev;
          const part1 = Math.ceil(target.durationMinutes / 2);
          const part2 = Math.floor(target.durationMinutes / 2);

          const secondTask: Task = {
            id: `task-split-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: `${target.title} (Part 2)`,
            subject: target.subject,
            dueDate: target.dueDate,
            priority: target.priority,
            durationMinutes: part2,
            completed: false,
            scheduledTime: null,
            subtasks: [],
            splitFromId: target.id,
          };

          updated = updated.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  durationMinutes: part1,
                  title: `${target.title} (Part 1)`,
                }
              : t
          );
          updated.push(secondTask);
        } else if (action === 'deferLower') {
          // Find lowest-priority pending task due today (excluding current target if needed)
          const priorityWeights: Record<Priority, number> = { Low: 1, Medium: 2, High: 3 };
          const candidateTasks = prev.filter((t) => !t.completed && t.dueDate <= todayISO());
          if (candidateTasks.length === 0) return prev;

          // Find task with minimum priority weight
          let lowest = candidateTasks[0];
          for (const c of candidateTasks) {
            if (priorityWeights[c.priority] < priorityWeights[lowest.priority]) {
              lowest = c;
            }
          }

          // Move the lowest-priority task to tomorrow, target task unmodified
          updated = updated.map((t) =>
            t.id === lowest.id
              ? {
                  ...t,
                  dueDate: tomorrow,
                  rescheduledFrom: lowest.dueDate,
                }
              : t
          );
        } else if (action === 'custom' && customData) {
          updated = updated.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  dueDate: customData.date,
                  scheduledTime: customData.time || null,
                  rescheduledFrom: target.dueDate,
                }
              : t
          );
        }

        persist('tasks', updated);
        return updated;
      });
    },
    [persist]
  );

  const saveProfile = useCallback(
    (profileUpdates: Partial<Profile>) => {
      setProfile((prev) => {
        const updated = { ...prev, ...profileUpdates };
        persist('profile', updated);
        return updated;
      });
    },
    [persist]
  );

  const replayOnboarding = useCallback(() => {
    openModal('onboarding');
  }, [openModal]);

  const logout = useCallback(() => {
    if (demoMode) {
      saveData(GLOBAL_KEYS.demoMode, false);
      setDemoMode(false);
    }
    setProfile((prev) => {
      const updated = { ...prev, onboardingComplete: false };
      saveData(getStorageKey('user', 'profile'), updated);
      return updated;
    });
    closeModal();
    closeAIDrawer();
    setCurrentView('landing');
  }, [demoMode, closeModal, closeAIDrawer]);

  // Derived selectors
  const getTodayTasks = useCallback(() => {
    const today = todayISO();
    return tasks.filter((t) => t.dueDate <= today);
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    const today = todayISO();
    return tasks.filter((t) => !t.completed && t.dueDate < today);
  }, [tasks]);

  const getWeeklyMetricsSelector = useCallback(() => {
    return calculateWeeklyMetrics(tasks, checkIns, focusSessions, habits);
  }, [tasks, checkIns, focusSessions, habits]);

  const generateDailyPlanSelector = useCallback(() => {
    return pureGenerateDailyPlan(tasks, todayCheckIn);
  }, [tasks, todayCheckIn]);

  const value = {
    currentView,
    uiState,
    demoMode,
    tasks,
    checkIns,
    habits,
    focusSessions,
    profile,
    achievements,
    streak,
    workload,
    todayCheckIn,

    setView: setCurrentView,
    openModal,
    closeModal,
    openAIDrawer,
    closeAIDrawer,
    toggleDemoMode,

    addTask,
    updateTask,
    deleteTask,
    completeTask,
    saveCheckIn,
    addHabit,
    completeHabit,
    addFocusSession,
    updateTaskSchedule,
    applyTaskBreakdown,
    rescheduleTask,
    saveProfile,
    replayOnboarding,
    logout,

    getTodayTasks,
    getOverdueTasks,
    getWeeklyMetrics: getWeeklyMetricsSelector,
    generateDailyPlan: generateDailyPlanSelector,
  };

  return <MindVibeContext.Provider value={value}>{children}</MindVibeContext.Provider>;
};

export const useMindVibe = () => {
  const ctx = useContext(MindVibeContext);
  if (!ctx) {
    throw new Error('useMindVibe must be used within a MindVibeProvider');
  }
  return ctx;
};
