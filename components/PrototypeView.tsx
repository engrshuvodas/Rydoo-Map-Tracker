
import React, { useState, useEffect, useRef } from 'react';
import { Rider } from '../types';

// Real world coordinates (Amsterdam City Center)
const AMSTERDAM = { lat: 52.3676, lng: 4.9041 };

const INITIAL_RIDERS: Rider[] = [
  { id: '1', name: 'Alex (Leader)', lat: 52.3676, lng: 4.9041, color: '#6366f1', distanceFromLeader: 0 },
  { id: '2', name: 'Jordan', lat: 52.3660, lng: 4.9030, color: '#f43f5e', distanceFromLeader: 240 },
  { id: '3', name: 'Casey', lat: 52.3690, lng: 4.9010, color: '#10b981', distanceFromLeader: 850 },
  { id: '4', name: 'Taylor', lat: 52.3650, lng: 4.9060, color: '#f59e0b', distanceFromLeader: 1200 },
];

const PrototypeView: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>(INITIAL_RIDERS);
  const [isRiding, setIsRiding] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');
  const [rideCode] = useState('RX-7721');
  const [showMembers, setShowMembers] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isLeader] = useState(true);

  const mapRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  // Initialize Real Map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // @ts-ignore
    mapInstance.current = L.map(mapRef.current, {
      center: [AMSTERDAM.lat, AMSTERDAM.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // @ts-ignore
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Sync Markers with Map
  useEffect(() => {
    if (!mapInstance.current) return;

    riders.forEach(rider => {
      if (!markersRef.current[rider.id]) {
        // Create new marker
        // @ts-ignore
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${rider.color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${rider.color}88;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        // @ts-ignore
        markersRef.current[rider.id] = L.marker([rider.lat, rider.lng], { icon }).addTo(mapInstance.current);
      } else {
        // Update position
        markersRef.current[rider.id].setLatLng([rider.lat, rider.lng]);
      }
    });

    // Handle removals
    Object.keys(markersRef.current).forEach(id => {
      if (!riders.find(r => r.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [riders]);

  // Movement Simulation
  useEffect(() => {
    if (!isRiding) return;
    const interval = setInterval(() => {
      setRiders(prev => {
        const leader = prev.find(l => l.id === '1') || prev[0];
        return prev.map(r => {
          // Subtle movement
          const dLat = (Math.random() - 0.5) * 0.0005;
          const dLng = (Math.random() - 0.5) * 0.0005;
          const newLat = r.lat + dLat;
          const newLng = r.lng + dLng;
          
          // Rough distance calculation
          const dist = Math.sqrt(Math.pow(leader.lat - newLat, 2) + Math.pow(leader.lng - newLng, 2)) * 111000;
          return { ...r, lat: newLat, lng: newLng, distanceFromLeader: Math.round(dist) };
        });
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isRiding]);

  const handleStartRide = () => {
    setIsRiding(true);
    setShowStartModal(false);
    if (mapInstance.current) {
      mapInstance.current.setView([AMSTERDAM.lat, AMSTERDAM.lng], 16);
    }
  };

  const removeMember = (id: string) => {
    setRiders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Platform Toggle */}
      <div className="flex bg-white/5 p-1 rounded-full mb-6 z-50 border border-white/5 shadow-2xl">
        <button onClick={() => setPlatform('android')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${platform === 'android' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>
          <i className="fab fa-android mr-2"></i> Android
        </button>
        <button onClick={() => setPlatform('ios')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${platform === 'ios' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}>
          <i className="fab fa-apple mr-2"></i> iOS
        </button>
      </div>

      {/* Phone Body */}
      <div className={`relative w-[340px] h-[680px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 ${platform === 'ios' ? 'rounded-[55px]' : 'rounded-[40px]'}`}>
        
        {/* Notch Area */}
        <div className="absolute top-0 left-0 right-0 h-10 z-[100] flex items-center justify-between px-8 text-white text-[10px] font-black">
          <span>12:00</span>
          <div className="flex gap-1.5 items-center">
            <i className="fas fa-signal"></i>
            <i className="fas fa-wifi"></i>
            <div className="w-5 h-2.5 border border-white/30 rounded-[2px] relative flex items-center px-[2px]">
              <div className="h-1.5 bg-emerald-400 rounded-[1px] w-[80%]"></div>
            </div>
          </div>
        </div>

        {platform === 'ios' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[101]"></div>
        )}

        {/* App Content */}
        <div className="absolute inset-0 bg-slate-950 flex flex-col">
          
          {/* REAL MAP CONTAINER */}
          <div ref={mapRef} className="absolute inset-0 z-0" />

          {/* ACTIVE RIDE HEADER */}
          {isRiding && (
            <div className="absolute top-12 left-4 right-4 z-[110] flex items-center justify-between bg-indigo-600 p-3 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/50 font-black uppercase">Session ID</span>
                <span className="text-sm font-black text-white">{rideCode}</span>
              </div>
              <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white flex items-center gap-2">
                <i className="fas fa-plus"></i> Invite
              </button>
            </div>
          )}

          {/* SEARCH BAR (PRE-RIDE) */}
          {!isRiding && (
            <div className="absolute top-14 left-4 right-4 z-[50]">
              <div className="p-1.5 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl flex items-center shadow-2xl">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mr-3">
                   <i className="fas fa-search text-xs"></i>
                 </div>
                 <input 
                  placeholder="Find a cycling route..." 
                  className="bg-transparent border-none text-white text-xs font-bold outline-none flex-1 placeholder:text-white/20"
                 />
              </div>
            </div>
          )}

          {/* SIDE CONTROLS */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
            <button 
              onClick={() => setShowMembers(true)} 
              className="w-11 h-11 rounded-2xl bg-white text-indigo-600 shadow-2xl flex items-center justify-center border border-slate-200 active:scale-90 transition-transform"
            >
              <i className="fas fa-users text-sm"></i>
            </button>
            <button className="w-11 h-11 rounded-2xl bg-slate-900/90 text-white border border-white/10 shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
              <i className="fas fa-location-arrow text-sm"></i>
            </button>
          </div>

          {/* BOTTOM DASHBOARD */}
          <div className="absolute bottom-10 left-6 right-6 flex flex-col gap-4 z-[50]">
             {isRiding && (
               <div className="grid grid-cols-2 gap-2 animate-slide-up">
                  <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl">
                    <div className="text-[8px] text-white/40 uppercase font-black">Group Spread</div>
                    <div className="text-sm font-black text-white">{Math.max(...riders.map(r => r.distanceFromLeader))} <span className="text-[8px] text-indigo-400">meters</span></div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl">
                    <div className="text-[8px] text-white/40 uppercase font-black">Status</div>
                    <div className="text-sm font-black text-emerald-400">Live <i className="fas fa-circle text-[6px] animate-pulse ml-1"></i></div>
                  </div>
               </div>
             )}
             
             <button 
                onClick={() => isRiding ? setIsRiding(false) : setShowStartModal(true)}
                className={`w-full py-5 rounded-[24px] font-black text-white tracking-widest text-[11px] uppercase shadow-2xl transition-all active:scale-95 ${
                  isRiding ? 'bg-rose-500 shadow-rose-500/20' : 'bg-indigo-600 shadow-indigo-600/40'
                }`}
             >
               <i className={`fas ${isRiding ? 'fa-stop-circle' : 'fa-play-circle'} mr-2 text-lg align-middle`}></i>
               {isRiding ? 'Finish Ride' : 'Start Ride Session'}
             </button>
          </div>

          {/* MEMBER LIST DRAWER */}
          {showMembers && (
            <div className="absolute inset-0 z-[150] flex flex-col">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setShowMembers(false)}></div>
              <div className="mt-auto w-full h-[70%] bg-white rounded-t-[40px] p-8 shadow-2xl z-[151] animate-slide-up flex flex-col">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 shrink-0"></div>
                <div className="flex items-center justify-between mb-8 shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Group Members</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{riders.length} Active Riders</p>
                  </div>
                  <button onClick={() => setShowMembers(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <i className="fas fa-times text-lg"></i>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pb-10 pr-2 custom-scrollbar">
                  {riders.map(rider => (
                    <div key={rider.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: rider.color, boxShadow: `0 8px 20px -5px ${rider.color}88` }}>
                          {rider.name[0]}
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900">{rider.name}</div>
                          <div className={`text-[10px] font-black uppercase tracking-tight mt-0.5 ${rider.id === '1' ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {rider.id === '1' ? 'Ride Commander' : `${rider.distanceFromLeader}m behind leader`}
                          </div>
                        </div>
                      </div>
                      {isLeader && rider.id !== '1' && (
                        <button onClick={() => removeMember(rider.id)} className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white group">
                          <i className="fas fa-user-minus group-hover:scale-110"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* START RIDE MODAL */}
          {showStartModal && (
            <div className="absolute inset-0 z-[200] flex items-end">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowStartModal(false)}></div>
              <div className="w-full bg-[#151719] rounded-t-[44px] p-10 pb-16 border-t border-white/10 shadow-2xl animate-slide-up">
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
                <h3 className="text-white text-3xl font-black mb-3">Initialize Ride</h3>
                <p className="text-white/40 text-[11px] mb-10 uppercase tracking-[0.25em] font-bold">Synchronizing GPS Satellites...</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleStartRide} 
                    className="w-full p-8 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-white font-black flex items-center justify-between shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5 text-left">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner"><i className="fas fa-plus-circle text-2xl"></i></div>
                      <div>
                        <div className="text-lg">Create New Group</div>
                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Ride Leader Mode</div>
                      </div>
                    </div>
                    <i className="fas fa-arrow-right text-white/30"></i>
                  </button>

                  <button className="w-full p-8 bg-white/5 hover:bg-white/10 rounded-[32px] text-white font-black flex items-center justify-between border border-white/5 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-5 text-left opacity-30">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center"><i className="fas fa-link text-2xl"></i></div>
                      <div>
                        <div className="text-lg">Join Existing Ride</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider">Enter 6-Digit Code</div>
                      </div>
                    </div>
                    <i className="fas fa-lock text-white/10"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">
            Live Map Engine • v2.4 Native Bridge
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PrototypeView;
