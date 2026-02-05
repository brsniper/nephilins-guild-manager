
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Shield, Trash2, Trophy, Swords, Sparkles, Loader2, 
  Search, User, X, Gift, Calendar, LayoutDashboard, Coins, Ticket, CheckCircle2, ArrowLeft,
  Zap, History, Settings, BookOpen, UserPlus2, Lock, LogOut
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PT, Player, Role, PTColor, PT_COLORS, Reward, AttendanceSession, RewardType, WarType } from './types';
import { INITIAL_DATA, INITIAL_CLASSES } from './constants';
import { PTCard } from './components/PTCard';

type Tab = 'management' | 'rewards' | 'presence';

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("admin_user"));
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem("admin_user") || "");
  const [activeTab, setActiveTab] = useState<Tab>('management');
  
  // States
  const [pts, setPts] = useState<PT[]>(() => {
    const saved = localStorage.getItem('nephilins_pts');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [classes, setClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem('nephilins_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('nephilins_rewards');
    return saved ? JSON.parse(saved) : [];
  });

  const [presence, setPresence] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('nephilins_presence');
    return saved ? JSON.parse(saved) : [];
  });

  const [guildLogo, setGuildLogo] = useState<string | null>(() => {
    return localStorage.getItem('nephilins_logo');
  });

  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isAddingPT, setIsAddingPT] = useState(false);
  const [isManagingClasses, setIsManagingClasses] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  
  const [newPTName, setNewPTName] = useState('');
  const [newPTColor, setNewPTColor] = useState<PTColor>('white');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Highlighting State
  const [selectedPTId, setSelectedPTId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Rewards Form State
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newReward, setNewReward] = useState({ playerName: '', type: 'BCC' as RewardType, value: '' });

  // Global Recruitment State
  const [isGlobalRecruiting, setIsGlobalRecruiting] = useState(false);
  const [recruitData, setRecruitData] = useState({
    name: '',
    className: '',
    ptColor: 'white' as PTColor,
    ptId: '',
    role: Role.MEMBER
  });

  // Presence Form State
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    description: '',
    warType: 'WoE' as WarType
  });

  const [playerModal, setPlayerModal] = useState<{ isOpen: boolean, ptId: string | null }>({
    isOpen: false,
    ptId: null
  });

  const [newPlayerData, setNewPlayerData] = useState({
    name: '',
    className: ''
  });

  // Local Storage Sync
  useEffect(() => localStorage.setItem('nephilins_pts', JSON.stringify(pts)), [pts]);
  useEffect(() => localStorage.setItem('nephilins_classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('nephilins_rewards', JSON.stringify(rewards)), [rewards]);
  useEffect(() => localStorage.setItem('nephilins_presence', JSON.stringify(presence)), [presence]);
  useEffect(() => { if (guildLogo) localStorage.setItem('nephilins_logo', guildLogo); }, [guildLogo]);

  useEffect(() => {
    if (classes.length > 0 && !newPlayerData.className) {
      setNewPlayerData(prev => ({ ...prev, className: classes[0] }));
    }
    if (classes.length > 0 && !recruitData.className) {
      setRecruitData(prev => ({ ...prev, className: classes[0] }));
    }
  }, [classes]);

  const allPlayerNames = useMemo(() => {
    const names = new Set<string>();
    pts.forEach(pt => pt.players.forEach(p => names.add(p.name)));
    return Array.from(names).sort();
  }, [pts]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const results: { player: Player; pt: PT }[] = [];
    pts.forEach(pt => {
      pt.players.forEach(player => {
        if (player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ player, pt });
        }
      });
    });
    return results;
  }, [pts, searchQuery]);

  // Statistics Calculation
  const wocSessions = useMemo(() => 
    presence.filter(s => s.warType === 'WoC').sort((a,b) => b.date.localeCompare(a.date)),
  [presence]);

  const woeSessions = useMemo(() => 
    presence.filter(s => s.warType === 'WoE').sort((a,b) => b.date.localeCompare(a.date)),
  [presence]);

  const latestWoc = wocSessions[0];
  const latestWoe = woeSessions[0];

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  // Handlers
  const handleSelectSearchResult = (ptId: string, playerId: string) => {
    setSelectedPTId(ptId);
    setSelectedPlayerId(playerId);
    setSearchQuery('');
    setActiveTab('management');
  };

  const clearHighlight = () => {
    setSelectedPTId(null);
    setSelectedPlayerId(null);
  };

  const generateModernLogo = async () => {
    // TODO: Implement logo generation with backend API
    console.log('Logo generation coming soon!');
  };

  const handleAddPT = () => {
    if (!isAdmin) { alert('Apenas admin pode criar unidades'); return; }
    if (!newPTName.trim()) return;
    setPts(prev => [...prev, { id: crypto.randomUUID(), name: newPTName, color: newPTColor, players: [] }]);
    setNewPTName('');
    setIsAddingPT(false);
  };

  const handleAddClass = () => {
    if (!isAdmin) { alert('Apenas admin pode gerenciar classes'); return; }
    if (!newClassName.trim()) return;
    if (classes.includes(newClassName.trim())) return;
    setClasses(prev => [...prev, newClassName.trim()].sort());
    setNewClassName('');
  };

  const removeClass = (cls: string) => {
    if (!isAdmin) { alert('Apenas admin pode remover classes'); return; }
    if (confirm(`Remover a classe ${cls}? Isso não afetará jogadores já cadastrados.`)) {
      setClasses(prev => prev.filter(c => c !== cls));
    }
  };

  const submitNewPlayer = () => {
    if (!isAdmin) { alert('Apenas admin pode adicionar jogadores'); return; }
    if (!playerModal.ptId || !newPlayerData.name.trim()) return;
    setPts(prev => prev.map(pt => {
      if (pt.id === playerModal.ptId) {
        const newPlayer: Player = {
          id: crypto.randomUUID(),
          name: newPlayerData.name.trim(),
          className: newPlayerData.className,
          role: Role.MEMBER
        };
        return { ...pt, players: [...pt.players, newPlayer] };
      }
      return pt;
    }));
    setNewPlayerData({ name: '', className: classes[0] });
    setPlayerModal({ isOpen: false, ptId: null });
  };

  const submitGlobalRecruit = () => {
    if (!recruitData.name.trim() || !recruitData.ptId) return;
    setPts(prev => prev.map(pt => {
      if (pt.id === recruitData.ptId) {
        return {
          ...pt,
          players: [...pt.players, {
            id: crypto.randomUUID(),
            name: recruitData.name.trim(),
            className: recruitData.className,
            role: recruitData.role
          }]
        };
      }
      return pt;
    }));
    setIsGlobalRecruiting(false);
    setRecruitData(prev => ({ ...prev, name: '' }));
  };

  const submitNewReward = () => {
    if (!newReward.playerName || !newReward.value) return;
    setRewards(prev => [{
      id: crypto.randomUUID(),
      ...newReward,
      date: new Date().toLocaleDateString()
    }, ...prev]);
    setIsAddingReward(false);
    setNewReward({ playerName: '', type: 'BCC', value: '' });
  };

  const submitNewSession = () => {
    setPresence(prev => [{
      id: crypto.randomUUID(),
      date: newSession.date,
      description: newSession.description,
      warType: newSession.warType,
      presentPlayers: []
    }, ...prev]);
    setIsAddingSession(false);
  };

  const toggleAttendance = (sessionId: string, playerName: string) => {
    setPresence(prev => prev.map(session => {
      if (session.id === sessionId) {
        const isPresent = session.presentPlayers.includes(playerName);
        return {
          ...session,
          presentPlayers: isPresent 
            ? session.presentPlayers.filter(p => p !== playerName)
            : [...session.presentPlayers, playerName]
        };
      }
      return session;
    }));
  };

  const resetData = () => {
    if (confirm('Deseja resetar TUDO (PTs, Prêmios e Presença)?')) {
      setPts(INITIAL_DATA);
      setRewards([]);
      setPresence([]);
      setClasses(INITIAL_CLASSES);
      setGuildLogo(null);
      clearHighlight();
      localStorage.clear();
    }
  };

  const filteredPts = selectedPTId ? pts.filter(pt => pt.id === selectedPTId) : pts;
  const recruitFilteredPTs = pts.filter(pt => pt.color === recruitData.ptColor);

  return (
    <div className="min-h-screen pb-20 bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-sky-900/30 px-4 py-3 mb-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group">
              <div className="bg-slate-800 rounded-2xl glow-cyan overflow-hidden w-14 h-14 flex items-center justify-center border border-sky-500/30 transition-all group-hover:scale-105">
                {guildLogo ? <img src={guildLogo} className="w-full h-full object-cover" /> : <Shield className="text-sky-400" size={32} />}
                {isGeneratingLogo && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-sky-400" /></div>}
              </div>
              {/* <button onClick={generateModernLogo} className="absolute -bottom-1 -right-1 bg-yellow-500 p-1.5 rounded-full border-2 border-slate-900 hover:bg-yellow-400 shadow-xl"><Sparkles size={12} /></button> */}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-white to-sky-400">NEPHILINS</h1>
              <p className="text-[10px] text-sky-500 uppercase tracking-widest font-bold">Divine Command Center</p>
            </div>
          </div>

          {/* Main Search */}
          <div className="relative w-full lg:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Localizar guerreiro..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-sm focus:ring-2 ring-sky-500 outline-none transition-all"
              />
              {searchQuery && <X className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer" onClick={() => setSearchQuery('')} size={16} />}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-sky-900/40 rounded-2xl shadow-2xl z-50 max-h-64 overflow-auto">
                {searchResults.map(({ player, pt }) => (
                  <button 
                    key={player.id} 
                    onClick={() => handleSelectSearchResult(pt.id, player.id)}
                    className="w-full text-left p-3 border-b border-slate-800 hover:bg-sky-500/10 flex justify-between items-center group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-800 ${PT_COLORS[pt.color].text}`}><User size={16} /></div>
                      <div><p className="font-bold text-sm text-white group-hover:text-sky-400">{player.name}</p><p className="text-[10px] text-slate-500">{player.className}</p></div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${PT_COLORS[pt.color].bg} ${pt.color === 'white' || pt.color === 'yellow' ? 'text-slate-900' : 'text-white'}`}>{pt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {isAdmin && <span className="text-xs text-sky-400 font-bold px-3 py-1 bg-sky-500/10 rounded-full border border-sky-500/30">Admin: {adminUser}</span>}
            {isAdmin ? (
              <button onClick={() => { localStorage.removeItem('admin_user'); setIsAdmin(false); setAdminUser(''); }} title="Logout" className="p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/50 rounded-xl border border-slate-800 transition-colors"><LogOut size={20} /></button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} title="Login Admin" className="p-2.5 text-slate-500 hover:text-sky-400 bg-slate-800/50 rounded-xl border border-slate-800 transition-colors"><Lock size={20} /></button>
            )}
            {isAdmin && <button onClick={resetData} title="Resetar Banco de Dados" className="p-2.5 text-slate-500 hover:text-red-400 bg-slate-800/50 rounded-xl border border-slate-800 transition-colors"><Trash2 size={20} /></button>}
            {isAdmin && <button onClick={() => setIsManagingClasses(true)} title="Arsenal de Classes" className="p-2.5 text-slate-500 hover:text-sky-400 bg-slate-800/50 rounded-xl border border-slate-800 transition-colors"><BookOpen size={20} /></button>}
            <div className="h-8 w-px bg-slate-800 hidden lg:block"></div>
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button 
                onClick={() => { setActiveTab('management'); clearHighlight(); }}
                className={`p-2 rounded-xl transition-all ${activeTab === 'management' && !selectedPTId ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              ><LayoutDashboard size={20}/></button>
              <button 
                onClick={() => setActiveTab('rewards')}
                className={`p-2 rounded-xl transition-all ${activeTab === 'rewards' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              ><Gift size={20}/></button>
              <button 
                onClick={() => setActiveTab('presence')}
                className={`p-2 rounded-xl transition-all ${activeTab === 'presence' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              ><Calendar size={20}/></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4">
        
        {/* Management Tab */}
        {activeTab === 'management' && (
          <div className="animate-in fade-in duration-500">
            {selectedPTId && (
              <div className="mb-6 flex items-center justify-between bg-sky-900/20 border border-sky-500/30 p-4 rounded-2xl animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-500 p-2 rounded-xl text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Foco no Guerreiro: {pts.find(pt => pt.id === selectedPTId)?.players.find(p => p.id === selectedPlayerId)?.name}</h3>
                    <p className="text-sky-500 text-xs">Visualizando PT em destaque</p>
                  </div>
                </div>
                <button 
                  onClick={clearHighlight}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700"
                >
                  <ArrowLeft size={14} /> LIMPAR FOCO
                </button>
              </div>
            )}

            {!selectedPTId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Stat Cards... (Mantive a lógica anterior) */}
                <div className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl hover:border-sky-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Parties</p>
                    <Swords size={16} className="text-sky-500" />
                  </div>
                  <p className="text-3xl font-black text-sky-500">{pts.length}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl hover:border-sky-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Guerreiros</p>
                    <Shield size={16} className="text-sky-400" />
                  </div>
                  <p className="text-3xl font-black text-sky-400">{allPlayerNames.length}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl hover:border-cyan-500/30 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Última WoC</p>
                    <Zap size={16} className="text-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-cyan-400">{latestWoc ? `${latestWoc.presentPlayers.length} / ${allPlayerNames.length}` : '0 / 0'}</p>
                    <span className="text-[10px] text-slate-500 font-bold">HERÓIS</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-slate-800 pt-2 text-[10px] text-slate-400 font-mono">
                    {latestWoc ? `DATA: ${formatDate(latestWoc.date)}` : 'SEM REGISTROS'}
                  </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl hover:border-yellow-500/30 transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Última WoE</p>
                    <Trophy size={16} className="text-yellow-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-yellow-500">{latestWoe ? `${latestWoe.presentPlayers.length} / ${allPlayerNames.length}` : '0 / 0'}</p>
                    <span className="text-[10px] text-slate-500 font-bold">HERÓIS</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-slate-800 pt-2 text-[10px] text-slate-400 font-mono">
                    {latestWoe ? `DATA: ${formatDate(latestWoe.date)}` : 'SEM REGISTROS'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Shield size={20} className="text-sky-500" />
                Legiões Ativas
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsGlobalRecruiting(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-emerald-900/20"
                >
                  <UserPlus2 size={16} /> Recrutamento Global
                </button>
                <button 
                  onClick={() => setIsAddingPT(true)}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-sky-900/20"
                >
                  <Plus size={16} /> Nova PT
                </button>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${selectedPTId ? 'lg:grid-cols-1 xl:grid-cols-1 max-w-2xl mx-auto' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
              {filteredPts.map(pt => (
                <PTCard 
                  key={pt.id} pt={pt} 
                  highlightedPlayerId={selectedPlayerId}
                  onAddPlayer={(id) => setPlayerModal({ isOpen: true, ptId: id })}
                  onDeletePT={(id) => !isAdmin ? alert('Apenas admin pode deletar PTs') : confirm('Apagar PT?') && setPts(pts.filter(p=>p.id!==id))}
                  onRemovePlayer={(ptId, pId) => {
                    if (!isAdmin) { alert('Apenas admin pode remover jogadores'); return; }
                    setPts(pts.map(p => p.id === ptId ? {...p, players: p.players.filter(x=>x.id!==pId)} : p));
                    if(pId === selectedPlayerId) clearHighlight();
                  }}
                  onUpdateRole={(ptId, pId, r) => {
                    if (!isAdmin) { alert('Apenas admin pode alterar roles'); return; }
                    setPts(pts.map(p => {
                      if (p.id !== ptId) return p;
                      return {...p, players: p.players.map(x => {
                        if (x.id === pId) return {...x, role: x.role === r ? Role.MEMBER : r};
                        if (r !== Role.MEMBER && x.role === r) return {...x, role: Role.MEMBER};
                        return x;
                      })};
                    }));
                  }}
                />
              ))}
              {!selectedPTId && (
                 <div className="hidden lg:flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-10 bg-slate-900/10">
                    <Shield size={32} className="text-slate-800 mb-4" />
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Fim das Legiões</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* Rewards and Presence Tabs... (Mantive igual) */}
        {activeTab === 'rewards' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">CÂMARA DE TESOUROS</h2>
                <p className="text-sky-500 text-sm font-medium">Distribuição de espólios e honrarias aos heróis</p>
              </div>
              <button 
                onClick={() => setIsAddingReward(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-2"
              >
                <Plus size={20} /> DISTRIBUIR PRÊMIO
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden group hover:border-yellow-500/30 transition-all p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${reward.type === 'BCC' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-sky-500/10 text-sky-500'}`}>
                      {reward.type === 'BCC' ? <Coins size={24} /> : <Ticket size={24} />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{reward.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-white mb-1">{reward.playerName}</h4>
                  <p className="text-slate-500 text-sm mb-4">Conquistou: <span className="text-white font-bold">{reward.type === 'BCC' ? `${reward.value} BCCs` : 'Código Especial'}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'presence' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">CONVOCAÇÃO DE GUERRA</h2>
                <p className="text-sky-500 text-sm font-medium">Registro histórico de presença nos campos de batalha</p>
              </div>
              <button 
                onClick={() => setIsAddingSession(true)}
                className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-sky-500/20 flex items-center gap-2 border border-sky-400/20"
              >
                <Plus size={20} /> REGISTRAR BATALHA
              </button>
            </div>
            <div className="space-y-6">
              {presence.map(session => (
                <div key={session.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="p-6 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-2xl ${session.warType === 'WoC' ? 'bg-cyan-500/10 text-cyan-400' : session.warType === 'WoE' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-800 text-slate-400'}`}>
                        {session.warType === 'WoC' ? <Zap size={24} /> : <History size={24} />}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white tracking-tight">{session.description || (session.warType === 'WoC' ? 'War of Crystals' : 'War of Emperium')}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${session.warType === 'WoC' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>
                            {session.warType}
                          </span>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{formatDate(session.date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{session.presentPlayers.length} / {allPlayerNames.length}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Presentes</p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {allPlayerNames.map(name => {
                      const isPresent = session.presentPlayers.includes(name);
                      return (
                        <button key={name} onClick={() => toggleAttendance(session.id, name)} className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all group ${isPresent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                          {isPresent ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700"></div>}
                          <span className="text-xs font-bold truncate">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ARSENAL DE CLASSES */}
      {isManagingClasses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-sky-900/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <BookOpen className="text-sky-500" />
                  Arsenal de Classes
                </h3>
                <button onClick={() => setIsManagingClasses(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)}
                  placeholder="Nome da Nova Classe (ex: Shura)"
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 ring-sky-500"
                  onKeyPress={e => e.key === 'Enter' && handleAddClass()}
                />
                <button onClick={handleAddClass} className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  Cadastrar
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex-grow bg-slate-950/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {classes.map(cls => (
                  <div key={cls} className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl group hover:border-sky-500/30 transition-all">
                    <span className="text-slate-300 font-bold text-xs">{cls}</span>
                    <button onClick={() => removeClass(cls)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECRUTAMENTO GLOBAL */}
      {isGlobalRecruiting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-emerald-900/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <UserPlus2 className="text-emerald-500" />
                  Recrutamento Global
                </h3>
                <button onClick={() => setIsGlobalRecruiting(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase block mb-2">Nome do Guerreiro</label>
                  <input type="text" value={recruitData.name} onChange={e => setRecruitData({...recruitData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-emerald-500 text-white" placeholder="Nome no Jogo"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-emerald-500 uppercase block mb-2">Classe</label>
                    <select value={recruitData.className} onChange={e => setRecruitData({...recruitData, className: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-emerald-500 text-white appearance-none">
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-500 uppercase block mb-2">Cargo Inicial</label>
                    <select value={recruitData.role} onChange={e => setRecruitData({...recruitData, role: e.target.value as Role})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-emerald-500 text-white appearance-none">
                      <option value={Role.MEMBER}>Membro</option>
                      <option value={Role.CAPTAIN}>Capitão</option>
                      <option value={Role.VICE}>Vice-Capitão</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase block mb-2">Estandarte (Cor da PT)</label>
                  <div className="grid grid-cols-6 gap-2">
                    {(Object.keys(PT_COLORS) as PTColor[]).map(c => (
                      <button key={c} onClick={() => setRecruitData({...recruitData, ptColor: c, ptId: ''})} className={`aspect-square rounded-lg border-2 ${PT_COLORS[c].bg} ${recruitData.ptColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`}></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-500 uppercase block mb-2">Selecione a PT ({recruitFilteredPTs.length})</label>
                  <select value={recruitData.ptId} onChange={e => setRecruitData({...recruitData, ptId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-emerald-500 text-white appearance-none">
                    <option value="">Escolha uma PT...</option>
                    {recruitFilteredPTs.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
                  </select>
                  {recruitFilteredPTs.length === 0 && <p className="text-[10px] text-red-500 mt-2">Não existem PTs com esta cor. Crie uma primeiro!</p>}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex gap-3">
              <button onClick={() => setIsGlobalRecruiting(false)} className="flex-1 text-slate-500 font-bold text-xs uppercase">Cancelar</button>
              <button onClick={submitGlobalRecruit} disabled={!recruitData.ptId} className="flex-1 bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs uppercase">Confirmar Entrada</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA PT */}
      {isAddingPT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-sky-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Nova Unidade</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-sky-500 uppercase block mb-2">Identificação</label>
                  <input type="text" value={newPTName} onChange={e=>setNewPTName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500 text-white" placeholder="Ex: Nephilins - Alpha"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-sky-500 uppercase block mb-2">Estandarte</label>
                  <div className="grid grid-cols-6 gap-2">
                    {(Object.keys(PT_COLORS) as PTColor[]).map(c => (
                      <button key={c} onClick={()=>setNewPTColor(c)} className={`aspect-square rounded-lg border-2 ${PT_COLORS[c].bg} ${newPTColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40'}`}></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex gap-3">
              <button onClick={()=>setIsAddingPT(false)} className="flex-1 text-slate-500 font-bold text-xs uppercase">Cancelar</button>
              <button onClick={handleAddPT} className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-bold text-xs uppercase">Criar Unidade</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR JOGADOR NA PT (CONTEXTUAL) */}
      {playerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-sky-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-black mb-6 text-white tracking-tight">Recrutar Guerreiro</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Nome</label>
                  <input type="text" value={newPlayerData.name} onChange={e=>setNewPlayerData({...newPlayerData, name:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 ring-sky-500 outline-none text-white" placeholder="Ex: Artorius"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Classe</label>
                  <select value={newPlayerData.className} onChange={e=>setNewPlayerData({...newPlayerData, className:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 ring-sky-500 outline-none text-white appearance-none">
                    {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex gap-3 border-t border-slate-800">
              <button onClick={()=>setPlayerModal({isOpen:false, ptId:null})} className="flex-1 text-slate-500 font-bold uppercase text-xs">Cancelar</button>
              <button onClick={submitNewPlayer} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase text-xs">Vincular</button>
            </div>
          </div>
        </div>
      )}

      {/* Outros Modais (Presence, Reward)... */}
       {isAddingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-yellow-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Premiar Guerreiro</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-yellow-500 uppercase block mb-2">Beneficiário</label>
                  <select 
                    value={newReward.playerName} onChange={e=>setNewReward({...newReward, playerName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 text-slate-200 appearance-none"
                  >
                    <option value="">Selecione um jogador...</option>
                    {allPlayerNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button onClick={()=>setNewReward({...newReward, type: 'BCC'})} className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs ${newReward.type === 'BCC' ? 'bg-yellow-500 text-slate-950 border-yellow-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <Coins size={16}/> BCC
                  </button>
                  <button onClick={()=>setNewReward({...newReward, type: 'CODE'})} className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs ${newReward.type === 'CODE' ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <Ticket size={16}/> CÓDIGO
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{newReward.type === 'BCC' ? 'Quantidade' : 'Código de Resgate'}</label>
                  <input 
                    type="text" value={newReward.value} onChange={e=>setNewReward({...newReward, value: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-yellow-500 text-white"
                    placeholder={newReward.type === 'BCC' ? 'Ex: 5000' : 'Ex: ABC-123-NEPH'}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex gap-3">
              <button onClick={()=>setIsAddingReward(false)} className="flex-1 text-slate-500 font-bold text-xs uppercase">Cancelar</button>
              <button onClick={submitNewReward} className="flex-1 bg-yellow-500 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase">Confirmar Prêmio</button>
            </div>
          </div>
        </div>
      )}

      {isAddingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-sky-900/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Nova Batalha</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-sky-500 uppercase block mb-2">Tipo de Guerra</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setNewSession({...newSession, warType: 'WoE'})}
                      className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${newSession.warType === 'WoE' ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      <History size={16}/> WoE
                    </button>
                    <button 
                      onClick={() => setNewSession({...newSession, warType: 'WoC'})}
                      className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${newSession.warType === 'WoC' ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      <Zap size={16}/> WoC
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-sky-500 uppercase block mb-2">Data da Guerra</label>
                  <input type="date" value={newSession.date} onChange={e=>setNewSession({...newSession, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500 text-white"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-sky-500 uppercase block mb-2">Descrição / Local</label>
                  <input type="text" value={newSession.description} onChange={e=>setNewSession({...newSession, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500 text-white" placeholder="Ex: Luina - Castelo 1"/>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex gap-3">
              <button onClick={()=>setIsAddingSession(false)} className="flex-1 text-slate-500 font-bold text-xs uppercase">Cancelar</button>
              <button onClick={submitNewSession} className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-bold text-xs uppercase">Iniciar Chamada</button>
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={(user) => setAdminUser(user)}
      />
    </div>
  );
};

// Login Component
const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (user: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'Brshrek' && password === 'Jesus321*!') {
      localStorage.setItem('admin_user', username);
      onLogin(username);
      setUsername('');
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-sky-500/50 rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold text-sky-400 mb-4">Login Administrativo</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-800 border border-sky-500/30 rounded px-3 py-2 text-white mb-3"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-800 border border-sky-500/30 rounded px-3 py-2 text-white mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleLogin} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white rounded px-4 py-2">Login</button>
          <button onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded px-4 py-2">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default App;
