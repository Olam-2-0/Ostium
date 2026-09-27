import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Droplets, Footprints, Wind, Dumbbell } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import { Button } from '../common/Button';
import confetti from 'canvas-confetti';

const PRESETS = [15, 25, 45, 60];

const WELLNESS_SUGGESTIONS = [
  { text: 'Drink water', icon: Droplets, desc: 'Hydrate your brain for optimal recall.' },
  { text: 'Stretch', icon: Dumbbell, desc: 'Release tension in your neck and shoulders.' },
  { text: 'Walk', icon: Footprints, desc: 'Step away from the screen for 5 minutes.' },
  { text: 'Deep breaths', icon: Wind, desc: 'Box breathing: 4s inhale, 4s hold, 4s exhale.' },
];

export const FocusTimer: React.FC = () => {
  const { tasks, addFocusSession, demoMode } = useMindVibe();

  const [presetMinutes, setPresetMinutes] = useState<number>(25);
  const [customInput, setCustomInput] = useState<string>('25');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  
  // Timer State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [completedMinutesRecorded, setCompletedMinutesRecorded] = useState<number>(0);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);

  // Timestamp references to prevent drift
  const startTimeRef = useRef<number | null>(null);
  const expectedEndRef = useRef<number | null>(null);
  const pauseRemainingRef = useRef<number>(25 * 60);

  // Pick 3 random wellness suggestions deterministically for completion screen
  const suggestions = useMemo(() => {
    return WELLNESS_SUGGESTIONS.slice(0, 3);
  }, []);

  const activePendingTasks = useMemo(() => {
    return tasks.filter((t) => !t.completed);
  }, [tasks]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Reset or pause timer when demoMode switches
  useEffect(() => {
    setIsRunning(false);
  }, [demoMode]);

  // Main timestamp-based timer loop
  useEffect(() => {
    let intervalId: any = null;

    if (isRunning) {
      if (!expectedEndRef.current) {
        startTimeRef.current = Date.now();
        expectedEndRef.current = Date.now() + pauseRemainingRef.current * 1000;
      }

      intervalId = setInterval(() => {
        const now = Date.now();
        const diffMs = expectedEndRef.current! - now;
        const diffSecs = Math.max(0, Math.ceil(diffMs / 1000));

        setRemainingSeconds(diffSecs);
        pauseRemainingRef.current = diffSecs;

        if (diffSecs <= 0) {
          clearInterval(intervalId);
          setIsRunning(false);
          expectedEndRef.current = null;
          handleFinishSession();
        }
      }, 250);
    } else {
      expectedEndRef.current = null;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (sessionCompleted) {
      setSessionCompleted(false);
    }
    setHasRecorded(false);
    pauseRemainingRef.current = remainingSeconds;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    expectedEndRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    expectedEndRef.current = null;
    const initialSecs = presetMinutes * 60;
    setRemainingSeconds(initialSecs);
    pauseRemainingRef.current = initialSecs;
    setSessionCompleted(false);
    setHasRecorded(false);
  };

  const handleFinishSession = () => {
    if (hasRecorded) return; // Prevent duplicate recording
    setHasRecorded(true);

    const focusedMinutes = presetMinutes;
    setCompletedMinutesRecorded(focusedMinutes);
    addFocusSession(focusedMinutes, selectedTask ? selectedTask.title : null);

    setSessionCompleted(true);
    setIsRunning(false);
    expectedEndRef.current = null;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  const handleSelectPreset = (mins: number) => {
    setIsRunning(false);
    expectedEndRef.current = null;
    setPresetMinutes(mins);
    setCustomInput(mins.toString());
    const secs = mins * 60;
    setRemainingSeconds(secs);
    pauseRemainingRef.current = secs;
    setSessionCompleted(false);
    setHasRecorded(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 120) {
      setIsRunning(false);
      expectedEndRef.current = null;
      setPresetMinutes(num);
      const secs = num * 60;
      setRemainingSeconds(secs);
      pauseRemainingRef.current = secs;
      setSessionCompleted(false);
      setHasRecorded(false);
    }
  };

  // Format mm:ss
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // SVG Circular progress
  const totalSeconds = presetMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {sessionCompleted ? (
        <div className="bg-card rounded-3xl border border-border p-8 text-center shadow-card animate-fade-in space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-accentGreen/15 text-accentGreen flex items-center justify-center mx-auto text-3xl">
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-bold text-textPrimary tracking-tight">Focus session complete.</h2>
            <p className="text-base text-primary font-semibold mt-1">
              {completedMinutesRecorded} minutes focused!
            </p>
            {selectedTask && (
              <p className="text-xs text-textSecondary mt-1">
                Linked to: <strong className="text-textPrimary">{selectedTask.title}</strong>
              </p>
            )}
          </div>

          {/* Three Wellness Suggestions */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3">
              Recommended Wellness Reset
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-border bg-background text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-textPrimary">{item.text}</span>
                    </div>
                    <p className="text-[11px] text-textSecondary leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button variant="primary" size="lg" onClick={handleReset}>
              Start Another Session
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-3xl border border-border p-6 sm:p-10 shadow-card flex flex-col items-center">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => handleSelectPreset(m)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  presetMinutes === m && customInput === m.toString()
                    ? 'bg-primary text-white shadow-card shadow-primary/20'
                    : 'bg-background border border-border text-textSecondary hover:text-textPrimary hover:bg-black/5'
                }`}
              >
                {m}m
              </button>
            ))}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs text-textSecondary font-medium">Custom:</span>
              <input
                type="number"
                min="1"
                max="120"
                value={customInput}
                onChange={handleCustomChange}
                className="w-16 px-2.5 py-1.5 text-xs text-center rounded-xl border border-border bg-background text-textPrimary font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <span className="text-xs text-textSecondary">min</span>
            </div>
          </div>

          {/* Optional Task Selector */}
          <div className="w-full max-w-sm mb-6">
            <label className="block text-center text-xs font-medium text-textSecondary mb-1.5">
              Focusing on (optional):
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">No specific assignment</option>
              {activePendingTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.durationMinutes}m) - {t.subject}
                </option>
              ))}
            </select>
          </div>

          {/* Large Circular SVG Timer */}
          <div className="relative my-4 flex items-center justify-center">
            <svg width={300} height={300} className="transform -rotate-90">
              <circle
                cx={150}
                cy={150}
                r={radius}
                stroke="#E8E8EF"
                strokeWidth={12}
                fill="none"
              />
              <circle
                cx={150}
                cy={150}
                r={radius}
                stroke="#6366F1"
                strokeWidth={12}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-linear"
              />
            </svg>

            {/* Time readout in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-textPrimary">
                {timeFormatted}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-textSecondary mt-2">
                {isRunning ? 'Flow State Active' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {!isRunning ? (
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="w-5 h-5 fill-current" />}
                onClick={handleStart}
              >
                Start Focus
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                icon={<Pause className="w-5 h-5 fill-current" />}
                onClick={handlePause}
              >
                Pause
              </Button>
            )}

            <Button
              variant="secondary"
              size="lg"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon={<CheckCircle2 className="w-4 h-4 text-accentGreen" />}
              onClick={handleFinishSession}
              disabled={hasRecorded}
            >
              Complete Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
