import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  HeartPulse,
  BarChart3,
  RotateCcw,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';
import type { View } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

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

export const Sidebar: React.FC = () => {
  const { currentView, setView, demoMode, toggleDemoMode, replayOnboarding, logout } = useMindVibe();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border shrink-0 fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondaryIndigo flex items-center justify-center text-white shadow-card shadow-primary/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondaryIndigo bg-clip-text text-transparent">
              MindVibe
            </span>
            <p className="text-[11px] font-medium text-textSecondary tracking-wide">
              Your pace. Your balance.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-card shadow-primary/25 font-semibold'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-black/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-textSecondary'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-border/80 space-y-3 bg-background/50">
        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-subtle">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                demoMode ? 'bg-accentGreen animate-pulse' : 'bg-textSecondary/40'
              }`}
            />
            <span className="text-xs font-semibold text-textPrimary">Demo Mode</span>
          </div>
          <button
            onClick={toggleDemoMode}
            role="switch"
            aria-checked={demoMode}
            aria-label="Toggle Demo Mode"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
              demoMode ? 'bg-primary' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                demoMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Replay Onboarding */}
        <button
          onClick={replayOnboarding}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-textSecondary hover:text-textPrimary hover:bg-black/5 border border-transparent hover:border-border transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Onboarding</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-accentRose hover:bg-accentRose/10 border border-transparent hover:border-accentRose/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Log Out of MindVibe"
        subtitle="Return to landing page"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-textSecondary leading-relaxed">
            Are you sure you want to log out? Your tasks, habits, and progress will remain safely saved in localStorage.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5" />}
              onClick={() => {
                setShowLogoutConfirm(false);
                logout();
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};
