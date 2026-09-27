import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Button } from '../common/Button';
import { Badge, PriorityBadge } from '../common/Badge';

export const AIDrawer: React.FC = () => {
  const {
    uiState,
    closeAIDrawer,
    generateDailyPlan,
    updateTaskSchedule,
    tasks,
    getOverdueTasks,
    openModal,
    rescheduleTask,
  } = useMindVibe();

  const [activeTab, setActiveTab] = useState<'chat' | 'plan' | 'overwhelmed' | 'breakdown' | 'overdue'>('chat');
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; actionTab?: 'plan' | 'overwhelmed' | 'breakdown' | 'overdue' }[]
  >([
    {
      sender: 'ai',
      text: 'Hi there! I am MindVibe AI. "AI suggests. You decide." How can I support your schedule today?',
    },
  ]);
  const [acceptedPlanNotice, setAcceptedPlanNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && uiState.aiDrawerOpen) {
        closeAIDrawer();
      }
    };
    if (uiState.aiDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uiState.aiDrawerOpen, closeAIDrawer]);

  if (!uiState.aiDrawerOpen) return null;

  const plan = generateDailyPlan();
  const overdueTasks = getOverdueTasks();
  const pendingTasks = tasks.filter((t) => !t.completed);

  const handlePillClick = (action: 'plan' | 'overwhelmed' | 'breakdown' | 'overdue') => {
    setActiveTab(action);
    const labelMap = {
      plan: 'Plan my day',
      overwhelmed: "I'm overwhelmed",
      breakdown: 'Break down a task',
      overdue: 'Move unfinished tasks',
    };
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: labelMap[action] },
      {
        sender: 'ai',
        text: `Here are my deterministic suggestions for "${labelMap[action]}". Review the options below and click to accept changes whenever you are ready.`,
        actionTab: action,
      },
    ]);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim().toLowerCase();
    const userMsg = inputText.trim();
    setInputText('');

    if (query.includes('plan') || query.includes('schedule') || query.includes('day')) {
      setActiveTab('plan');
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: userMsg },
        {
          sender: 'ai',
          text: "I've structured a daily plan derived from your energy and priorities. Review it below.",
          actionTab: 'plan',
        },
      ]);
    } else if (query.includes('overwhelm') || query.includes('stress') || query.includes('tired')) {
      setActiveTab('overwhelmed');
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: userMsg },
        {
          sender: 'ai',
          text: "Take a deep breath. Let's protect your energy and lighten your load right now.",
          actionTab: 'overwhelmed',
        },
      ]);
    } else if (query.includes('break') || query.includes('subtask') || query.includes('divide')) {
      setActiveTab('breakdown');
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: userMsg },
        {
          sender: 'ai',
          text: 'Select any task below to generate structured subtasks with deterministic time estimates.',
          actionTab: 'breakdown',
        },
      ]);
    } else if (query.includes('move') || query.includes('unfinish') || query.includes('overdue')) {
      setActiveTab('overdue');
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: userMsg },
        {
          sender: 'ai',
          text: 'Here are tasks that need attention. You can quickly add them to your schedule.',
          actionTab: 'overdue',
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: userMsg },
        {
          sender: 'ai',
          text: 'I can help with planning, focus, or rescheduling — try one of the prompt pills above.',
        },
      ]);
    }
  };

  const handleAcceptPlan = () => {
    // CRITICAL: Accept Plan must ONLY update: scheduledTime on existing tasks
    plan.taskSlots.forEach((slot) => {
      if (slot.taskId) {
        updateTaskSchedule(slot.taskId, slot.startTime);
      }
    });
    setAcceptedPlanNotice(true);
    setTimeout(() => setAcceptedPlanNotice(false), 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAIDrawer();
      }}
    >
      <div className="w-full max-w-md h-full bg-card border-l border-border shadow-modal flex flex-col transform animate-slide-left">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-textPrimary tracking-tight">MindVibe Assistant</h2>
              <p className="text-[11px] text-textSecondary flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-accentGreen" />
                Rule-based • AI suggests. You decide.
              </p>
            </div>
          </div>
          <button
            onClick={closeAIDrawer}
            aria-label="Close assistant"
            className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt pills */}
        <div className="p-3 border-b border-border/60 bg-card overflow-x-auto flex items-center gap-2 scrollbar-none">
          <button
            onClick={() => handlePillClick('plan')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'plan'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-background hover:bg-primary/5 text-textPrimary border border-border'
            }`}
          >
            ✦ Plan my day
          </button>
          <button
            onClick={() => handlePillClick('overwhelmed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'overwhelmed'
                ? 'bg-accentRose text-white shadow-xs'
                : 'bg-background hover:bg-accentRose/5 text-textPrimary border border-border'
            }`}
          >
            😮‍💨 I'm overwhelmed
          </button>
          <button
            onClick={() => handlePillClick('breakdown')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'breakdown'
                ? 'bg-secondaryIndigo text-white shadow-xs'
                : 'bg-background hover:bg-secondaryIndigo/5 text-textPrimary border border-border'
            }`}
          >
            🧩 Break down a task
          </button>
          <button
            onClick={() => handlePillClick('overdue')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'overdue'
                ? 'bg-accentAmber text-white shadow-xs'
                : 'bg-background hover:bg-accentAmber/5 text-textPrimary border border-border'
            }`}
          >
            ⏰ Move unfinished tasks
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {acceptedPlanNotice && (
            <div className="p-3 rounded-xl bg-accentGreen/15 border border-accentGreen/30 text-accentGreen text-xs font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Plan accepted! Only scheduled times were applied to your tasks.</span>
            </div>
          )}

          {/* Active Tab View or Chat View */}
          {activeTab === 'plan' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-textPrimary">Suggested Daily Plan</h3>
                <span className="text-[11px] text-textSecondary">
                  {plan.taskSlots.length} tasks • {plan.wellnessSlots.length} breaks
                </span>
              </div>

              {plan.taskSlots.length === 0 && plan.deferredTasks.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-background border border-border">
                  <p className="text-xs text-textSecondary">No pending tasks for today to schedule.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Timeline */}
                  {plan.taskSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold">
                          <span>{slot.startTime}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-textPrimary">{slot.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {slot.subject && <span className="text-[10px] text-textSecondary">{slot.subject}</span>}
                            <span className="text-[10px] text-textSecondary">• {slot.durationMinutes}m</span>
                          </div>
                        </div>
                      </div>
                      {slot.priority && <PriorityBadge priority={slot.priority} />}
                    </div>
                  ))}

                  {/* Wellness Slots (display-only) */}
                  {plan.wellnessSlots.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-xl border border-dashed border-accentGreen/30 bg-accentGreen/5 text-xs text-accentGreen flex items-center justify-between"
                    >
                      <span className="font-medium">{w.title}</span>
                      <span className="font-mono text-[10px] text-accentGreen/80">{w.startTime}</span>
                    </div>
                  ))}

                  {/* Deferred Tasks */}
                  {plan.deferredTasks.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-medium text-accentRose mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Deferred to protect your energy:
                      </p>
                      <div className="space-y-1">
                        {plan.deferredTasks.map((dt) => (
                          <div
                            key={dt.id}
                            className="p-2 rounded-lg bg-background border border-border text-xs text-textSecondary flex items-center justify-between"
                          >
                            <span>{dt.title}</span>
                            <Badge variant="low" size="sm">
                              {dt.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accept Plan Button */}
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={handleAcceptPlan}
                    >
                      Accept Plan
                    </Button>
                    <p className="text-[10px] text-textSecondary text-center mt-1.5">
                      Only updates scheduled time on existing tasks.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'overwhelmed' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-accentRose/10 border border-accentRose/20 text-textPrimary">
                <h3 className="text-sm font-bold text-accentRose flex items-center gap-1.5 mb-1">
                  <span>😮‍💨</span> Breathing Room Protocol
                </h3>
                <p className="text-xs text-textSecondary">
                  When workload exceeds your current capacity, doing everything is impossible. Let's make today
                  survivable:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-border bg-card flex items-start gap-2.5">
                  <span className="text-lg">1️⃣</span>
                  <div className="text-xs">
                    <p className="font-semibold text-textPrimary">Defer Low-Priority Assignments</p>
                    <p className="text-textSecondary mt-0.5">
                      Postpone non-urgent tasks to tomorrow so you can focus on what actually matters today.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card flex items-start gap-2.5">
                  <span className="text-lg">2️⃣</span>
                  <div className="text-xs">
                    <p className="font-semibold text-textPrimary">Two 25-minute Focus Blocks</p>
                    <p className="text-textSecondary mt-0.5">
                      Don't attempt massive 3-hour marathons. Commit to two short sprints with a 15-minute break.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card flex items-start gap-2.5">
                  <span className="text-lg">3️⃣</span>
                  <div className="text-xs">
                    <p className="font-semibold text-textPrimary">Mandatory Hydration & Stretch</p>
                    <p className="text-textSecondary mt-0.5">
                      Step away from your screen for at least 5 minutes before each task.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={() => {
                  const target = tasks.find((t) => !t.completed && t.dueDate <= todayISO());
                  if (target) {
                    rescheduleTask(target.id, 'deferLower');
                    setActiveTab('chat');
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        sender: 'ai',
                        text: '✓ Deferred your lowest-priority task to tomorrow. Your workload has been reduced.',
                      },
                    ]);
                  }
                }}
              >
                Apply Relief Plan (Defer Lowest Priority)
              </Button>
            </div>
          ) : activeTab === 'breakdown' ? (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-textPrimary">Select a task to break down:</h3>
              {pendingTasks.length === 0 ? (
                <p className="text-xs text-textSecondary">No active tasks available to break down.</p>
              ) : (
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-textPrimary">{task.title}</p>
                        <p className="text-[10px] text-textSecondary">{task.durationMinutes}m • {task.subject}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        onClick={() => {
                          closeAIDrawer();
                          openModal('taskBreakdown', task.id);
                        }}
                      >
                        Break Down
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'overdue' ? (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-textPrimary">Unfinished / Overdue Tasks</h3>
              {overdueTasks.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-background border border-border">
                  <p className="text-xs text-textSecondary">All caught up! No overdue tasks pending 🎉</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {overdueTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-textPrimary">{task.title}</p>
                        <p className="text-[10px] text-accentRose">Due: {task.dueDate}</p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          updateTaskSchedule(task.id, '09:00');
                          setChatMessages((prev) => [
                            ...prev,
                            {
                              sender: 'ai',
                              text: `Scheduled "${task.title}" for 09:00 today.`,
                            },
                          ]);
                        }}
                      >
                        Add to Schedule
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Default Chat conversation view
            <div className="space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-background border border-border text-textPrimary rounded-bl-none shadow-subtle'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.actionTab && (
                    <button
                      onClick={() => setActiveTab(msg.actionTab!)}
                      className="mt-1 text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Input Footer */}
        <form onSubmit={handleSendText} className="p-4 border-t border-border/80 bg-background/50 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about planning, focus, or schedule..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-border bg-card text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
