import React from 'react';
import ProfileCard from '../cards/ProfileCard';
import GreetingHeader from '../cards/GreetingHeader';
import ClockCard from '../cards/ClockCard';
import InboxList from '../cards/InboxList';
import KPIWidgets from '../cards/KPIWidgets';

export default function TabOverview() {
  return (
    <div className="grid grid-cols-12 gap-6 pb-12">
      {/* Metrics Row */}
      <div className="col-span-12 lg:col-span-3">
        <ProfileCard />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <GreetingHeader />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <ClockCard />
      </div>

      {/* KPI & Inbox Row */}
      <div className="col-span-12 lg:col-span-7">
        <KPIWidgets />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <InboxList />
      </div>
    </div>
  );
}
