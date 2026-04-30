import React from 'react';
import { motion } from 'framer-motion';
import ProfileCard from './cards/ProfileCard';
import GreetingHeader from './cards/GreetingHeader';
import ClockCard from './cards/ClockCard';
import CalendarCard from './cards/CalendarCard';
import AgendaList from './cards/AgendaList';
import InboxList from './cards/InboxList';
import KPIWidgets from './cards/KPIWidgets';

export default function DashboardGrid() {
  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-12 font-sans selection:bg-accentAmber/30">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        
        {/* Top Row */}
        <div className="col-span-12 lg:col-span-3">
          <ProfileCard />
        </div>
        
        <div className="col-span-12 lg:col-span-6">
          <GreetingHeader />
        </div>
        
        <div className="col-span-12 lg:col-span-3">
          <ClockCard />
        </div>

        {/* Content Rows */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <KPIWidgets />
          <CalendarCard />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <AgendaList />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <InboxList />
        </div>

      </div>
    </div>
  );
}
