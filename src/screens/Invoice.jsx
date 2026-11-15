import React, { useState } from 'react'
import {
  Wifi, Bluetooth, Usb, Smartphone, Monitor, User, FileText, Calendar, CheckCircle2,
  Package, Banknote, AlertTriangle, XCircle, Check, PauseCircle, X,
} from 'lucide-react'
import { invoiceHeader, invoiceItems, t } from '../data'
import Phone from '../components/Phone'

function StatusIcon({ state }) {
  if (state === 'ok') return <CheckCircle2 size={19} strokeWidth={2.2} color="#17a673" />
  if (state === 'warn') return <AlertTriangle size={19} strokeWidth={2.2} color="#f0a020" />
  return <XCircle size={19} strokeWidth={2.2} color="#e5484d" />
}

function Stepper({ lang }) {
  const tr = t[lang]
  return (
    <div className="stepper">
      <div className="step done">
        <span className="num">1</span>
        <span>{tr.step1}</span>
      </div>
      <span className="step-line" />
      <div className="step">
        <span className="num">2</span>
        <span>{tr.step2}</span>
      </div>
      <span className="step-line" />
      <div className="step">
        <span className="num">3</span>
        <span>{tr.step3}</span>
      </div>
    </div>
  )
}

function WaitingView({ lang, onLink, method, setMethod, busy }) {
  const tr = t[lang]
  const methods = [
    { key: 'bt', icon: Bluetooth, label: tr.bluetooth },
    { key: 'usb', icon: Usb, label: tr.usb },
    { key: 'wifi', icon: Wifi, label: tr.wifi },
  ]
  return (
    <div className="wait-box">
      <div className="wait-title">{busy ? (lang === 'ar' ? 'جارٍ مسح الفاتورة عبر الهاتف...' : 'Scanning invoice via phone...') : tr.waitingTitle}</div>
      <div className="wait-sub">{tr.waitingSub1}<br />{tr.waitingSub2}</div>

      <div className="wait-art">
        <div className="art-phone">
          <Wifi size={26} strokeWidth={1.6} color="#0e8f74" />
        </div>
        <div className="dots-flow">
          <i /><i /><i /><i className="on" /><i /><i /><i />
        </div>
        <div className="art-monitor">
          <div className="pulse"><span className="core" /></div>
        </div>
      </div>

      <div className="methods-title">
        <span className="line" />
        <span>{tr.connectMethods}</span>
        <span className="line" />
      </div>

      <div className="methods">
        {methods.map((m) => {
          const Icon = m.icon
          return (
            <button key={m.key} className={'method' + (method === m.key ? ' on' : '')} onClick={() => setMethod(m.key)}>
              <span className="m-ico"><Icon size={21} strokeWidth={1.9} /></span>
              <span>{m.label}</span>
            </button>
          )
        })}
      </div>

      <button className="btn btn-outline wait-cta" onClick={onLink} disabled={busy}>
        <Smartphone size={20} strokeWidth={1.9} />
        {busy ? (lang === 'ar' ? 'جارٍ الاتصال...' : 'Connecting...') : tr.linkPhone}
      </button>
    </div>
  )
}

function ReviewView({ lang, onCancel, onHold, onConfirm }) {
  const tr = t[lang]
  const cells1 = [
    { icon: User, k: tr.supplier, v: lang === 'ar' ? invoiceHeader.supplier : invoiceHeader.supplierEn },
    { icon: FileText, k: tr.invoiceNo, v: invoiceHeader.number },
    { icon: Calendar, k: tr.invoiceDate, v: invoiceHeader.date },
    { icon: Calendar, k: tr.receiveDate, v: invoiceHeader.received },
  ]
  const cells2 = [
    { icon: CheckCircle2, k: tr.reviewState, v: lang === 'ar' ? invoiceHeader.status : invoiceHeader.statusEn, green: true },
    { icon: User, k: tr.scannedBy, v: invoiceHeader.scannedBy },
    { icon: Package, k: tr.itemsCount, v: `${invoiceHeader.items} ${tr.itemUnit}` },
    { icon: Banknote, k: tr.total, v: `${invoiceHeader.total}`, cur: lang === 'ar' ? 'م.ج' : 'EGP', green: true },
  ]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="invdata">
        <div className="invdata-grid">
          {cells1.map((c, i) => {
            const Icon = c.icon
            return (
              <div className={'invdata-cell' + (i === 0 ? ' first' : '')} key={i}>
                <div className="k"><Icon size={17} strokeWidth={1.7} />{c.k}</div>
                <div className={'v' + (c.green ? ' green' : '')}>
                  {c.cur ? (<span className="money"><span className="cur">{c.cur}</span><span dir="ltr">{c.v}</span></span>) : c.v}
                </div>
              </div>
            )
          })}
        </div>
        <div className="invdata-grid invdata-row2">
          {cells2.map((c, i) => {
            const Icon = c.icon
            return (
              <div className={'invdata-cell' + (i === 0 ? ' first' : '')} key={i}>
                <div className="k"><Icon size={17} strokeWidth={1.7} />{c.k}</div>
                <div className={'v' + (c.green ? ' green' : '')}>
                  {c.cur ? (<span className="money"><span className="cur">{c.cur}</span><span dir="ltr">{c.v}</span></span>) : c.v}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="inv-items-hd">{tr.receivedItems}</div>

      <div className="inv-tbl-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>{tr.no}</th>
              <th>{tr.code}</th>
              <th className="ta-r">{tr.product}</th>
              <th>{tr.qty}</th>
              <th>{tr.unitPrice}</th>
              <th>{tr.bonus}</th>
              <th>{tr.discount}</th>
              <th>{tr.currentStock}</th>
              <th>{tr.reviewStatus}</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((r) => (
              <tr key={r.n} className={r.state === 'warn' ? 'warn' : r.state === 'unknown' ? 'bad' : ''}>
                <td>{r.n}</td>
                <td>{r.code}</td>
                <td className="ta-r" style={r.state === 'unknown' ? { color: '#e5484d', fontWeight: 600 } : undefined}>
                  <span className="pname" dir={/[؀-ۿ]/.test(lang === 'ar' ? r.name : (r.nameEn || r.name)) ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? r.name : (r.nameEn || r.name)}
                  </span>
                </td>
                <td>{r.state === 'warn' ? <span className="cell-hl" style={{ display: 'inline-block', padding: '7px 18px' }}>{r.qty}</span> : r.qty}</td>
                <td>{r.state === 'warn'
                  ? <span className="cell-hl" style={{ display: 'inline-block', padding: '7px 14px' }}>{r.price.toFixed(2)}</span>
                  : r.price.toFixed(2)}</td>
                <td>{r.bonus}</td>
                <td>{r.disc}</td>
                <td>{r.stock}</td>
                <td style={{ textAlign: 'center' }}>
                  {r.state === 'ok' && <StatusIcon state="ok" />}
                  {r.state === 'warn' && (
                    <span style={{ color: '#f0a020', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <StatusIcon state="warn" />{tr.warn}
                    </span>
                  )}
                  {r.state === 'unknown' && (
                    <span style={{ color: '#e5484d', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <StatusIcon state="unknown" />{tr.unknown}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inv-foot">{tr.rowInfo}</div>

      <div className="inv-actions">
        <button className="btn btn-primary confirm" onClick={onConfirm}>
          <CheckCircle2 size={22} strokeWidth={2} />
          {tr.confirmReceive}
        </button>
        <button className="btn btn-ghost" onClick={onHold}>
          <PauseCircle size={21} strokeWidth={1.9} />
          {tr.hold}
        </button>
        <button className="btn btn-danger" onClick={onCancel}>
          <X size={21} strokeWidth={2} />
          {tr.cancelReceive}
        </button>
      </div>
    </div>
  )
}

export default function Invoice({ lang, stage, phoneState, progress, found, onLink, onCancel, onHold, onConfirm }) {
  const tr = t[lang]
  const [method, setMethod] = useState('wifi')

  return (
    <div className="inv">
      <div className="inv-phone">
        <Phone state={phoneState} progress={progress} found={found} lang={lang} />
      </div>

      <div className="inv-main" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="page-title">{tr.receiveInvoice}</h2>
        <div className="card inv-card">
          {stage === 'wait' ? (
            <>
              <Stepper lang={lang} />
              <WaitingView lang={lang} onLink={onLink} method={method} setMethod={setMethod} busy={phoneState !== 'idle'} />
            </>
          ) : (
            <ReviewView lang={lang} onCancel={onCancel} onHold={onHold} onConfirm={onConfirm} />
          )}
        </div>
      </div>
    </div>
  )
}
