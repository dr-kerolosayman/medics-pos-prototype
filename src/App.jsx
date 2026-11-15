import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { TitleBar, NavBar, Rail, StatusBar, CollapsedRibbon, Ribbon } from './components/Shell'
import Login from './screens/Login'
import Pos from './screens/Pos'
import Invoice from './screens/Invoice'

const W = 1600
const H = 1000

function useScale() {
  const [s, setS] = useState(1)
  useLayoutEffect(() => {
    const calc = () => setS(Math.min(window.innerWidth / W, window.innerHeight / H))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return s
}

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000 * 15)
    return () => clearInterval(iv)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`
  let h = now.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const timeStr = `${pad(h)}:${pad(now.getMinutes())} ${ampm}`
  return { dateStr, timeStr }
}

export default function App() {
  const scale = useScale()
  const { dateStr, timeStr } = useClock()

  const [route, setRoute] = useState('login')
  const [lang, setLang] = useState('ar')
  const [stage, setStage] = useState('wait')
  const [phoneState, setPhoneState] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [found, setFound] = useState(0)
  const [toast, setToast] = useState(null)
  const timers = useRef([])

  const notify = (msg) => {
    setToast(msg)
    const t = setTimeout(() => setToast(null), 2200)
    timers.current.push(t)
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // connecting -> scanning
  useEffect(() => {
    if (phoneState !== 'connecting') return
    const t = setTimeout(() => setPhoneState('scanning'), 1500)
    return () => clearTimeout(t)
  }, [phoneState])

  // scanning progress
  useEffect(() => {
    if (phoneState !== 'scanning') return
    let p = 0
    const iv = setInterval(() => {
      p += 3.5
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setProgress(100)
        setFound(6)
        setTimeout(() => {
          setPhoneState('done')
          setStage('review')
        }, 700)
        return
      }
      setProgress(p)
      setFound(Math.min(6, Math.floor((p / 100) * 7)))
    }, 80)
    return () => clearInterval(iv)
  }, [phoneState])

  const nav = route === 'login' ? null : route === 'pos' ? 'sales' : 'inventory'
  const rail = route === 'pos' ? 'shortages' : 'supply'

  const onNav = (key) => {
    if (key === 'sales') { setRoute('pos'); return }
    if (key === 'inventory') {
      setRoute('inv')
      if (stage === 'review' && phoneState !== 'done') { setStage('wait'); setPhoneState('idle'); setProgress(0) }
      return
    }
    notify(lang === 'ar' ? 'هذا القسم غير متاح في النسخة التجريبية' : 'This section is not part of the prototype')
  }

  const onRail = (key) => {
    if (key === 'supply') { setRoute('inv'); return }
    notify(lang === 'ar' ? 'هذا القسم غير متاح في النسخة التجريبية' : 'This section is not part of the prototype')
  }

  const startLink = () => {
    if (phoneState === 'scanning' || phoneState === 'done') return
    setProgress(0)
    setFound(0)
    setPhoneState('connecting')
  }

  const resetInvoice = () => {
    setStage('wait')
    setPhoneState('idle')
    setProgress(0)
    setFound(0)
  }

  const leftLabel = route === 'pos' ? (lang === 'ar' ? 'الكاشير' : 'Cashier') : (lang === 'ar' ? 'المستخدم' : 'User')

  return (
    <div className="stage">
      <div
        className={'canvas' + (route === 'login' ? ' login-canvas' : '')}
        style={{ '--s': scale }}
      >
        {route === 'login' ? (
          <Login onLogin={() => { setRoute('pos'); notify(lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully') }} />
        ) : (
          <>
            <TitleBar title="Medics POS" />
            <NavBar active={nav} onSelect={onNav} lang={lang} />
            {route === 'pos' && <Ribbon lang={lang} />}
            {route === 'inv' && (
              <CollapsedRibbon open={false} onToggle={() => notify(lang === 'ar' ? 'الشريط مطوي في هذا الإصدار' : 'Ribbon is collapsed')} />
            )}
            <div className="body">
              <Rail active={rail} onSelect={onRail} lang={lang} />
              <div className="main" style={{ direction: 'rtl' }}>
                {route === 'pos' && <Pos lang={lang} />}
                {route === 'inv' && (
                  <>
                    <Invoice
                      lang={lang}
                      stage={stage}
                      phoneState={phoneState}
                      progress={progress}
                      found={found}
                      onLink={startLink}
                      onCancel={resetInvoice}
                      onHold={() => notify(lang === 'ar' ? 'تم تعليق الفاتورة' : 'Invoice put on hold')}
                      onConfirm={() => {
                        notify(lang === 'ar' ? 'تم استلام الفاتورة وإضافتها للمخزون' : 'Invoice received and added to stock')
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            <StatusBar
              lang={lang}
              onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
              dateStr={dateStr}
              timeStr={timeStr}
              leftLabel={leftLabel}
              leftName="Admin"
            />
          </>
        )}

        {toast && (
          <div className="toast-wrap">
            <div className="toast ok">
              <CheckCircle2 size={17} strokeWidth={2.2} />
              {toast}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
