
export enum Role {
  MEMBER = 'MEMBER',
  CAPTAIN = 'CAPTAIN',
  VICE = 'VICE'
}

export type PTColor = 'yellow' | 'white' | 'black' | 'red' | 'cyan' | 'green';
export type WarType = 'WoC' | 'WoE' | 'Other';

export interface Player {
  id: string;
  name: string;
  className: string;
  role: Role;
}

export interface PT {
  id: string;
  name: string;
  color: PTColor;
  players: Player[];
}

export type RewardType = 'BCC' | 'CODE';

export interface Reward {
  id: string;
  playerName: string;
  type: RewardType;
  value: string;
  date: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  description: string;
  warType: WarType;
  presentPlayers: string[]; // Array of player names
}

export const PT_COLORS: Record<PTColor, { bg: string; text: string; border: string }> = {
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
  white: { bg: 'bg-slate-100', text: 'text-slate-100', border: 'border-slate-100' },
  black: { bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-800' },
  red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500' },
  green: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
};
