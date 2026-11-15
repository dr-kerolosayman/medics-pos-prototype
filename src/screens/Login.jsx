import React, { useState } from 'react'
import { User, Lock, EyeOff, Eye, ShieldCheck, Gauge, Users, CreditCard, Check } from 'lucide-react'
import logo from '../assets/logo.png'
import doctor from '../assets/doctor.png'
import { TitleBar } from '../components/Shell'

export default function Login({ onLogin }) {
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  return (
    <>
      <TitleBar title="MEDICS - Login" />
      <div className="login-body" dir="ltr">
        <div className="login-pattern" />
        <div className="login-dots" />
        <img className="login-doctor" src={doctor} alt="" />

        <div className="login-center">
          <div className="login-card">
            <div className="login-rule" />
            <div className="login-avatar">
              <User size={34} strokeWidth={1.5} color="#7c8b98" />
            </div>

            <div className="login-field">
              <User className="lf-ico" size={21} strokeWidth={1.6} />
              <input
                className="input"
                placeholder="Username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className="login-field">
              <Lock className="lf-ico" size={21} strokeWidth={1.6} />
              <input
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onLogin()}
              />
              <button
                onClick={() => setShow((s) => !s)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: '#7c8b98', display: 'grid', placeItems: 'center' }}
              >
                {show ? <Eye size={21} strokeWidth={1.6} /> : <EyeOff size={21} strokeWidth={1.6} />}
              </button>
            </div>

            <div className="login-row">
              <span className={'checkbox' + (remember ? ' on' : '')} onClick={() => setRemember((r) => !r)}>
                <span className="box">{remember && <Check size={12} strokeWidth={3} />}</span>
                <span>Remember me</span>
              </span>
              <span className="link">Forgot password?</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', height: 56, fontSize: 18 }} onClick={onLogin}>
              <Lock size={19} strokeWidth={1.8} />
              Login
            </button>

            <div className="login-divider">
              <span className="line" />
              <span className="dot" />
              <span className="line" />
            </div>

            <button className="btn btn-outline" style={{ width: '100%', height: 56, fontSize: 17 }} onClick={onLogin}>
              <CreditCard size={22} strokeWidth={1.7} />
              Smart Card
            </button>
          </div>

          <div className="login-brand">
            <img className="wordmark" src={logo} alt="MEDICS" />
            <div className="tagline">— LESS WORK, MORE CARE —</div>
          </div>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <ShieldCheck className="ico" size={44} strokeWidth={1.4} />
            <span>Secure<br />Login</span>
          </div>
          <div className="login-feature">
            <Gauge className="ico" size={44} strokeWidth={1.4} />
            <span>Fast<br />Access</span>
          </div>
          <div className="login-feature">
            <Users className="ico" size={44} strokeWidth={1.4} />
            <span>Multi-User<br />Support</span>
          </div>
        </div>
      </div>

      <div className="statusbar login-statusbar" dir="ltr">
        <div className="sb-item">
          <span>Server: Localhost</span>
          <span className="dot" style={{ background: '#12a17f', width: 9, height: 9, margin: '0 4px' }} />
          <span>Status: Connected</span>
        </div>
        <div className="sb-item" style={{ marginLeft: 'auto' }}>v 1.0.0.0</div>
      </div>
    </>
  )
}
