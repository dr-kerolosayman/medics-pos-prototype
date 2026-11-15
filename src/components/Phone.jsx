import React from 'react'
import { Wifi, RefreshCw } from 'lucide-react'
import { t } from '../data'

export default function Phone({ state, progress = 0, found = 0, lang = 'ar' }) {
  const tr = t[lang]
  const connected = state === 'done' || state === 'review' || state === 'scanning'
  const scanning = state === 'scanning'
  const pct = state === 'done' ? 100 : progress

  return (
    <div className="phone">
      <span className="btn-side side-l1" />
      <span className="btn-side side-l2" />
      <span className="btn-side side-r" />
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="ph-title">{tr.mobileApp}</div>
        <div className={'ph-status' + (connected ? ' on' : '')}>
          <span className="dot" style={{ background: connected ? '#12a17f' : '#c9d1d8', width: 9, height: 9 }} />
          <span>{connected ? tr.connected : tr.disconnected}</span>
        </div>

        {!connected ? (
          <div className="ph-art">
            <div className="ph-phone-ico">
              <Wifi size={26} strokeWidth={1.6} />
            </div>
            <div className="ph-caption">{tr.waitingPhone}</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 4px' }}>
              <div className="ph-phone-ico on" style={{ width: 56, height: 88 }}>
                <Wifi size={24} strokeWidth={1.8} />
              </div>
              <div className="ph-caption" style={{ marginTop: 10, color: '#12a17f' }}>{tr.directConnect}</div>
            </div>

            <div className="ph-sec">
              <div className="ph-sec-title">{tr.receiveStatus}</div>
              <div className="ph-recv">
                <RefreshCw size={19} strokeWidth={2} />
                <span>{tr.received}</span>
              </div>
              <div className="progress">
                <i style={{ width: `${pct}%` }} />
              </div>
              <div className="ph-progress-txt">
                {tr.recognized.replace('{n}', scanning ? found : 6)}
              </div>
            </div>

            <div className="ph-sec">
              <div className="ph-sec-title">{tr.receiveSummary}</div>
              <div className="legend-row">
                <span className="l"><span className="dot" style={{ background: '#12a17f' }} />{tr.recognizedRow}</span>
                <span style={{ fontWeight: 700 }}>{scanning ? found : 6}</span>
              </div>
              <div className="legend-row">
                <span className="l"><span className="dot" style={{ background: '#f0a020' }} />{tr.needsReview}</span>
                <span style={{ fontWeight: 700 }}>{scanning && found >= 5 ? 1 : 1}</span>
              </div>
              <div className="legend-row">
                <span className="l"><span className="dot" style={{ background: '#e5484d' }} />{tr.notRecognized}</span>
                <span style={{ fontWeight: 700 }}>0</span>
              </div>
            </div>

            <div className="ph-total">
              <span className="k">{tr.invoiceTotal}</span>
              <span className="v"><span style={{ fontSize: 15, marginLeft: 4 }}>{lang === 'ar' ? 'م.ج' : 'EGP'}</span><span dir="ltr">5,260.75</span></span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
