import type { Task, CheckIn, DailyPlanResult, DailyPlanSlot } from '../types';
import { todayISO } from './dateUtils';

function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function generateDailyPlan(tasks: Task[], checkIn: CheckIn | undefined): DailyPlanResult {
  const today = todayISO();
  // Filter pending tasks due on or before today
  const candidateTasks = tasks.filter((t) => !t.completed && t.dueDate <= today);

  const energy = checkIn?.energy ?? 'Medium';
  const mood = checkIn?.mood ?? 'Okay';

  let eligibleTasks: Task[] = [...candidateTasks];
  const deferredTasks: Task[] = [];

  // STRESSED or OVERWHELMED: Remove Low priority tasks from suggested task slots
  if (mood === 'Stressed' || mood === 'Overwhelmed') {
    const retained: Task[] = [];
    for (const t of eligibleTasks) {
      if (t.priority === 'Low') {
        deferredTasks.push(t);
      } else {
        retained.push(t);
      }
    }
    eligibleTasks = retained;
  }

  // Sorting based on energy
  if (energy === 'Low') {
    // LOW ENERGY: Shortest tasks first
    eligibleTasks.sort((a, b) => {
      if (a.durationMinutes !== b.durationMinutes) {
        return a.durationMinutes - b.durationMinutes;
      }
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } else if (energy === 'High') {
    // HIGH ENERGY: Longest / highest-priority tasks first
    eligibleTasks.sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.durationMinutes - a.durationMinutes;
    });
  } else {
    // MEDIUM ENERGY: Priority first, then shortest duration
    eligibleTasks.sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.durationMinutes - b.durationMinutes;
    });
  }

  const taskSlots: DailyPlanSlot[] = [];
  const wellnessSlots: DailyPlanSlot[] = [];

  // Start plan at 9:00 AM (540 minutes from midnight)
  let currentMinute = 9 * 60;

  eligibleTasks.forEach((task, index) => {
    // Insert a wellness break before every task after the first
    if (index > 0) {
      const isLowEnergy = energy === 'Low';
      const breakDuration = isLowEnergy ? 15 : 10;
      const breakType = index % 3 === 1 ? 'water' : index % 3 === 2 ? 'walk' : 'break';
      const breakTitle =
        breakType === 'water'
          ? '💧 Hydration & Breath'
          : breakType === 'walk'
          ? '🚶 Light Walk & Fresh Air'
          : '☕ Rest & Mental Reset';

      const wSlot: DailyPlanSlot = {
        id: `wellness-break-${index}`,
        title: breakTitle,
        startTime: minutesToTimeString(currentMinute),
        endTime: minutesToTimeString(currentMinute + breakDuration),
        durationMinutes: breakDuration,
        type: breakType,
      };
      wellnessSlots.push(wSlot);
      currentMinute += breakDuration;
    }

    const tSlot: DailyPlanSlot = {
      id: `task-slot-${task.id}`,
      taskId: task.id,
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      durationMinutes: task.durationMinutes,
      startTime: minutesToTimeString(currentMinute),
      endTime: minutesToTimeString(currentMinute + task.durationMinutes),
      type: 'task',
    };
    taskSlots.push(tSlot);
    currentMinute += task.durationMinutes;

    // For low energy or long tasks (> 60m), insert a buffer
    if (energy === 'Low' || task.durationMinutes >= 90) {
      const bufferSlot: DailyPlanSlot = {
        id: `wellness-buffer-${index}`,
        title: '🌿 Buffer & Mindful Breathing',
        startTime: minutesToTimeString(currentMinute),
        endTime: minutesToTimeString(currentMinute + 15),
        durationMinutes: 15,
        type: 'buffer',
      };
      wellnessSlots.push(bufferSlot);
      currentMinute += 15;
    }
  });

  return {
    taskSlots,
    wellnessSlots,
    deferredTasks,
  };
}
