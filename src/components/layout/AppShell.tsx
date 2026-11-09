import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { ObservatoryBackdrop } from '../common/ObservatoryBackdrop';
import { ContextualAssistant } from '../assistant/ContextualAssistant';

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-midnight text-slate-100 overflow-hidden relative font-sans">
      <ObservatoryBackdrop intensity="subtle" />

      {/* Desktop Persistent Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopHeader onToggleMobileMenu={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Global Contextual Pedagogical Assistant */}
        <ContextualAssistant />
      </div>
    </div>
  );
};
