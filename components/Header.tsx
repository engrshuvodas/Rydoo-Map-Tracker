
import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-inner">
          <i className="fas fa-bicycle text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Rydoo</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Architecture Blueprint</p>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setViewMode(ViewMode.DOCUMENTATION)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === ViewMode.DOCUMENTATION 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <i className="fas fa-file-alt mr-2"></i> Technical Specs
        </button>
        <button
          onClick={() => setViewMode(ViewMode.PROTOTYPE)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === ViewMode.PROTOTYPE 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <i className="fas fa-mobile-alt mr-2"></i> Live Prototype
        </button>
      </div>
    </header>
  );
};

export default Header;
