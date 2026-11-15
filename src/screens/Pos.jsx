import React, { useMemo, useState } from 'react'
import {
  Search, Barcode, User, CreditCard, MapPin, Hourglass, Banknote, StickyNote,
  ChevronUp, ChevronDown, CheckCircle2, ScanLine,
} from 'lucide-react'
import { products, initialCart, posInitialTotals, t } from '../data'

function ScannerArt() {
  return (
    <svg width="210" height="230" viewBox="0 0 210 230" fill="none">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f5f7" />
          <stop offset="1" stopColor="#c9d3da" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4650" />
          <stop offset="1" stopColor="#1d262d" />
        </linearGradient>
      </defs>
      {/* wifi waves */}
      <path d="M40 118c-14-14-14-38 0-52" stroke="#8fd7c9" strokeWidth="11" strokeLinecap="round" opacity=".85" />
      <path d="M22 130c-24-24-24-64 0-88" stroke="#c6ebe3" strokeWidth="11" strokeLinecap="round" opacity=".8" />
      <path d="M58 106c-7-7-7-18 0-25" stroke="#4fbfa7" strokeWidth="11" strokeLinecap="round" />
      <circle cx="72" cy="94" r="9" fill="#0e8f74" />
      {/* scanner body */}
      <g>
        <rect x="70" y="18" width="120" height="54" rx="27" fill="url(#g1)" stroke="#b9c4cc" strokeWidth="1.5" />
        <rect x="86" y="30" width="62" height="26" rx="8" fill="#e9eef1" stroke="#c2ccd3" />
        <rect x="92" y="34" width="50" height="14" rx="5" fill="url(#g2)" />
        <rect x="96" y="37" width="42" height="8" rx="4" fill="#7b1f22" />
        <path d="M168 26c10 4 16 12 16 22s-6 18-16 22" fill="#dfe6ea" stroke="#b9c4cc" strokeWidth="1.5" />
        <rect x="96" y="66" width="58" height="34" rx="12" fill="url(#g1)" stroke="#b9c4cc" strokeWidth="1.5" />
        <path d="M108 96 L128 96 L146 196 C148 210 138 220 126 220 L112 220 C100 220 94 210 96 198 Z" fill="url(#g1)" stroke="#b9c4cc" strokeWidth="1.5" />
        <path d="M104 150 L136 150 L139 176 L102 176 Z" fill="#dfe6ea" />
        <path d="M118 74 L150 74 L154 96 L114 96 Z" fill="#cbd6dc" opacity=".7" />
      </g>
    </svg>
  )
}

const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Pos({ lang }) {
  const tr = t[lang]
  const [cart, setCart] = useState(initialCart)
  const [dirty, setDirty] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [pay, setPay] = useState('cash')
  const [note, setNote] = useState('')
  const [code, setCode] = useState('')
  const [mobile, setMobile] = useState('')
  const [showModal, setShowModal] = useState(false)

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  const computed = useMemo(() => {
    const count = cart.reduce((s, i) => s + i.qty, 0)
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const rowDisc = cart.reduce((s, i) => s + i.disc * i.qty, 0)
    const totalDiscount = dirty ? 0 : posInitialTotals.totalDiscount
    return {
      count,
      drugsDiscount: 0,
      totalDiscount,
      discountPct: 0,
      discountAmt: 0,
      total: Math.max(0, subtotal - totalDiscount),
      rowDisc,
    }
  }, [cart, dirty])

  const shown = dirty || cart.length !== initialCart.length ? computed : { ...computed, ...posInitialTotals }

  const addProduct = (p) => {
    setDirty(true)
    setCart((c) => {
      const found = c.findIndex((i) => i.id === p.id)
      if (found >= 0) {
        const next = [...c]
        next[found] = { ...next[found], qty: next[found].qty + 1 }
        return next
      }
      return [...c, { ...p, qty: 1 }]
    })
    setQuery('')
  }

  const setQty = (idx, val) => {
    setDirty(true)
    setCart((c) => c.map((i, k) => (k === idx ? { ...i, qty: Math.max(0, val) } : i)).filter((i) => i.qty > 0))
  }

  const removeRow = (idx) => {
    setDirty(true)
    setCart((c) => c.filter((_, k) => k !== idx))
  }

  const confirm = () => {
    setShowModal(true)
  }
  const finish = () => {
    setShowModal(false)
    setCart([])
    setDirty(true)
    setNote('')
    setCode('')
    setMobile('')
    setQuery('')
  }

  const empty = cart.length === 0

  return (
    <>
        <div className="pos">
          {/* right column */}
          <div className="pos-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="card">
              <div className="card-hd">
                <User size={22} strokeWidth={1.6} color="#3d464e" />
                <span>{tr.clientInfo}</span>
              </div>
              <div className="client-body">
                <div className="client-row">
                  <span className="lbl">{tr.codeMobile}</span>
                  <input className="input" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: 210 }} />
                  <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ flex: 1, background: '#fafbfc' }} />
                </div>
                <div className="pay-methods">
                  <button className={'pay-btn' + (pay === 'cash' ? ' active' : '')} onClick={() => setPay('cash')}>
                    <Banknote size={19} strokeWidth={1.7} color={pay === 'cash' ? '#0b7c64' : '#3d464e'} />{tr.cash}
                  </button>
                  <button className={'pay-btn' + (pay === 'card' ? ' active' : '')} onClick={() => setPay('card')}>
                    <CreditCard size={19} strokeWidth={1.7} color={pay === 'card' ? '#0b7c64' : '#3d464e'} />{tr.card}
                  </button>
                  <button className={'pay-btn' + (pay === 'delivery' ? ' active' : '')} onClick={() => setPay('delivery')}>
                    <MapPin size={19} strokeWidth={1.7} color={pay === 'delivery' ? '#0b7c64' : '#3d464e'} />{tr.delivery}
                  </button>
                  <button className={'pay-btn' + (pay === 'later' ? ' active' : '')} onClick={() => setPay('later')}>
                    <Hourglass size={19} strokeWidth={1.7} color={pay === 'later' ? '#0b7c64' : '#3d464e'} />{tr.later}
                  </button>
                </div>
                {lang === 'en' && (
                  <div style={{ marginTop: 12 }}>
                    <span style={{ color: '#2f7fd1', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}>Special Units (-)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-hd">
                <StickyNote size={21} strokeWidth={1.6} color="#3d464e" />
                <span>{tr.summary}</span>
              </div>
              <div className="summary-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="note-row">
                  <span className="lbl">{tr.note}</span>
                  <input className="input" value={note} onChange={(e) => setNote(e.target.value)} style={{ flex: 1 }} />
                </div>

                <table className="sum-tbl">
                  <thead>
                    <tr>
                      <th>{tr.drugsCount}</th>
                      <th>{tr.discountPct}</th>
                      <th>{tr.discountMoney}</th>
                      <th>{tr.totalDiscount}</th>
                      <th>{tr.drugsDiscount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{shown.count}</td>
                      <td>{shown.discountPct.toFixed(2)}</td>
                      <td>{shown.discountAmt.toFixed(2)}</td>
                      <td>{shown.totalDiscount.toFixed(2)}</td>
                      <td>{shown.drugsDiscount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ flex: 1 }} />
                <div className="total-row">
                  <span className="val">
                    {money(shown.total)}
                    <span className="cur">{lang === 'ar' ? 'م.ج' : 'EGP'}</span>
                  </span>
                  <span className="lbl">{tr.grandTotal}</span>
                </div>
                <button className="btn btn-primary pay-confirm" onClick={confirm} disabled={empty}>
                  <CheckCircle2 size={24} strokeWidth={2} />
                  {tr.confirmPay}
                </button>
              </div>
            </div>
          </div>

          {/* left column */}
          <div className="pos-left" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="card search-card">
              <div className="search-field">
                <Search className="sf-ico" size={20} strokeWidth={1.8} />
                <input
                  className="input"
                  placeholder={tr.searchPh}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && suggestions[0]) addProduct(suggestions[0])
                  }}
                />
                {suggestions.length > 0 && (
                  <div className="suggest">
                    {suggestions.map((p) => (
                      <div key={p.id} className="sg-item" onClick={() => addProduct(p)}>
                        <span>{p.name}</span>
                        <span className="sg-price">{money(p.price)} · {p.stock}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="barcode-btn" title="scan">
                <Barcode size={24} strokeWidth={1.6} />
              </button>
            </div>

            <div className="card cart-card">
              {empty ? (
                <div className="empty-state">
                  <ScannerArt />
                  <div className="txt1">{tr.emptyTitle}</div>
                  <div className="txt2">{tr.emptySub}</div>
                </div>
              ) : (
                <div className="cart-scroll">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th className="ta-r">{tr.product}</th>
                        <th>{tr.unit}</th>
                        <th>{tr.expiry}</th>
                        <th>{tr.stock}</th>
                        <th>{tr.qty}</th>
                        <th>{tr.unitPrice}</th>
                        <th>{tr.priceBefore}</th>
                        <th>{tr.discountAmt}</th>
                        <th>{tr.total}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((row, i) => (
                        <tr key={row.id} className={selected === i ? 'sel' : ''} onClick={() => setSelected(i)}>
                          <td className="ta-r">{row.name}</td>
                          <td>{row.unit}</td>
                          <td>{row.expiry}</td>
                          <td>{row.stock}</td>
                          <td>
                            {selected === i ? (
                              <span className="qty-wrap">
                                <input
                                  className="qty-input"
                                  value={row.qty}
                                  onChange={(e) => setQty(i, parseInt(e.target.value || '0', 10))}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="spin">
                                  <button onClick={(e) => { e.stopPropagation(); setQty(i, row.qty + 1) }}><ChevronUp size={12} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); setQty(i, row.qty - 1) }}><ChevronDown size={12} /></button>
                                </span>
                              </span>
                            ) : row.qty}
                          </td>
                          <td>{money(row.price)}</td>
                          <td>{money(row.price * row.qty)}</td>
                          <td>{row.disc.toFixed(2)}</td>
                          <td>{money(row.price * row.qty - row.disc * row.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="cart-foot">
                <span className="k"><Search size={14} /> {lang === 'ar' ? 'F1 بحث' : 'F1 Search'}</span>
                <span className="k"><span className="kbd">F2</span> {tr.f2}</span>
                <span className="k"><User size={14} /> {tr.f3}</span>
                <span className="k"><span className="kbd">Ctrl+D</span> {lang === 'ar' ? 'خصم' : 'Discount'}</span>
                <span className="k"><span className="kbd">Del</span> {lang === 'ar' ? 'حذف صنف' : 'Remove Item'}</span>
              </div>
            </div>
          </div>
        </div>

      {showModal && (
        <div className="modal-mask" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="m-ico"><CheckCircle2 size={40} strokeWidth={1.8} /></div>
            <h3>{lang === 'ar' ? 'تم تأكيد الدفع بنجاح' : 'Payment confirmed successfully'}</h3>
            <p>
              {lang === 'ar'
                ? `تم إنشاء الفاتورة وخصم الأصناف من المخزون · ${pay === 'cash' ? 'نقدي' : pay === 'card' ? 'بطاقة' : pay === 'delivery' ? 'توصيل' : 'آجل'}`
                : `Invoice created and items deducted from stock · ${pay === 'cash' ? 'Cash' : pay === 'card' ? 'Card' : pay === 'delivery' ? 'Delivery' : 'Later'}`}
            </p>
            <div className="m-total">{money(shown.total)} {lang === 'ar' ? 'م.ج' : 'EGP'}</div>
            <div className="m-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'طباعة' : 'Print'}</button>
              <button className="btn btn-primary" onClick={finish}>{lang === 'ar' ? 'طلب جديد' : 'New order'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
