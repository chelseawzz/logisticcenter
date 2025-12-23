import { useState } from 'react';
import type { User, Page } from '../App';
import { Button } from '../components/ui/button';
import { LogOut, User as UserIcon, Home, Calendar, Package, RotateCcw, CheckSquare, Settings, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage} from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

interface SidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}


export function Sidebar({ user, currentPage, onNavigate, onLogout }: SidebarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'mahasiswa':
        return 'bg-[#147EFB] text-white border-[#147EFB]';
      case 'dosen':
        return 'bg-[#4CAF50] text-white border-[#4CAF50]';
      case 'staff':
        return 'bg-[#F4A100] text-white border-[#F4A100]';
      case 'verifikator':
        return 'bg-[#B3202A] text-white border-[#B3202A]';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'mahasiswa':
        return 'MAHASISWA';
      case 'dosen':
        return 'DOSEN';
      case 'staff':
        return 'STAFF';
      case 'verifikator':
        return 'VERIFIKATOR';
    }
  };

  // Menu berbeda untuk verifikator vs peminjam
  const navItems = user.role === 'verifikator' ? [
    { page: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
    { page: 'verifikasi' as Page, icon: CheckSquare, label: 'Verifikasi Pengajuan' },
    { page: 'kelola-aset' as Page, icon: Settings, label: 'Kelola Aset' },

    { page: 'kalender' as Page, icon: Calendar, label: 'Kalender' },
  ] : [
    { page: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
    { page: 'peminjaman' as Page, icon: Package, label: 'Ajukan Peminjaman' },
    { page: 'pengembalian' as Page, icon: RotateCcw, label: 'Pengembalian' },
    { page: 'kalender' as Page, icon: Calendar, label: 'Kalender' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1A1A1A] text-white flex flex-col shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[#2C2C2C]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Package className="size-8 text-[#F4A100]" />
        </div>
        <h1 className="text-white text-center">
          LogistikCenter
        </h1>
        <p className="text-gray-400 text-center text-xs mt-1">
          Sistem Peminjaman Aset
        </p>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-[#2C2C2C]">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2C2C2C] transition-colors"
        >
          <Avatar className="size-12 bg-[#B3202A]">
            <AvatarFallback className="bg-[#B3202A] text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-white text-sm truncate">{user.name}</p>
            <Badge variant="outline" className={`text-xs px-2 py-0.5 mt-1 ${getRoleBadgeColor(user.role)} border`}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${'              '}${
                isActive
                  ? 'bg-[#B3202A] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-[#2C2C2C] hover:text-white'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2C2C2C]">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-[#2C2C2C] hover:text-white"
        >
          <LogOut className="size-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}