import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Send, Radio, PhoneCall } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertSystemProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (id: string) => void;
  onTriggerAlertBroadcast: (title: string, location: string) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
  alerts,
  onAcknowledgeAlert,
  onTriggerAlertBroadcast
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const filteredAlerts = alerts.filter(a => filterSeverity === 'ALL' || a.severity === filterSeverity);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    onTriggerAlertBroadcast(broadcastMessage, 'All Sector Downstream Radios');
    setBroadcastMessage('');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            District Emergency Warning & Alert Dispatch System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Integrated CAP (Common Alerting Protocol) SMS, Siren, and Radio Alert Broadcast Hub
          </p>
        </div>
      </div>

      {/* Broadcast Command Console */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Broadcast Emergency Warning Directive (SMS / CAP / Siren)
        </h3>

        <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type emergency alert broadcast message for public SMS..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs transition-all shadow-lg active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>DISPATCH EMERGENCY ALERT</span>
          </button>
        </form>

        {isSent && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Emergency SMS Broadcast Dispatched to 48,000 citizens in Sector 1 & 2!
          </p>
        )}
      </div>

      {/* Filter Tabs & Alerts List */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200">Active Alert Log</h3>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'WARNING'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map(alt => (
            <div key={alt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {alt.severity}
                  </span>
                  <h4 className="font-bold text-slate-100 text-sm">{alt.title}</h4>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{alt.time}</span>
              </div>

              <p className="text-slate-300"><strong className="text-slate-400">Location:</strong> {alt.location}</p>
              <p className="text-slate-300">{alt.message}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <p className="text-amber-400 font-semibold">
                  Recommended Action: {alt.recommendedAction}
                </p>

                <button
                  onClick={() => onAcknowledgeAlert(alt.id)}
                  className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                    alt.acknowledged
                      ? 'bg-slate-900 text-slate-500 border-slate-800'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  {alt.acknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE ALERT'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
