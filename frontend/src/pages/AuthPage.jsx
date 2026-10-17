import {useState} from 'react'
import {Link,useNavigate,useLocation} from 'react-router-dom'
import {login,register,adminLogin} from '../api'
export default function AuthPage({mode='login'}) {
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('')
 const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const navigate=useNavigate(); const location=useLocation()
 const admin=mode==='admin'; const signup=mode==='signup'
 async function submit(e){e.preventDefault();setBusy(true);setError('')
  try { const data=admin?await adminLogin(email,password):signup?await register(email,password):await login(email,password)
   localStorage.setItem('emart_token',data.token);localStorage.setItem('emart_user',JSON.stringify({email:data.email,role:data.role,name:name||data.email.split('@')[0]}))
   window.dispatchEvent(new Event('emart-auth-change'));navigate(admin?'/admin':location.state?.from||'/')
  } catch(err){setError(err.response?.data?.message||err.response?.data?.error||'Could not connect or credentials were rejected. Check backend and try again.')} finally{setBusy(false)}
 }
 return <div className="auth-wrap"><div className="auth-card"><div className="auth-brand"><span className="brand-mark">E</span><span>Electro<span className="brand-accent">Mart</span></span></div><span className="eyebrow">{admin?'SECURE ADMIN ACCESS':'YOUR TECH, YOUR ACCOUNT'}</span><h1>{admin?'Admin sign in':signup?'Create your account':'Welcome back'}</h1><p className="muted">{admin?'Manage products and service requests from one place.':signup?'Create an account to keep your orders and services together.':'Sign in to continue shopping and track your orders.'}</p>
 <form className="auth-form" onSubmit={submit}>{signup&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" placeholder="Your name"/></label>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required autoComplete={signup?'new-password':'current-password'} placeholder="At least 8 characters"/></label>{error&&<p className="error" role="alert">{error}</p>}<button className="btn btn-primary auth-submit" disabled={busy}>{busy?'Please wait…':admin?'Sign in to admin':signup?'Create account':'Sign in'}</button></form>
 {admin&&<p className="demo-note">Admin access: use your configured administrator account.</p>}
 <div className="auth-switch">{!admin&&(signup?<>Already registered? <Link to="/login">Sign in</Link></>:<>New to ElectroMart? <Link to="/signup">Create an account</Link></>)}{!admin&&<span> · </span>}<Link to={admin?'/login':'/admin/login'}>{admin?'Customer login':'Admin portal'}</Link></div></div></div>
}
