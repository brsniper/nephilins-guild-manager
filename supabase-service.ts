import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export async function loginAdmin(username: string, password: string) {
  if (username === 'Brshrek' && password === 'Jesus321*!') {
    localStorage.setItem('admin_token', 'true');
    localStorage.setItem('admin_user', username);
    return { success: true, user: { username, isAdmin: true } };
  }
  return { success: false, error: 'Invalid credentials' };
}

export function logoutAdmin() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function isAdminLoggedIn() {
  return localStorage.getItem('admin_token') === 'true';
}

export function getAdminUser() {
  return localStorage.getItem('admin_user');
}

// PTs functions
export async function getPTs() {
  const { data, error } = await supabase
    .from('pts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function addPT(name: string, color: string) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { data, error } = await supabase
    .from('pts')
    .insert([{ name, color, created_by: getAdminUser() }])
    .select();
  return { data, error };
}

export async function deletePT(id: string) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { error } = await supabase
    .from('pts')
    .delete()
    .eq('id', id);
  return { error };
}

// Players functions
export async function getPlayers(ptId?: string) {
  let query = supabase.from('players').select('*');
  if (ptId) query = query.eq('pt_id', ptId);
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
}

export async function addPlayer(ptId: string, name: string, className: string) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { data, error } = await supabase
    .from('players')
    .insert([{ pt_id: ptId, name, class_name: className, role: 'MEMBER' }])
    .select();
  return { data, error };
}

export async function deletePlayer(id: string) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  return { error };
}

// Wars functions
export async function getWars() {
  const { data, error } = await supabase
    .from('wars')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function addWar(name: string, playerNames: string[]) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { data: warData, error: warError } = await supabase
    .from('wars')
    .insert([{ name, created_by: getAdminUser() }])
    .select();
  
  if (warError) return { error: warError };
  
  const warId = warData[0].id;
  
  // Add players to war
  const warPlayers = playerNames.map(name => ({ war_id: warId, player_name: name }));
  const { error: playersError } = await supabase
    .from('war_players')
    .insert(warPlayers);
  
  return { data: warData, error: playersError };
}

export async function deleteWar(id: string) {
  if (!isAdminLoggedIn()) return { error: 'Not authorized' };
  
  const { error } = await supabase
    .from('wars')
    .delete()
    .eq('id', id);
  return { error };
}
