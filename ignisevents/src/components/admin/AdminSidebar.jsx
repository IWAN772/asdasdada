import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Image, 
  MessageSquare, 
  Settings,
  FileText,
  Star,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { STORED_KEY } from '@/lib/adminAuth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'AdminDashboard' },
  { icon: Calendar, label: 'Realizacje', page: 'AdminEvents' },
  { icon: Image, label: 'Galeria', page: 'AdminGallery' },
  { icon: Star, label: 'Opinie', page: 'AdminTestimonials' },
  { icon: FileText, label: 'Usługi', page: 'AdminServices' },
  { icon: MessageSquare, label: 'Wiadomości', page: 'AdminMessages' },
  { icon: Settings, label: 'Ustawienia', page: 'AdminSettings' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <div className="text-xl font-bold">
            <span className="text-white">IGNIS</span>
            <span className="text-amber-500">EVENTS</span>
          </div>
        </Link>
        <p className="text-gray-500 text-xs mt-1">Panel Administracyjny</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.page);
            return (
              <li key={item.page}>
                <Link
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to={createPageUrl('Home')}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors mb-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Wróć do strony</span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem(STORED_KEY);
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Wyloguj</span>
        </button>
      </div>
    </aside>
  );
}