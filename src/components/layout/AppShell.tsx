import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';
import { AIFloatingButton } from '../ai/AIFloatingButton';
import { AIDrawer } from '../ai/AIDrawer';
import { QuickAddModal } from '../tasks/QuickAddModal';
import { EditTaskModal } from '../tasks/EditTaskModal';
import { TaskBreakdownModal } from '../tasks/TaskBreakdownModal';
import { RescheduleModal } from '../tasks/RescheduleModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col md:flex-row antialiased">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-20 md:pb-8">
        <TopBar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* AI Assistant Floating Button & Drawer */}
      <AIFloatingButton />
      <AIDrawer />

      {/* Global Modals */}
      <QuickAddModal />
      <EditTaskModal />
      <TaskBreakdownModal />
      <RescheduleModal />
    </div>
  );
};
