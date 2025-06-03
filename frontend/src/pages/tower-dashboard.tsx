import React, { useState } from 'react';
//import { towerData } from '../data/tower-data';
import { policyData } from '../data/policy-data';
import { TowerCard } from '../components/ui/tower-card';
import { useTowerStream, TowerEvent } from '../hooks/useTowerStream';

export default function TowerDashboard() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [towerData, setTowerData] = useState<Record<string, TowerEvent[]>>({});

  
  useTowerStream((event: TowerEvent) => {
    console.log("📥 Incoming Event:", event);
    setTowerData(prev => {
      const updated = { ...prev };
      if (!updated[event.towerId]) {
        updated[event.towerId] = [];
      }
      updated[event.towerId].push(event);
      return updated;
    });
  });
  
  

  const normalizedQuery = query.toLowerCase();
  const rolePolicy = policyData["enterprise-001"].roles[role];

  const filteredData = (Object.entries(towerData) as [string, TowerEvent[]][])
  .reduce((acc, [towerId, entries]) => {
    const matchedEntries = entries.filter(entry =>
      towerId.toLowerCase().includes(normalizedQuery) ||
      entry.device.toLowerCase().includes(normalizedQuery) ||
      entry.os.toLowerCase().includes(normalizedQuery) ||
      entry.app.toLowerCase().includes(normalizedQuery) ||
      entry.action.toLowerCase().includes(normalizedQuery)
    );

    if (matchedEntries.length > 0) {
      acc[towerId] = matchedEntries;
    }

    return acc;
  }, {} as Record<string, TowerEvent[]>);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Tower Dashboard</h1>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search tower, device, app, action..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border rounded-md shadow-sm w-full sm:w-2/3"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'admin' | 'employee')}
          className="p-2 border rounded-md shadow-sm w-full sm:w-1/3"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {Object.entries(filteredData).map(([towerId, entries]) => (
        <TowerCard towerId={towerId} entries={entries} rolePolicy={rolePolicy} />
      ))}

      {Object.keys(filteredData).length === 0 && (
        <p className="text-gray-500 text-sm mt-6">No matching towers or entries found.</p>
      )}
    </div>
  );
}
