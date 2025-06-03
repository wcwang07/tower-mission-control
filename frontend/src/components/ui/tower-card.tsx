import React, { useState } from 'react';

type TowerEntry = {
  device: string;
  os: string;
  app: string;
  action: string;
  meta?: {
    ip: string;
    lastSeen: string;
  };
};

type PolicyRule = {
  app: string;
  action: string;
};

type RolePolicy = {
  allow: PolicyRule[];
  deny: PolicyRule[];
};

type Props = {
  towerId: string;
  entries: TowerEntry[];
  rolePolicy?: RolePolicy;
};

function isDenied(entry: TowerEntry, policy: RolePolicy) {
  return policy.deny.some(
    rule =>
      rule.app.toLowerCase() === entry.app.toLowerCase() &&
      rule.action.toLowerCase() === entry.action.toLowerCase()
  );
}

function isAllowed(entry: TowerEntry, policy: RolePolicy) {
  return policy.allow.some(
    rule =>
      rule.app.toLowerCase() === entry.app.toLowerCase() &&
      rule.action.toLowerCase() === entry.action.toLowerCase()
  );
}

export function TowerCard({ towerId, entries, rolePolicy }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<TowerEntry | null>(null);

  const renderDetailsPanel = (entry: TowerEntry) => {
    const denied = rolePolicy && isDenied(entry, rolePolicy);
    const allowed = rolePolicy && isAllowed(entry, rolePolicy);
    return (
      <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg border-l p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Device Details</h2>
          <button className="text-red-500 font-semibold" onClick={() => setSelectedEntry(null)}>
            ✕
          </button>
        </div>
        <p><strong>Device:</strong> {entry.device}</p>
        <p><strong>OS:</strong> {entry.os}</p>
        <p><strong>App:</strong> {entry.app}</p>
        <p><strong>Action:</strong> {entry.action}</p>
        <p><strong>Status:</strong> {denied ? "❌ Denied" : allowed ? "✅ Allowed" : "❔ Unknown"}</p>
        {entry.meta && (
          <>
            <p><strong>IP:</strong> {entry.meta.ip}</p>
            <p><strong>Last Seen:</strong> {new Date(entry.meta.lastSeen).toLocaleString()}</p>
          </>
        )}
        {denied && <p className="text-sm text-red-500 mt-2">Denied by policy rule for role.</p>}
        {allowed && <p className="text-sm text-green-600 mt-2">Allowed per enterprise policy.</p>}
      </div>
    );
  };

  return (
    <div className="relative rounded-xl shadow-md p-4 bg-white mb-4">
      <h2 className="text-lg font-semibold mb-2">{towerId}</h2>
      <ul className="space-y-1">
        {entries.map((entry, idx) => {
          const denied = rolePolicy && isDenied(entry, rolePolicy);
          const allowed = rolePolicy && isAllowed(entry, rolePolicy);

          const status = denied ? "Denied" : allowed ? "Allowed" : "Unknown";

          return (
            <li key={idx} className="text-sm text-gray-800 flex justify-between items-center">
              <span>
                {entry.device} ({entry.os}) → <strong>{entry.app}</strong>: {entry.action}
                {rolePolicy && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    denied
                      ? 'bg-red-100 text-red-800'
                      : allowed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status}
                  </span>
                )}
              </span>
              <button
                onClick={() => setSelectedEntry(entry)}
                className="text-blue-600 text-xs underline ml-2"
              >
                Details
              </button>
            </li>
          );
        })}
      </ul>

      {selectedEntry && renderDetailsPanel(selectedEntry)}
    </div>
  );
}
