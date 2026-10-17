import { Link } from 'react-router-dom'
const categories = [
  ['Mobiles','▯','Phones for everyday life','Mobiles'],
  ['Laptops','▱','Work, study and create','Laptops'],
  ['Audio','♫','Sound that moves with you','Audio'],
  ['TV & Home','▣','Entertainment at home','TV'],
  ['Gaming','⌁','Make room to play','Gaming'],
  ['Wearables','◷','Stay connected on the go','Wearables'],
]
const features = [
  ['⇄','Side-by-side comparison','Compare the product details and prices that are available in the catalogue.','/compare'],
  ['☆','Customer reviews','Read submitted feedback and share your own product experience.','/reviews'],
  ['⌘','Build your setup','Bring products together and see a combined total using catalogue prices.','/product-combinations'],
  ['◐','Your preferred theme','Choose a light or dark storefront that feels right to you.','#theme'],
]
export default function Home() {
  return <div className="aura-home">
    <section className="aura-hero wrap">
      <div className="aura-hero-copy">
        <span className="eyebrow"><i className="aura-dot"/> AURA EDITION · ELECTROMART NEXUS</span>
        <h1>Technology,<br/><em>elevated.</em></h1>
        <p>Discover thoughtful technology for the way you work, create, listen and live. Explore the catalogue, compare your options, and build a setup that feels like yours.</p>
        <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/shop">Explore store <span>↗</span></Link><Link className="btn btn-outline btn-large" to="/compare">Compare products <span>⇄</span></Link></div>
        <div className="aura-proof"><span>✳</span> Explore at your pace <span className="proof-divider"/> <span>◈</span> Make informed choices</div>
      </div>
      <div className="aura-visual" aria-label="Abstract electronics-inspired artwork">
        <div className="aura-halo aura-halo-one"/><div className="aura-halo aura-halo-two"/>
        <div className="aura-device aura-device-phone"><div className="device-camera"/><div className="device-screen"><span>EM</span><i/></div></div>
        <div className="aura-device aura-device-laptop"><div className="laptop-screen"><div className="screen-glow"/><span>NEXUS</span></div><div className="laptop-base"/></div>
        <div className="aura-orb aura-orb-green"/><div className="aura-orb aura-orb-violet"/>
        <div className="visual-caption"><span>THE AURA EXPERIENCE</span><b>Make technology yours.</b></div>
      </div>
    </section>
    <section id="categories" className="wrap aura-categories section-block">
      <div className="section-heading"><div><span className="eyebrow">FIND YOUR CATEGORY</span><h2>What are you looking for?</h2><p>Start with the kind of technology you have in mind.</p></div><Link to="/shop" className="text-link">Explore the catalogue ↗</Link></div>
      <div className="aura-category-grid">{categories.map(([name,icon,desc,category],i)=><Link key={name} to={'/shop?category='+encodeURIComponent(category)} className={'aura-category aura-cat-'+i}><span className="aura-category-icon">{icon}</span><span className="aura-category-arrow">↗</span><b>{name}</b><small>{desc}</small></Link>)}</div>
    </section>
    <section id="about" className="aura-values"><div className="wrap aura-values-inner"><div><span className="eyebrow">A BETTER WAY TO CHOOSE</span><h2>Less guesswork.<br/><em>More confidence.</em></h2></div><p>Shopping for electronics should feel clear, not complicated. ElectroMart Nexus brings product information, comparison tools and customer-submitted reviews together in one considered experience.</p></div></section>
    <section className="wrap section-block aura-feature-section"><div className="section-heading"><div><span className="eyebrow">BUILT AROUND YOUR CHOICES</span><h2>Your shopping toolkit</h2><p>Useful tools to help you explore the options available in the store.</p></div></div><div className="aura-feature-grid">{features.map(([icon,title,desc,href])=><Link key={title} to={href} className="aura-feature-card"><span className="aura-feature-icon">{icon}</span><b>{title}</b><p>{desc}</p><span className="aura-feature-link">Explore feature ↗</span></Link>)}</div></section>
    <section className="wrap aura-cta"><div><span className="eyebrow">YOUR NEXT DISCOVERY STARTS HERE</span><h2>Find the tech that fits your life.</h2><p>Browse the available catalogue and make your next choice with clarity.</p></div><Link to="/shop" className="btn btn-primary btn-large">Explore the store ↗</Link></section>
  </div>
}
