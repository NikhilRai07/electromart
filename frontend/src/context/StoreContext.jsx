import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api'
const StoreContext = createContext(null)
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

export function StoreProvider({children}) {
 const [products,setProducts]=useState([]), [loading,setLoading]=useState(true), [apiOnline,setApiOnline]=useState(false)
 const [cart,setCart]=useState(()=>read('emart_cart',[])), [wishlist,setWishlist]=useState(()=>read('emart_wishlist',[])), [orders,setOrders]=useState(()=>read('emart_orders',[])), [compareIds,setCompareIds]=useState(()=>read('emart_compare',[]).map(String))
 useEffect(()=>{localStorage.setItem('emart_cart',JSON.stringify(cart))},[cart]); useEffect(()=>{localStorage.setItem('emart_wishlist',JSON.stringify(wishlist))},[wishlist]); useEffect(()=>{localStorage.setItem('emart_orders',JSON.stringify(orders))},[orders]); useEffect(()=>{localStorage.setItem('emart_compare',JSON.stringify(compareIds))},[compareIds])
 useEffect(()=>{let live=true; getProducts().then(data=>{if(live&&Array.isArray(data)){setProducts(data);setApiOnline(true)}}).catch(()=>{if(live){setProducts([]);setApiOnline(false)}}).finally(()=>live&&setLoading(false)); return()=>{live=false}},[])
 const addToCart=(product)=>setCart(old=>{const found=old.find(p=>String(p.id)===String(product.id));return found?old.map(p=>String(p.id)===String(product.id)?{...p,qty:p.qty+1}:p):[...old,{...product,qty:1}]})
 const updateQty=(id,delta)=>setCart(old=>old.map(p=>String(p.id)===String(id)?{...p,qty:Math.max(1,p.qty+delta)}:p))
 const removeFromCart=(id)=>setCart(old=>old.filter(p=>String(p.id)!==String(id)))
 const toggleWishlist=(id)=>setWishlist(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])
 const toggleCompare=(id)=>setCompareIds(old=>old.includes(String(id))?old.filter(x=>x!==String(id)):old.length<4?[...old,String(id)]:old)
 const clearCompare=()=>setCompareIds([])
 const cartCount=cart.reduce((n,p)=>n+p.qty,0), subtotal=cart.reduce((n,p)=>n+Number(p.price)*p.qty,0)
 const value=useMemo(()=>({products,setProducts,loading,apiOnline,cart,setCart,addToCart,updateQty,removeFromCart,wishlist,toggleWishlist,compareIds,toggleCompare,clearCompare,orders,setOrders,cartCount,subtotal}),[products,loading,apiOnline,cart,wishlist,compareIds,orders,cartCount,subtotal])
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext)
export const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2})
