import React from 'react';
import type { CheckIn } from '../../types';
import { getLastNDaysISO, parseISODate, isSameDay } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';

const MOOD_SCORES: Record<string, number> = {
  Good: 4,
  Okay: 3,
  Stressed: 2,
  Overwhelmed: 1,
};

const MOOD_LABELS: Record<number, { label: string; emoji: string }> = {
  4: { label: 'Good', emoji: '😊' },
  3: { label: 'Okay', emoji: '😐' },
  2: { label: 'Stressed', emoji: '😓' },
  1: { label: 'Overwhelmed', emoji: '😫' },
};

interface MoodChartProps {
  checkIns: CheckIn[];
}

export const MoodChart: React.FC<MoodChartProps> = ({ checkIns }) => {
  const last7Days = getLastNDaysISO(7);

  // Filter checkins within the last 7 days
  const recentCheckIns = checkIns.filter((ci) =>
    last7Days.some((d) => isSameDay(d, ci.date))
  );

  if (recentCheckIns.length < 2) {
    return (
      <EmptyState
        emoji="📈"
        title="Check in daily to see your mood trends."
        description="Log at least 2 daily check-ins to reveal your emotional patterns."
      />
    );
  }

  // Build 7-day data points (with nulls for gaps)
  const chartPoints = last7Days.map((dateStr) => {
    const d = parseISODate(dateStr);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const match = checkIns.find((c) => isSameDay(c.date, dateStr));
    const score = match ? MOOD_SCORES[match.mood] : null;
    return {
      date: dateStr,
      dayLabel,
      score,
      mood: match?.mood,
    };
  });

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  // Coordinate mapping: score 1 -> bottom, score 4 -> top
  const getX = (index: number) => paddingX + (index / (chartPoints.length - 1)) * plotWidth;
  const getY = (score: number) => paddingY + plotHeight - ((score - 1) / 3) * plotHeight;

  // Build polyline segments only between adjacent non-null days
  const segments: string[] = [];
  let currentSegment: { x: number; y: number }[] = [];

  chartPoints.forEach((pt, i) => {
    if (pt.score !== null) {
      currentSegment.push({ x: getX(i), y: getY(pt.score) });
    } else {
      if (currentSegment.length > 1) {
        segments.push(currentSegment.map((p) => `${p.x},${p.y}`).join(' '));
      }
      currentSegment = [];
    }
  });
  if (currentSegment.length > 1) {
    segments.push(currentSegment.map((p) => `${p.x},${p.y}`).join(' '));
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-textPrimary tracking-tight">Mood & Capacity History</h3>
          <p className="text-xs text-textSecondary">7-day trend with gap awareness</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-textSecondary font-medium">
          <span className="flex items-center gap-1">😊 Good</span>
          <span className="flex items-center gap-1">😓 Stressed</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-56 select-none overflow-visible"
        >
          {/* Horizontal gridlines for scores 1 to 4 */}
          {[1, 2, 3, 4].map((score) => {
            const y = getY(score);
            return (
              <g key={score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E8E8EF"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-textSecondary text-[10px] font-sans"
                >
                  {MOOD_LABELS[score].emoji}
                </text>
              </g>
            );
          })}

          {/* Polyline segments */}
          {segments.map((seg, idx) => (
            <polyline
              key={idx}
              points={seg}
              fill="none"
              stroke="#6366F1"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Data Points and Day labels */}
          {chartPoints.map((pt, i) => {
            const x = getX(i);
            return (
              <g key={pt.date}>
                {/* X axis Day Label */}
                <text
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  className="fill-textSecondary text-[11px] font-medium font-sans"
                >
                  {pt.dayLabel}
                </text>

                {/* Point dot if present */}
                {pt.score !== null ? (
                  <g>
                    <circle
                      cx={x}
                      cy={getY(pt.score)}
                      r={5}
                      fill="#FFFFFF"
                      stroke="#6366F1"
                      strokeWidth={3}
                    />
                    <circle
                      cx={x}
                      cy={getY(pt.score)}
                      r={2}
                      fill="#6366F1"
                    />
                  </g>
                ) : (
                  /* Gap indicator */
                  <circle
                    cx={x}
                    cy={paddingY + plotHeight / 2}
                    r={2}
                    fill="#CBD5E1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
