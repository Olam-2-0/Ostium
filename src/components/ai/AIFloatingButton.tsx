import React from 'react';
import { Sparkles } from 'lucide-react';
import { useMindVibe } from '../../hooks/useMindVibe';

export const AIFloatingButton: React.FC = () => {
  const { openAIDrawer, uiState } = useMindVibe();

  if (uiState.aiDrawerOpen) return null;

  return (
    <button
      onClick={openAIDrawer}
      aria-label="Open AI Assistant"
      className="fixed bottom-20 md:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-secondaryIndigo text-white font-semibold text-sm shadow-elevated hover:shadow-card hover:scale-105 active:scale-95 transition-all select-none group"
    >
      <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
      <span>✦ AI</span>
    </button>
  );
};
