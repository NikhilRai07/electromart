import { useEffect, useMemo, useState } from 'react'
import { getProducts, login, adminLogin, register } from './api'
import ProductManager from './components/ProductManager'

const money = n => '₹' + Number(n || 0).toLocaleString('en-IN')
const categories = ['All', 'Mobiles', 'Laptops', 'TV', 'Audio', 'Gaming', 'Wearables']

function Header({ query, setQuery, category, setCategory, cartCount, onLogin, onAdminLogin, user, admin, onLogout, dark, setDark }) {
  return <header>
    <div className="topbar">
      <a className="logo" href="#" onClick={() => setCategory('All')}>Electro<span>Mart</span></a>
      <input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search gadgets, specs, brands..." aria-label="Search products" />
      <div className="head-actions">{user ? <><span className="user">{admin ? '🛡️ Admin' : `Hi, ${user.split('@')[0]}`}</span><button className="ghost" onClick={onLogout}>Log out</button></> : <><button className="ghost" onClick={onLogin}>👤 User Login</button><button className="ghost admin-login-btn" onClick={onAdminLogin}>🛡️ Admin Login</button></>}
      <button className="ghost dark-toggle header-theme" onClick={() => setDark(v=>!v)} aria-label="Toggle colour theme">{dark?'☀️ Light':'🌙 Dark'}</button><button className="cart-pill" onClick={() => document.getElementById('cart')?.scrollIntoView({behavior:'smooth'})}>🛒 Cart ({cartCount})</button></div>
    </div>
    <nav>{categories.map(c => <button className={category===c?'selected':''} key={c} onClick={() => setCategory(c)}>{c==='All'?'Home':c}</button>)}</nav>
  </header>
}
function ProductCard({ product, addToCart, toggleWish, wished, compared, toggleCompare }) {
  return <article className="product">
    <img src={product.imageUrl || 'https://placehold.co/600x400?text=ElectroMart'} alt={product.name} onError={e => {e.currentTarget.src='https://placehold.co/600x400?text=Electronics'}} />
    <div className="product-content"><small>{product.category}</small><h3>{product.name}</h3><div className="rating">★ {Number(product.rating || 4.5).toFixed(1)}</div><div className="price">{money(product.price)}</div>
      <p>{product.description}</p><div className="actions"><button className="add" onClick={() => addToCart(product)}>Add to Cart</button><button className={'heart '+(wished?'active':'')} aria-label="Wishlist" onClick={() => toggleWish(product.id)}>{wished?'♥':'♡'}</button></div><button className={'compare-pick '+(compared?'picked':'')} onClick={()=>toggleCompare(product.id)}>{compared?'✓ Added to compare':'⇄ Compare product'}</button>
    </div>
  </article>
}
function LoginModal({ close, onSuccess, initialMode = 'user-login' }) {
  const [mode,setMode] = useState(initialMode), [email,setEmail] = useState(initialMode==='admin-login'?'admin@electromart.com':''), [password,setPassword] = useState(''), [error,setError] = useState('')
  const isAdmin = mode === 'admin-login'
  async function submit(e) {
    e.preventDefault(); setError('')
    try {
      const result = isAdmin ? await adminLogin(email,password) : mode==='user-login' ? await login(email,password) : await register(email,password)
      localStorage.setItem('emart_token',result.token)
      localStorage.setItem('emart_user',result.email)
      localStorage.setItem('emart_role',isAdmin?'ADMIN':'USER')
      onSuccess(result.email, isAdmin)
    } catch(err) { setError(err.response?.data?.message || err.response?.data?.detail || (isAdmin?'Admin sign-in failed. Check admin credentials.':'Could not sign in. Check backend and credentials.')) }
  }
  return <div className="shade" onClick={close}><form className="modal" onSubmit={submit} onClick={e=>e.stopPropagation()}><button type="button" className="x" onClick={close}>×</button><div className="login-tabs"><button type="button" className={!isAdmin?'active':''} onClick={()=>{setMode('user-login');setError('')}}>User Login</button><button type="button" className={isAdmin?'active':''} onClick={()=>{setMode('admin-login');setEmail('admin@electromart.com');setPassword('');setError('')}}>Admin Login</button></div><h2>{isAdmin?'Admin Portal':mode==='user-register'?'Create account':'Welcome back'}</h2><p className="muted">{isAdmin?'Sign in as administrator to add, edit or remove products.':'Shop products with your ElectroMart user account.'}</p><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" /></label><label>Password<input required minLength="8" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='user-register'?'new-password':'current-password'} /></label>{isAdmin&&<p className="admin-demo-hint">Demo admin: admin@electromart.com · Password: Admin@12345</p>}{error&&<p className="error">{error}</p>}<button className="add full">{isAdmin?'Sign in as Admin':mode==='user-register'?'Create User Account':'Sign In'}</button>{!isAdmin&&<p className="switch" onClick={()=>{setMode(mode==='user-login'?'user-register':'user-login');setError('')}}>{mode==='user-login'?'New here? Create user account':'Already registered? Sign in'}</p>}</form></div>
}
export default function App() {
  const [products,setProducts] = useState([]), [loading,setLoading] = useState(true), [apiError,setApiError] = useState('')
  const [query,setQuery] = useState(''), [category,setCategory] = useState('All')
  const [cart,setCart] = useState(() => JSON.parse(localStorage.getItem('emart_cart') || '[]'))
  const [wishlist,setWishlist] = useState(() => JSON.parse(localStorage.getItem('emart_wishlist') || '[]'))
  const [user,setUser] = useState(localStorage.getItem('emart_user') || ''), [isAdmin,setIsAdmin] = useState(localStorage.getItem('emart_role') === 'ADMIN'), [loginOpen,setLoginOpen] = useState(false), [loginMode,setLoginMode] = useState('user-login')
  const [dark,setDark] = useState(() => localStorage.getItem('emart_theme') === 'dark'), [sort,setSort] = useState('featured'), [maxPrice,setMaxPrice] = useState(170000)
  const [compareIds,setCompareIds] = useState([]), [botOpen,setBotOpen] = useState(false), [botInput,setBotInput] = useState('')
  const [botMessages,setBotMessages] = useState([{from:'bot',text:'Hi! I’m ElectroBuddy 🤖 Tell me your budget or what gadget you need. I’ll find matches from this store catalogue.'}])
  const [coupon,setCoupon] = useState(''), [appliedCoupon,setAppliedCoupon] = useState(''), [couponMessage,setCouponMessage] = useState('')
  async function loadProducts() {
    try {
      const data = await getProducts()
      setProducts(data)
      setApiError('')
      return data
    } catch (err) {
      setApiError('Backend API is unavailable. Start the backend and check the API URL/CORS settings.')
      throw err
    } finally { setLoading(false) }
  }
  useEffect(() => { loadProducts().catch(() => {}) }, [])
  useEffect(() => { localStorage.setItem('emart_cart',JSON.stringify(cart)) },[cart])
  useEffect(() => { localStorage.setItem('emart_wishlist',JSON.stringify(wishlist)) },[wishlist])
  useEffect(() => { localStorage.setItem('emart_theme',dark?'dark':'light') },[dark])
  const shown = useMemo(() => products.filter(p => (category==='All'||p.category===category) && (p.name+' '+p.category+' '+(p.description||'')).toLowerCase().includes(query.toLowerCase()) && Number(p.price)<=maxPrice).sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:0),[products,category,query,maxPrice,sort])
  const cartCount = cart.reduce((n,p)=>n+p.qty,0), total=cart.reduce((n,p)=>n+p.price*p.qty,0)
  const comparedProducts = compareIds.map(id=>products.find(p=>p.id===id)).filter(Boolean)
  const couponApplied = Boolean(appliedCoupon)
  const discount = appliedCoupon === 'SAVE5' ? Math.round(total * 0.05) : appliedCoupon === 'SMART10' && total >= 20000 ? Math.min(Math.round(total * 0.10), 5000) : 0
  function toggleCompare(id){setCompareIds(old=>old.includes(id)?old.filter(x=>x!==id):old.length<3?[...old,id]:old)}
  function sendBot(e){
    e?.preventDefault(); const q=botInput.trim(); if(!q)return;
    const lower=q.toLowerCase();
    const budgetMatch=q.match(/(?:₹|rs\.?\s*)?([0-9][0-9,]*)\s*(k|thousand|l|lakh)?/i);
    let budget=budgetMatch?Number(budgetMatch[1].replace(/,/g,''))*(/k|thousand/i.test(budgetMatch[2]||'')?1000:/l|lakh/i.test(budgetMatch[2]||'')?100000:1):Infinity;
    if(!Number.isFinite(budget)||budget<=0)budget=Infinity;
    const categoryWords={Mobiles:['mobile','phone','iphone','android'],Laptops:['laptop','macbook','notebook','computer'],TV:['tv','television'],Audio:['audio','headphone','headphones','speaker','earbuds'],Gaming:['gaming','playstation','console','game'],Wearables:['wearable','watch','smartwatch']};
    const targetCategories=Object.entries(categoryWords).filter(([,words])=>words.some(w=>lower.includes(w))).map(([cat])=>cat);
    let candidates=products.filter(p=>Number(p.price)<=budget);
    if(targetCategories.length)candidates=candidates.filter(p=>targetCategories.includes(p.category));
    const queryWords=lower.split(/[^a-z]+/).filter(w=>w.length>2&&!['best','under','with','find','show','deal','deals','discount','discounts','budget','recommend','recommendation','please','compare','cheap','price','mobile','phone','laptop','notebook','computer','television','audio','headphone','headphones','speaker','earbuds','gaming','playstation','console','game','wearable','watch','smartwatch','iphone','android','tv','offer','offers','coupon','save','lowest'].includes(w));
    const matching=candidates.map(p=>{const text=(p.name+' '+p.category+' '+(p.description||'')).toLowerCase();const hits=queryWords.filter(w=>text.includes(w)).length;return {...p,_score:hits*3+Number(p.rating||0)+(Number(p.price)<=budget?1:0),_hits:hits}}).filter(p=>!queryWords.length||p._hits>0);
    const wantsDeals=/discount|deal|offer|coupon|save|cheap|lowest price|budget/i.test(lower);
    const results=(matching.length?matching:candidates).sort((a,b)=>wantsDeals?(Number(a.price)-Number(b.price)):(b._score-a._score)||(Number(b.rating||0)-Number(a.rating||0))||(Number(a.price)-Number(b.price))).slice(0,3);
    let answer;
    if(!results.length) answer='I couldn’t find a product within that budget/category in the current catalogue. Try a higher budget or another category. I use this store’s catalogue and demo rules; no live AI service is connected.';
    else {
      const picks=results.map((p,i)=>`${i+1}. ${p.name} — ${money(p.price)}${p.rating?' · ★ '+Number(p.rating).toFixed(1):''}`).join('\n');
      const couponTip=total>=20000?' Your cart may qualify for SMART10 (10% off, capped at ₹5,000) in this demo.':' Try SAVE5 for 5% off your demo cart.';
      answer=(wantsDeals?'Best-priced matches from the current catalogue:\n':'My catalogue-based picks for you:\n')+picks+'\n\n'+(Number.isFinite(budget)?`Budget checked: ${money(budget)}. `:'')+'Offers are demo coupons, not live retailer discounts.'+couponTip;
    }
    setBotMessages(old=>[...old,{from:'you',text:q},{from:'bot',text:answer}]);setBotInput('');
  }
  function applyCoupon(){
    const code=coupon.trim().toUpperCase();
    if(code==='SAVE5'){setAppliedCoupon(code);setCouponMessage('SAVE5 applied — 5% demo discount added.');}
    else if(code==='SMART10'&&total>=20000){setAppliedCoupon(code);setCouponMessage('SMART10 applied — 10% off (maximum ₹5,000) in this demo.');}
    else if(code==='SMART10'){setAppliedCoupon('');setCouponMessage('SMART10 needs a cart subtotal of at least ₹20,000.');}
    else{setAppliedCoupon('');setCouponMessage('Code not valid. Try SAVE5, or SMART10 on carts of ₹20,000 or more.');}
  }
  function addToCart(p){setCart(old=>{const found=old.find(x=>x.id===p.id);return found?old.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...old,{...p,qty:1}]})}
  function updateQty(id,d){setCart(old=>old.map(p=>p.id===id?{...p,qty:p.qty+d}:p).filter(p=>p.qty>0))}
  function logout(){localStorage.removeItem('emart_token');localStorage.removeItem('emart_user');localStorage.removeItem('emart_role');setUser('');setIsAdmin(false)}
  return <div data-theme={dark?'dark':'light'} className="app">
    <Header query={query} setQuery={setQuery} category={category} setCategory={setCategory} cartCount={cartCount} onLogin={()=>{setLoginMode('user-login');setLoginOpen(true)}} onAdminLogin={()=>{setLoginMode('admin-login');setLoginOpen(true)}} user={user} admin={isAdmin} onLogout={logout} dark={dark} setDark={setDark}/>
    <main className="container">
      <section className="hero"><div className="hero-copy"><span className="eyebrow">⚡ THE FUTURE, DELIVERED</span><h1>Next-Gen Tech & Gadgets at <span>ElectroMart</span></h1><p>Discover powerful devices, immersive audio and smarter everyday technology — all in one place.</p><button onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>Explore Collection →</button></div><div className="hero-art" aria-hidden="true"><span>✦</span><div className="orb">EM</div><b>TECH<br/>FOR ALL</b></div></section>
      <section className="features"><div><b>🚚 Fast Delivery</b><small>Quick dispatch on orders</small></div><div><b>🛡️ Trusted Quality</b><small>Reliable electronics</small></div><div><b>💳 Easy Payments</b><small>Simple checkout demo</small></div><div><b>⭐ Curated Tech</b><small>Popular picks in one place</small></div></section>
      <section id="products" className="section-head"><div><span className="eyebrow">OUR COLLECTION</span><h2>{category==='All'?'Featured Products':category}</h2><p className="muted">{shown.length} products found</p></div><div className="controls"><label>Max price <b>{money(maxPrice)}</b><input type="range" min="10000" max="170000" step="5000" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select><span className="mode-hint">{dark?'Dark mode on':'Light mode'}</span></div></section>
      {apiError&&<div className="notice">{apiError} <code>http://localhost:8082/api/products</code></div>}
      {loading?<p className="loading">Loading products…</p>:<section className="products-grid">{shown.map(p=><ProductCard key={p.id} product={p} addToCart={addToCart} toggleWish={id=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])} wished={wishlist.includes(p.id)} compared={compareIds.includes(p.id)} toggleCompare={toggleCompare}/>)}</section>}
      {!loading&&!shown.length&&!apiError&&<p className="loading">No products match. Try another category or search.</p>}
      {wishlist.length>0&&<section className="wishlist-section" id="wishlist"><div className="section-head wishlist-heading"><div><span className="eyebrow">SAVED FOR LATER</span><h2>My Wishlist ♥</h2><p className="muted">Your saved products stay on this device.</p></div></div><div className="products-grid">{products.filter(p=>wishlist.includes(p.id)).map(p=><article className="product wishlist-card" key={p.id}><img src={p.imageUrl||'https://placehold.co/600x400?text=ElectroMart'} alt={p.name}/><div className="product-content"><small>{p.category}</small><h3>{p.name}</h3><div className="price">{money(p.price)}</div><div className="actions"><button className="add" onClick={()=>addToCart(p)}>Add to Cart</button><button className="heart active" onClick={()=>setWishlist(w=>w.filter(id=>id!==p.id))} aria-label={'Remove '+p.name+' from wishlist'}>♥</button></div></div></article>)}</div></section>}
      {compareIds.length>0&&<section className="compare-section" id="comparison"><div className="compare-heading"><div><span className="eyebrow">SIDE-BY-SIDE</span><h2>Product comparison</h2><p className="muted">Select up to 3 products. Compare price, rating and description side by side.</p><small className="muted">*Value index is a simple rating-to-price indicator, not a manufacturer specification.</small></div><button className="ghost compare-clear" onClick={()=>setCompareIds([])}>Clear comparison</button></div><div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Specification</th>{comparedProducts.map(p=><th key={p.id}>{p.name}<button className="compare-remove" onClick={()=>toggleCompare(p.id)} aria-label={'Remove '+p.name}>×</button></th>)}</tr></thead><tbody><tr><th>Category</th>{comparedProducts.map(p=><td key={p.id}>{p.category||'—'}</td>)}</tr><tr><th>Price</th>{comparedProducts.map(p=><td key={p.id} className="compare-price">{money(p.price)}</td>)}</tr><tr><th>Rating</th>{comparedProducts.map(p=><td key={p.id}>★ {Number(p.rating||4.5).toFixed(1)}</td>)}</tr><tr><th>Demo price with SAVE5</th>{comparedProducts.map(p=><td key={p.id}>{money(Number(p.price)*0.95)} <small className="muted">(5% demo coupon)</small></td>)}</tr><tr><th>Value index*</th>{comparedProducts.map(p=><td key={p.id}>{(Number(p.rating||4.5)*10000/Math.max(1,Number(p.price))).toFixed(2)}</td>)}</tr><tr><th>Description</th>{comparedProducts.map(p=><td key={p.id}>{p.description||'Not provided'}</td>)}</tr><tr><th>Action</th>{comparedProducts.map(p=><td key={p.id}><button className="add" onClick={()=>addToCart(p)}>Add to cart</button></td>)}</tr></tbody></table></div></section>}
      {isAdmin ? <section className="admin-dashboard"><div className="admin-dashboard-heading"><span className="eyebrow">ADMINISTRATOR WORKSPACE</span><h2>🛡️ Product Control Centre</h2><p className="muted">Only the signed-in admin can add, edit, or delete catalogue products.</p></div><ProductManager products={products} onChanged={loadProducts} /></section> : <section className="admin-callout"><div><span className="eyebrow">SELLER / ADMIN ACCESS</span><h2>Manage the ElectroMart catalogue</h2><p className="muted">Product creation and editing are available only after Admin Login.</p></div><button className="add" onClick={()=>{setLoginMode('admin-login');setLoginOpen(true)}}>🛡️ Admin Login</button></section>}
      <section id="cart" className="cart-section"><div><span className="eyebrow">YOUR BAG</span><h2>Shopping Cart <span className="muted">({cartCount})</span></h2></div>{cart.length===0?<p className="muted">Your cart is empty. Add something you love.</p>:<><div className="cart-list">{cart.map(p=><div className="cart-row" key={p.id}><div><b>{p.name}</b><small>{money(p.price)} each</small></div><div className="qty"><button onClick={()=>updateQty(p.id,-1)}>−</button><span>{p.qty}</span><button onClick={()=>updateQty(p.id,1)}>+</button><button className="remove" onClick={()=>setCart(c=>c.filter(x=>x.id!==p.id))}>Remove</button></div></div>)}</div><div className="coupon-box"><label htmlFor="coupon-code">🎟️ Demo discount code</label><div className="coupon-controls"><input id="coupon-code" value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="SAVE5 or SMART10"/><button className="ghost coupon-apply" onClick={applyCoupon}>Apply code</button></div>{couponMessage&&<small className={couponApplied?'coupon-success':'coupon-error'}>{couponMessage}</small>}</div><div className="cart-total"><div className="total-breakdown"><span>Subtotal: {money(total)}</span>{couponApplied&&<span className="savings">{appliedCoupon} demo savings: −{money(discount)}</span>}<b>Total: {money(Math.max(0,total-discount))}</b></div><button className="add" onClick={()=>user?alert('Demo checkout: no real payment is processed.'):setLoginOpen(true)}>Continue to Checkout</button></div></>}</section>
    </main>
    <footer><a className="logo" href="#">Electro<span>Mart</span></a><p>Technology that moves you forward.</p><small>© 2026 ElectroMart · FSJP Mini Project Demo</small></footer>
    <button className="bot-launcher" onClick={()=>setBotOpen(v=>!v)} aria-label="Open ElectroBuddy shopping assistant">{botOpen?'×':'✦'}<span>{botOpen?'Close':'ElectroBuddy'}</span></button>
    {botOpen&&<aside className="bot-panel" aria-label="ElectroBuddy smart shopping assistant"><div className="bot-head"><div><b>✦ ElectroBuddy</b><small>Smart shopping assistant · Demo</small></div><button onClick={()=>setBotOpen(false)} aria-label="Close assistant">×</button></div><div className="bot-messages">{botMessages.map((m,i)=><div key={i} className={'bot-message '+m.from}>{m.text}</div>)}</div><div className="bot-prompts"><button onClick={()=>setBotInput('Best laptop under ₹50000')}>Laptop under ₹50k</button><button onClick={()=>setBotInput('Find best discount deals')}>Best deals</button><button onClick={()=>setBotInput('Best rated mobile under ₹50000')}>Top-rated under ₹50k</button></div><form className="bot-form" onSubmit={sendBot}><input value={botInput} onChange={e=>setBotInput(e.target.value)} placeholder="Budget or product type…" aria-label="Ask ElectroBuddy"/><button className="add" type="submit">Send</button></form><p className="bot-disclaimer">Recommendations use catalogue data and local rules, not a connected AI API. Coupons and savings are demo-only; no live retailer pricing is verified.</p></aside>}
    {loginOpen&&<LoginModal initialMode={loginMode} close={()=>setLoginOpen(false)} onSuccess={(email,admin)=>{setUser(email);setIsAdmin(admin);setLoginOpen(false);if(admin) setTimeout(()=>document.getElementById('product-manager')?.scrollIntoView({behavior:'smooth'}),150)}}/>}
  </div>
}
