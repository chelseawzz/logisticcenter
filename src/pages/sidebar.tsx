import { useState } from 'react';
import type { User, Page } from '../App';
import { Button } from '../components/ui/button';
import {
  LogOut,
  Home,
  Calendar,
  Package,
  RotateCcw,
  CheckSquare,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage} from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

interface SidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  currentPage,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

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
      default:
        return '';
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

  const navItems =
    user.role === 'verifikator'
      ? [
          { page: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
          { page: 'verifikasi' as Page, icon: CheckSquare, label: 'Verifikasi Peminjaman' },
          { page: 'kelola-aset' as Page, icon: Settings, label: 'Kelola Aset' },
          { page: 'kalender' as Page, icon: Calendar, label: 'Kalender' },
        ]
      : [
          { page: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
          { page: 'peminjaman' as Page, icon: Package, label: 'Ajukan Peminjaman' },
          { page: 'pengembalian' as Page, icon: RotateCcw, label: 'Pengembalian' },
          { page: 'kalender' as Page, icon: Calendar, label: 'Kalender' },
        ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* HEADER */}
<div className="px-5 py-4 bg-[#111111] border-b border-white/10">
  <div
    className={`flex items-center ${
      isOpen ? 'justify-between' : 'justify-center gap-4'
    }`}
  >
    {/* Logo + Text */}
    <div className="flex items-center gap-3">
      <Package className="size-7 text-[#F4A100]" />

      {isOpen && (
        <div className="leading-tight">
          <h1 className="text-sm font-medium text-white">
            LogistikCenter
          </h1>
          <p className="text-[11px] text-white/60">
            Sistem Peminjaman Aset
          </p>
        </div>
      )}
    </div>

    {/* Hamburger */}
    <button
      onClick={toggleSidebar}
      className="text-white hover:text-white/80 transition"
    >
      <div className="flex flex-col gap-[3px]">
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
        <span className="block w-5 h-0.5 bg-white"></span>
      </div>
    </button>
  </div>
</div>


      {/* ================= BODY SIDEBAR (HITAM) ================= */}
      <div className="flex-1 bg-[#111111] text-white flex flex-col">
        {/* Profile */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-4">
          <Avatar className="size-11 bg-[#B3202A]">
            <AvatarFallback className="bg-[#B3202A] text-white text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>



          {isOpen && (
            <div>
              <p className="text-[13px] font-medium">{user.name}</p>
              <Badge
                variant="outline"
                className={`mt-1 text-[10px] px-2.5 py-0.5 rounded-full border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map(({ page, icon: Icon, label }) => {
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-md text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#B3202A] text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="size-5 shrink-0" />
                {isOpen && label}
              </button>
            );
          })}
        </nav>

        {/* Logout (BAWAH) */}
        <div className="px-3 py-4 border-t border-white/10">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full flex items-center gap-4 px-5 py-3 text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-5 shrink-0" />
            {isOpen && 'Logout'}
          </Button>
        </div>
      </div>
    </aside>
  );
}
