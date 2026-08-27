import React from 'react';
import { Shield, ShieldAlert, Trash2, CheckCircle2, Ban } from 'lucide-react';
import { User } from '../../types';
import { Badge } from '../common/Badge';

interface UserTableProps {
  users: User[];
  onToggleSuspend: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onToggleSuspend,
  onDeleteUser
}) => {
  return (
    <div className="rounded-2xl bg-[#12121B] border border-white/10 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-white text-base">Registered Platform Accounts</h3>
          <p className="text-xs text-text-muted">Manage subscriber accounts, security status, and profiles</p>
        </div>
        <span className="text-xs font-mono font-bold text-brand-amber bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          {users.length} Active Accounts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-text-muted font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Subscriber</th>
              <th className="px-5 py-3.5">Plan Tier</th>
              <th className="px-5 py-3.5">Profiles</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Joined</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => {
              const isSuspended = user.status === 'suspended';
              const isAdmin = user.role === 'admin';

              return (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-amber flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{user.name}</span>
                          {isAdmin && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-amber-500/30">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-text-muted text-xs">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="capitalize font-semibold text-white">
                      {user.subscriptionPlanId.replace('plan-', '')}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center -space-x-2">
                      {user.profiles.map(p => (
                        <img
                          key={p.id}
                          src={p.avatarUrl}
                          alt={p.name}
                          title={p.name}
                          className="w-6 h-6 rounded-full object-cover border-2 border-[#12121B]"
                        />
                      ))}
                      <span className="text-[11px] text-text-muted pl-3">
                        ({user.profiles.length})
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {isSuspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        <ShieldAlert className="w-3 h-3" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 font-mono text-text-muted text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isAdmin && (
                        <button
                          onClick={() => onToggleSuspend(user.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSuspended
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                          }`}
                          title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                        >
                          {isSuspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      )}

                      {!isAdmin && (
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
