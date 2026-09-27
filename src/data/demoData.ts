import type { Task, CheckIn, Habit, FocusSession, Profile } from '../types';
import { todayISO, addDays } from '../utils/dateUtils';

export function getInitialDemoTasks(): Task[] {
  const today = todayISO();
  return [
    {
      id: 'demo-task-1',
      title: 'OOP Assignment',
      subject: 'Computer Science',
      dueDate: today,
      priority: 'High',
      durationMinutes: 120,
      completed: false,
      scheduledTime: null,
      subtasks: [],
    },
    {
      id: 'demo-task-2',
      title: 'Mathematics Revision',
      subject: 'Mathematics',
      dueDate: today,
      priority: 'Medium',
      durationMinutes: 60,
      completed: false,
      scheduledTime: null,
      subtasks: [],
    },
    {
      id: 'demo-task-3',
      title: 'DBMS Project',
      subject: 'Computer Science',
      dueDate: addDays(today, 3),
      priority: 'High',
      durationMinutes: 180,
      completed: false,
      scheduledTime: null,
      subtasks: [],
    },
    {
      id: 'demo-task-4',
      title: 'Read Economics Module 3',
      subject: 'Economics',
      dueDate: addDays(today, 4),
      priority: 'Low',
      durationMinutes: 45,
      completed: true,
      scheduledTime: null,
      subtasks: [],
    },
    {
      id: 'demo-task-5',
      title: 'Prepare Presentation',
      subject: 'Campus Activity',
      dueDate: addDays(today, 2),
      priority: 'Medium',
      durationMinutes: 60,
      completed: false,
      scheduledTime: null,
      subtasks: [],
    },
  ];
}

export function getInitialDemoHabits(): Habit[] {
  const yesterday = addDays(todayISO(), -1);
  return [
    {
      id: 'demo-habit-1',
      title: 'Study Routine',
      emoji: '📚',
      streak: 5,
      completedToday: false,
      lastCompletedDate: yesterday,
    },
    {
      id: 'demo-habit-2',
      title: 'Drink Water',
      emoji: '💧',
      streak: 3,
      completedToday: false,
      lastCompletedDate: yesterday,
    },
    {
      id: 'demo-habit-3',
      title: 'Exercise',
      emoji: '🏃',
      streak: 4,
      completedToday: false,
      lastCompletedDate: yesterday,
    },
    {
      id: 'demo-habit-4',
      title: 'Sleep on Time',
      emoji: '🌙',
      streak: 2,
      completedToday: false,
      lastCompletedDate: yesterday,
    },
  ];
}

export function getInitialDemoCheckIns(): CheckIn[] {
  const today = todayISO();
  return [
    {
      id: 'demo-ci-1',
      date: addDays(today, -3),
      mood: 'Good',
      energy: 'Medium',
      sleep: '7h 45m',
    },
    {
      id: 'demo-ci-2',
      date: addDays(today, -2),
      mood: 'Okay',
      energy: 'Low',
      sleep: '6h 30m',
    },
    {
      id: 'demo-ci-3',
      date: addDays(today, -1),
      mood: 'Stressed',
      energy: 'Medium',
      sleep: '6h 15m',
    },
    // No check-in today initially
  ];
}

export function getInitialDemoFocusSessions(): FocusSession[] {
  const today = todayISO();
  return [
    {
      id: 'demo-focus-1',
      date: addDays(today, -4),
      durationMinutes: 25,
      taskTitle: 'OOP Assignment',
    },
    {
      id: 'demo-focus-2',
      date: addDays(today, -3),
      durationMinutes: 25,
      taskTitle: 'Mathematics Revision',
    },
    {
      id: 'demo-focus-3',
      date: addDays(today, -2),
      durationMinutes: 45,
      taskTitle: 'DBMS Project Research',
    },
    {
      id: 'demo-focus-4',
      date: addDays(today, -1),
      durationMinutes: 25,
      taskTitle: 'Economics Reading',
    },
  ];
}

export function getInitialDemoProfile(): Profile {
  return {
    name: 'Sneha',
    onboardingGoals: ['Productivity', 'Study Routine', 'Time Management'],
    onboardingBusyness: 'Kinda busy',
    onboardingComplete: true,
  };
}

export function getInitialDemoAchievements(): string[] {
  return ['first_step'];
}
