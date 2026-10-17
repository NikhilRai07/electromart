import {Link} from 'react-router-dom'
import {useStore,money} from '../context/StoreContext'
export default function Orders(){
 const {orders}=useStore()
 const user=JSON.parse(localStorage.getItem('emart_user')||'null')
 const list=orders.filter(o=>!user||!o.email||o.email.toLowerCase()===user.email.toLowerCase())
 return <div className="wrap service-page"><div className="breadcrumbs"><Link to="/">Home</Link> / Order drafts</div><span className="eyebrow">YOUR SAVED DETAILS</span><h1>Order drafts</h1><p className="muted">Review order details saved in this browser. These drafts are not sent to a store and do not represent live orders.</p>{!list.length?<div className="empty-state"><span>▤</span><h2>No saved drafts</h2><p>Order drafts saved in this browser will appear here.</p><Link className="btn btn-primary" to="/shop">Start shopping</Link></div>:<div className="service-list">{list.map(o=><article className="service-card" key={o.id}><div className="service-card-head"><div><span className="eyebrow">LOCAL DRAFT · {o.id}</span><h2>{o.status||'Local draft'}</h2><p>{new Date(o.createdAt).toLocaleString()} · {o.items?.length||0} item(s)</p></div><strong>{money(o.total)}</strong></div><p className="muted">{(o.items||[]).map(x=>`${x.name} × ${x.qty}`).join(' · ')}</p></article>)}</div>}</div>
}
