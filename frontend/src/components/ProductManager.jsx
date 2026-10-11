import { useState } from 'react'
import { createProduct, updateProduct, deleteProduct } from '../api'

const emptyForm = { name: '', category: 'Mobiles', price: '', rating: '4.5', description: '', imageUrl: '' }

export default function ProductManager({ products, onChanged }) {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function change(e) { setForm(old => ({ ...old, [e.target.name]: e.target.value })) }
  function edit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '', category: product.category || 'Mobiles',
      price: String(product.price ?? ''), rating: String(product.rating ?? 4.5),
      description: product.description || '', imageUrl: product.imageUrl || ''
    })
    setMessage('Editing product #' + product.id)
    setError('')
    document.getElementById('product-manager')?.scrollIntoView({ behavior: 'smooth' })
  }
  function reset() { setEditingId(null); setForm(emptyForm) }

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMessage(''); setError('')
    const payload = { ...form, price: Number(form.price), rating: Number(form.rating) }
    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      setMessage(editingId ? 'Product updated successfully.' : 'Product created successfully.')
      reset()
      await onChanged()
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Request failed. Check that the backend and database are running.')
    } finally { setBusy(false) }
  }

  async function remove(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    setBusy(true); setMessage(''); setError('')
    try {
      await deleteProduct(product.id)
      setMessage('Product deleted successfully.')
      if (editingId === product.id) reset()
      await onChanged()
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Could not delete product.')
    } finally { setBusy(false) }
  }

  return <section id="product-manager" className="cart-section product-manager">
    <div><span className="eyebrow">EXPERIMENT 7 · REST API + AXIOS</span><h2>Product Management</h2>
      <p className="muted">Create, read, update and delete products using the Spring Boot API and MySQL database.</p></div>
    <form className="manager-form" onSubmit={submit}>
      <label>Product name<input name="name" value={form.name} onChange={change} required maxLength="150" placeholder="e.g. Wireless Headphones" /></label>
      <label>Category<select name="category" value={form.category} onChange={change}>
        {['Mobiles','Laptops','TV','Audio','Gaming','Wearables','Accessories'].map(c => <option key={c}>{c}</option>)}
      </select></label>
      <label>Price (₹)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
      <label>Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={change} /></label>
      <label className="manager-wide">Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={change} placeholder="https://..." /></label>
      <label className="manager-wide">Description<textarea name="description" value={form.description} onChange={change} rows="2" maxLength="1200" /></label>
      <div className="manager-wide manager-actions"><button className="add" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}</button>
        {editingId && <button type="button" className="ghost" onClick={reset} disabled={busy}>Cancel Edit</button>}</div>
    </form>
    {message && <p className="success" role="status">{message}</p>}
    {error && <p className="error" role="alert">{error}</p>}
    <h3>Saved products ({products.length})</h3>
    <div className="manager-list">{products.map(p => <div className="manager-row" key={p.id}>
      <div><b>{p.name}</b><small>#{p.id} · {p.category} · ₹{Number(p.price || 0).toLocaleString('en-IN')}</small></div>
      <div className="manager-actions"><button className="ghost" onClick={() => edit(p)} disabled={busy}>Edit</button><button className="remove" onClick={() => remove(p)} disabled={busy}>Delete</button></div>
    </div>)}</div>
  </section>
}
