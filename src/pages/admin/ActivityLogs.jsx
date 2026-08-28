import React, { useState, useEffect } from 'react';
import { FirestoreService } from '../../firebase/firestoreService';
import { ShieldCheck, History, RefreshCw, Clock, UserCheck } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const list = await FirestoreService.getActivityLogs();
    setLogs(list);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-forest-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <History className="w-4 h-4" />
            <span>Audit & Compliance Trail</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
            Admin Activity Logs
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Real-time record of all product updates, video uploads, logins, and backup exports.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 bg-forest-900 text-gold-300 hover:text-white rounded-xl border border-forest-700"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-forest-900/80 border border-gold-900/40 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-forest-950 border-b border-forest-800 text-xs text-gold-400 font-bold uppercase tracking-wider flex justify-between">
          <span>Action / Event</span>
          <span>Timestamp</span>
        </div>

        <div className="divide-y divide-forest-800/60 max-h-[65vh] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No activity logs recorded yet in current session.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between hover:bg-forest-800/40 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-forest-950 text-gold-400 border border-gold-900/40 flex-shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-ivory-50 text-sm">{log.action}</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">{log.user}</p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <pre className="mt-1 text-[10px] font-mono bg-forest-950 p-2 rounded-lg text-gold-300/80 max-w-lg overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="text-right flex items-center space-x-1 text-stone-400 text-xs flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
