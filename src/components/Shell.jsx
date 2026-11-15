import React from 'react'
import {
  Minus, Square, X, FileWarning, FileSearch, Banknote, Calculator, BarChart3, FileText,
  Store, ChevronDown, Globe, Calendar, Clock, User, Monitor, ChevronUp,
  FilePlus, Save, Tag, Settings, PillBottle, UserPlus, Building2, Cross,
} from 'lucide-react'
import logo from '../assets/logo.png'
import { navTabs, railItems, t } from '../data'

export function TitleBar({ title = 'Medics POS' }) {
  return (
    <div className="titlebar">
      <div className="tb-logo">
        <img src={logo} alt="MEDICs" />
      </div>
      <div className="tb-title">{title}</div>
      <div className="tb-spacer" />
      <div className="win-controls">
        <button title="minimize"><Minus size={16} strokeWidth={1.7} /></button>
        <button title="maximize"><Square size={13} strokeWidth={1.7} /></button>
        <button className="close" title="close"><X size={17} strokeWidth={1.7} /></button>
      </div>
    </div>
  )
}

export function NavBar({ active, onSelect, lang }) {
  return (
    <div className="navbar">
      {navTabs.map((n) => (
        <button
          key={n.key}
          className={'nav-tab' + (active === n.key ? ' active' : '')}
          onClick={() => onSelect(n.key)}
        >
          {lang === 'ar' ? n.ar : n.en}
        </button>
      ))}
    </div>
  )
}

const railIcons = {
  shortages: FileWarning,
  items: FileSearch,
  supply: Banknote,
  calc: Calculator,
  salesrep: BarChart3,
  docs: FileText,
}

export function Rail({ active, onSelect, lang }) {
  const tr = t[lang]
  return (
    <div className="rail">
      <div className="rail-scroll">
        {railItems.map((it) => {
          const Icon = railIcons[it.key]
          const label = lang === 'ar' ? it.ar : it.en
          return (
            <button
              key={it.key}
              className={'rail-item' + (active === it.key ? ' active' : '')}
              onClick={() => onSelect(it.key)}
            >
              <Icon size={34} strokeWidth={1.5} />
              <span className="lbl">{label}</span>
              {it.badge ? <span className="rail-badge">{it.badge}</span> : null}
            </button>
          )
        })}
      </div>
      <div className="rail-bottom">
        <div className="branch-card">
          <Store size={26} strokeWidth={1.5} color="#2c343b" />
          <span className="b-name">{tr.branch}</span>
        </div>
        <div className="branch-select">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  )
}

export function StatusBar({ lang, onToggleLang, dateStr, timeStr, leftLabel, leftName }) {
  const tr = t[lang]
  return (
    <div className="statusbar">
      <div className="sb-right">
        <button className="sb-click" onClick={onToggleLang}>
          <Globe size={16} strokeWidth={1.7} />
          <span>{tr.lang}</span>
        </button>
        <div className="sb-sep" />
        <div className="sb-item">
          <Calendar size={16} strokeWidth={1.7} />
          <span>{dateStr}</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <Clock size={16} strokeWidth={1.7} />
          <span>{timeStr}</span>
        </div>
      </div>
      <div className="sb-left">
        <div className="sb-item">
          <User size={16} strokeWidth={1.7} />
          <span>{leftLabel}: {leftName}</span>
        </div>
        <div className="sb-sep" />
        <div className="sb-item">
          <Monitor size={16} strokeWidth={1.7} />
          <span>{tr.terminal}: 01</span>
        </div>
      </div>
    </div>
  )
}

export function Ribbon({ lang }) {
  const ar = lang === 'ar'
  const groups = [
    { title: ar ? 'الفاتورة' : 'Invoice', items: [
      { icon: FilePlus, label: ar ? 'جديد' : 'New', plus: true },
      { icon: Save, label: ar ? 'حفظ' : 'Save' },
    ]},
    { title: ar ? 'الصنف' : 'Item', items: [
      { icon: Tag, label: ar ? 'خصم' : 'Discount' },
      { icon: Settings, label: ar ? 'اختيارات / إعدادات' : 'Options' },
    ]},
    { title: ar ? 'إضافة دواء (صنف)' : 'Add drug', items: [
      { icon: PillBottle, label: ar ? 'إضافة دواء (صنف)' : 'Add drug (item)', plus: true },
      { icon: PillBottle, label: ar ? 'حذف دواء (صنف)' : 'Remove drug', danger: true, x: true },
    ]},
    { title: ar ? 'إضافة عميل' : 'Add client', items: [
      { icon: UserPlus, label: ar ? 'إضافة عميل' : 'Add client' },
    ]},
    { title: ar ? 'إضافة عيادة' : 'Add clinic', items: [
      { icon: Building2, label: ar ? 'إضافة عيادة' : 'Add clinic', plus: true },
    ]},
  ]
  return (
    <div className="ribbon" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="ribbon-inner">
        <div className="rb-groups">
          {groups.map((g, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <div className="rb-divider" />}
              <div className="rb-group">
                <div className="rb-row">
                {g.items.map((it, i) => {
                  const Icon = it.icon
                  return (
                    <button className="rb-btn" key={i}>
                      <span className="rb-ico" style={{ color: it.danger ? '#e5484d' : '#2f7fd1' }}>
                        <Icon size={30} strokeWidth={1.4} />
                        {it.plus && (
                          <span className="plus" style={{ background: '#12a17f' }}>
                            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          </span>
                        )}
                        {it.x && (
                          <span className="plus" style={{ background: '#e5484d' }}>
                            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          </span>
                        )}
                      </span>
                      <span>{it.label}</span>
                    </button>
                  )
                })}
                </div>
                <div className="rb-group-title">{g.title}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CollapsedRibbon({ open, onToggle }) {
  return (
    <div className="ribbon-collapsed">
      <button
        onClick={onToggle}
        style={{ border: 0, background: 'transparent', color: '#7d868f', display: 'grid', placeItems: 'center' }}
        title="ribbon"
      >
        {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
    </div>
  )
}
