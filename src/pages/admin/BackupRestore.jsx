import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Download, Upload, ShieldCheck, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BackupRestore() {
  const { exportBackupJSON, importBackupJSON, products, categories } = useStore();
  const [importStatus, setImportStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        const success = await importBackupJSON(text);
        if (success) {
          setImportStatus('Backup restored successfully! All products and configurations are up to date.');
          setTimeout(() => setImportStatus(''), 4000);
        }
      } catch (err) {
        alert('Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-forest-800 pb-6">
        <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
          <Database className="w-4 h-4" />
          <span>Disaster Recovery & Data Protection</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-ivory-50 mt-1">
          Backup & Restore Suite
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          Export full database snapshot files containing all product records, categories, video banners, and settings.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Backup */}
        <div className="bg-forest-900 border border-gold-900/40 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-forest-950 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-ivory-50 text-xl">
              Export Full Database Backup
            </h3>
            <p className="text-stone-400 text-xs mt-2 leading-relaxed">
              Creates a timestamped JSON snapshot containing all {products.length} organic products, {categories.length} categories, Cloudinary media URLs, and store settings.
            </p>
          </div>

          <button
            onClick={exportBackupJSON}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-luxury-gold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Snapshot (.JSON)</span>
          </button>
        </div>

        {/* Restore Backup */}
        <div className="bg-forest-900 border border-gold-900/40 rounded-3xl p-8 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-forest-950 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-ivory-50 text-xl">
              Restore From Snapshot File
            </h3>
            <p className="text-stone-400 text-xs mt-2 leading-relaxed">
              Upload an authorized backup JSON file to restore products, categories, video banner configurations, and store settings.
            </p>
          </div>

          <label className="cursor-pointer w-full bg-forest-950 hover:bg-forest-800 border-2 border-dashed border-gold-500/40 text-gold-300 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all">
            <Upload className="w-4 h-4" />
            <span>Select JSON Backup File to Restore</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
