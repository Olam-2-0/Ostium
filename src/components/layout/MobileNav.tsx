import React from 'react';
import { LayoutDashboard, CalendarDays, Timer, HeartPulse, BarChart3 } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import type { View } from '../../types';

interface NavItem {
  id: View;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'planner', label: 'Planner', icon: CalendarDays },
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'wellness', label: 'Wellness', icon: HeartPulse },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export const MobileNav: React.FC = () => {
  const { currentView, setView } = useMindVibe();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-2 py-2 flex items-center justify-around shadow-modal safe-area-bottom">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                isActive ? 'bg-primary/10 text-primary' : 'text-textSecondary'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
