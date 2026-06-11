import { BookOpen, Sparkles, FileText, Settings, Menu, X, Library } from 'lucide-react';
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current = location.pathname.replace('/', '') || 'generate';

  const navItems = [
    { id: 'generate', label: '生成', icon: Sparkles, path: '/' },
    { id: 'examples', label: '范例', icon: BookOpen, path: '/examples' },
    { id: 'standards', label: '课标教材', icon: Library, path: '/standards' },
    { id: 'settings', label: '设置', icon: Settings, path: '/settings' },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-[#1E293B] tracking-tight">
            困难的教育价值——教案设计器
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-[#DBEAFE] text-[#1D4ED8] rounded-full">
            v1.0
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${current === item.id
                  ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${current === item.id
                  ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                  : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
