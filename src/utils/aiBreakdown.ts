import type { Subtask } from '../types';

interface TemplateSubtask {
  title: string;
  defaultMinutes: number;
}

export function generateTaskBreakdown(title: string, taskDurationMinutes: number): Subtask[] {
  const lower = title.toLowerCase();
  let templates: TemplateSubtask[];

  if (lower.includes('project') || lower.includes('assignment')) {
    templates = [
      { title: 'Research requirements', defaultMinutes: 30 },
      { title: 'Design/sketch', defaultMinutes: 45 },
      { title: 'Build/implement', defaultMinutes: 45 },
      { title: 'Test & document', defaultMinutes: 30 },
    ];
  } else if (lower.includes('presentation')) {
    templates = [
      { title: 'Outline', defaultMinutes: 15 },
      { title: 'Draft slides', defaultMinutes: 30 },
      { title: 'Rehearse', defaultMinutes: 15 },
    ];
  } else if (lower.includes('revision') || lower.includes('study')) {
    templates = [
      { title: 'Review notes', defaultMinutes: 20 },
      { title: 'Practice problems', defaultMinutes: 30 },
      { title: 'Self-quiz', defaultMinutes: 10 },
    ];
  } else {
    // Four reasonable chunks: Plan, Work, Refine, Review
    templates = [
      { title: 'Plan & organize materials', defaultMinutes: 15 },
      { title: 'Work on core content', defaultMinutes: 45 },
      { title: 'Refine & polish', defaultMinutes: 20 },
      { title: 'Review & verify', defaultMinutes: 10 },
    ];
  }

  // Ensure total estimatedMinutes does not exceed task duration
  const templateTotal = templates.reduce((sum, t) => sum + t.defaultMinutes, 0);
  const targetDuration = Math.max(taskDurationMinutes, 10);

  let allocatedTotal = 0;
  const subtasks: Subtask[] = templates.map((tmpl, idx) => {
    let minutes: number;
    if (templateTotal <= targetDuration) {
      minutes = tmpl.defaultMinutes;
    } else {
      // Scale down proportionally
      const ratio = targetDuration / templateTotal;
      minutes = Math.max(5, Math.floor(tmpl.defaultMinutes * ratio));
    }

    // Make sure we don't exceed targetDuration on the last item
    if (idx === templates.length - 1) {
      const remaining = targetDuration - allocatedTotal;
      minutes = Math.max(5, Math.min(minutes, remaining > 0 ? remaining : minutes));
    }
    allocatedTotal += minutes;

    return {
      id: `st-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      title: tmpl.title,
      estimatedMinutes: minutes,
      completed: false,
    };
  });

  return subtasks;
}
