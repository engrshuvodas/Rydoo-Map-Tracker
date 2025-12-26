
import React, { useState } from 'react';
import { ViewMode, DocSection } from './types';
import PrototypeView from './components/PrototypeView';
import DocumentationView from './components/DocumentationView';
import Header from './components/Header';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DOCUMENTATION);
  const [activeDocSection, setActiveDocSection] = useState<DocSection>(DocSection.IOS_SWIFT); 

  return (
    <div className="h-screen flex flex-col font-sans bg-slate-950 overflow-hidden text-slate-100">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      <main className="flex-1 relative overflow-hidden">
        {viewMode === ViewMode.PROTOTYPE ? (
          <PrototypeView />
        ) : (
          <div className="h-full overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <nav className="lg:col-span-1 space-y-2 lg:sticky lg:top-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Flutter Cross-Platform Code</div>
                {[
                  { id: DocSection.IOS_SWIFT, label: 'UI (screens/widgets)', icon: 'fa-layer-group', color: 'text-sky-400' },
                  { id: DocSection.ANDROID_KOTLIN, label: 'Services (Provider)', icon: 'fa-gears', color: 'text-emerald-400' },
                  { id: DocSection.FIREBASE_SCHEMA, label: 'Data Model (Dart)', icon: 'fa-database', color: 'text-orange-400' },
                  { id: DocSection.BACKGROUND_LOGIC, label: 'Build Instructions', icon: 'fa-terminal', color: 'text-blue-400' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDocSection(item.id)}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-4 ${
                      activeDocSection === item.id 
                        ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] scale-105' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <i className={`fas ${item.icon} w-6 text-center ${activeDocSection === item.id ? 'text-white' : item.color}`}></i>
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Content Area */}
              <div className="lg:col-span-3 bg-slate-900/50 rounded-3xl shadow-2xl border border-white/5 p-6 md:p-10 overflow-hidden min-h-[700px]">
                <DocumentationView section={activeDocSection} />
              </div>
            </div>
          </div>
        )}
      </main>

      {viewMode === ViewMode.DOCUMENTATION && (
        <footer className="bg-slate-950 border-t border-white/5 py-4 px-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest hidden md:block">
          Rydoo Native Migration • Single Flutter Codebase
        </footer>
      )}
    </div>
  );
};

export default App;
