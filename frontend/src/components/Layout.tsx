import { CalendarDays, LayoutDashboard, Menu, Plus, Stethoscope, Users, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Agenda', icon: LayoutDashboard, end: true },
  { to: '/nova-consulta', label: 'Nova consulta', icon: Plus },
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/procedimentos', label: 'Procedimentos', icon: Stethoscope },
]

export function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand__mark"><span>+</span></span>
          <span><strong>Dental</strong><em>AI</em></span>
        </div>
        <button className="sidebar__close icon-button" onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
        <nav className="nav" aria-label="Menu principal">
          <p className="nav__eyebrow">GESTÃO DA CLÍNICA</p>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="clinic-avatar"><CalendarDays size={18} /></div>
          <div><strong>Dental AI</strong><span>Clínica odontológica</span></div>
        </div>
      </aside>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
      <main className="main-content">
        <header className="mobile-header">
          <button className="icon-button" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></button>
          <div className="brand brand--small"><span className="brand__mark"><span>+</span></span><span><strong>Dental</strong><em>AI</em></span></div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
