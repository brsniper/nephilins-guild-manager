
import React from 'react';
import { PT, Role, PT_COLORS } from '../types';
import { Crown, ShieldAlert, Trash2, UserPlus, Sparkles } from 'lucide-react';

interface PTCardProps {
  pt: PT;
  highlightedPlayerId?: string | null;
  onRemovePlayer: (ptId: string, playerId: string) => void;
  onUpdateRole: (ptId: string, playerId: string, role: Role) => void;
  onAddPlayer: (ptId: string) => void;
  onDeletePT: (ptId: string) => void;
}

export const PTCard: React.FC<PTCardProps> = ({ 
  pt, 
  highlightedPlayerId,
  onRemovePlayer, 
  onUpdateRole, 
  onAddPlayer,
  onDeletePT
}) => {
  const colorStyles = PT_COLORS[pt.color];
  const isDark = pt.color === 'black' || pt.color === 'red';

  return (
    <div className={`rounded-3xl overflow-hidden border shadow-xl flex flex-col h-full bg-slate-900/40 transition-all duration-500 ${colorStyles.border} ${highlightedPlayerId ? 'scale-105 shadow-sky-500/10' : ''}`}>
      <div className={`p-4 font-black flex justify-between items-center ${colorStyles.bg} ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <span className="truncate uppercase tracking-tight">{pt.name}</span>
        <div className="flex gap-2">
          <button onClick={() => onAddPlayer(pt.id)} className="p-1.5 hover:bg-black/10 rounded-xl transition-colors">
            <UserPlus size={18} />
          </button>
          <button onClick={() => onDeletePT(pt.id)} className="p-1.5 hover:bg-red-500/20 rounded-xl transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-grow p-2">
        <div className="space-y-1.5">
          {pt.players.map((player) => {
            const isHighlighted = player.id === highlightedPlayerId;
            return (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-500 group border ${
                  isHighlighted 
                    ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 animate-pulse' 
                    : 'bg-slate-950/50 border-transparent hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-grow">
                  {isHighlighted && <Sparkles size={14} className="text-sky-400 flex-shrink-0" />}
                  <div className="flex flex-col min-w-0">
                    <span className={`font-black text-sm truncate ${isHighlighted ? 'text-sky-400' : 'text-slate-200'}`}>
                      {player.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{player.className}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onUpdateRole(pt.id, player.id, Role.CAPTAIN)}
                      className={`p-1.5 rounded-lg transition-colors ${player.role === Role.CAPTAIN ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-700 hover:text-yellow-400 hover:bg-yellow-400/5'}`}
                      title="Capitão"
                    >
                      <Crown size={14} />
                    </button>
                    <button 
                      onClick={() => onUpdateRole(pt.id, player.id, Role.VICE)}
                      className={`p-1.5 rounded-lg transition-colors ${player.role === Role.VICE ? 'text-orange-400 bg-orange-400/10' : 'text-slate-700 hover:text-orange-400 hover:bg-orange-400/5'}`}
                      title="Vice-Capitão"
                    >
                      <ShieldAlert size={14} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => onRemovePlayer(pt.id, player.id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {pt.players.length === 0 && (
            <div className="text-center py-8 text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">
              Unidade Vazia
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
