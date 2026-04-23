'use client';

import { UserRow } from "./UserRow";

interface Visit {
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
}



interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  visits?: Visit[];
}

export default function AdminUserList({ users, currentUserId }: { users: User[], currentUserId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-[14px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
            <th className="px-8 py-4">ユーザー名</th>
            <th className="px-8 py-4 text-center">状態</th>
            <th className="px-8 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user) => (
            <UserRow 
              key={user.id} 
              user={user} 
              isSelf={user.id === currentUserId} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}