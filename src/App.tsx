import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  ArrowRight, ChefHat, Clock3, Flame, Heart, Leaf,
  LockKeyhole, LogIn, MapPin, Menu, Search, ShoppingBag, Star, UserRound, X,
} from 'lucide-react'

type Restaurant = {
  id: string; name: string; cuisine: string; description: string; image: string
  rating: string; time: string; price: string; featured?: boolean
}
type Dish = {
  id: string; restaurantId: string; name: string; description: string
  category: string; price: number; image: string; vegetarian?: boolean; popular?: boolean
}

const restaurants: Restaurant[] = [
  { id: 'saffron', name: 'Saffron & Spice', cuisine: 'Indian · Comfort food', description: 'A little warmth, a lot of flavor. Freshly prepared Indian favorites.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=85', rating: '4.9', time: '20–30 min', price: '$$', featured: true },
  { id: 'bella', name: 'Bella Napoli', cuisine: 'Italian · Pizza & pasta', description: 'Hand-stretched pizza, slow-simmered sauces, and good company.', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=85', rating: '4.8', time: '25–35 min', price: '$$' },
  { id: 'greenbowl', name: 'The Green Bowl', cuisine: 'Healthy · Salads', description: 'Colorful bowls and feel-good ingredients made to order.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85', rating: '4.7', time: '15–25 min', price: '$$' },
  { id: 'umami', name: 'Umami House', cuisine: 'Japanese · Asian', description: 'Thoughtful sushi, ramen, and Japanese-inspired small plates.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&q=85', rating: '4.8', time: '25–35 min', price: '$$$' },
]

const dishes: Dish[] = [
  { id: 'd1', restaurantId: 'saffron', name: 'Butter Chicken', description: 'Tender chicken in a creamy tomato sauce with a hint of fenugreek.', category: 'Mains', price: 17.5, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&q=85', popular: true },
  { id: 'd2', restaurantId: 'saffron', name: 'Paneer Tikka', description: 'Chargrilled cottage cheese, peppers, and house spices.', category: 'Vegetarian', price: 15, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700&q=85', vegetarian: true },
  { id: 'd3', restaurantId: 'saffron', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and herbs.', category: 'Mains', price: 18, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=700&q=85', popular: true },
  { id: 'd4', restaurantId: 'saffron', name: 'Garlic Naan', description: 'Soft tandoor-baked bread brushed with garlic butter.', category: 'Sides', price: 4.5, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=700&q=85', vegetarian: true },
  { id: 'd5', restaurantId: 'bella', name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella, basil, olive oil.', category: 'Pizza', price: 16, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85', vegetarian: true, popular: true },
  { id: 'd6', restaurantId: 'bella', name: 'Penne Arrabbiata', description: 'Penne pasta tossed in a spicy garlic and tomato sauce.', category: 'Pasta', price: 15.5, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700&q=85', vegetarian: true },
  { id: 'd7', restaurantId: 'greenbowl', name: 'Harvest Bowl', description: 'Quinoa, avocado, roasted sweet potato, greens, and tahini.', category: 'Bowls', price: 14, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85', vegetarian: true, popular: true },
  { id: 'd8', restaurantId: 'umami', name: 'Salmon Sushi Set', description: 'Fresh salmon nigiri and maki served with pickled ginger.', category: 'Sushi', price: 21, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=85', popular: true },
]

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Restaurant | null>(null)
  const [modal, setModal] = useState<'login' | 'signup' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>(restaurants)
  const [dishData, setDishData] = useState<Dish[]>(dishes)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('restaurants').select('*'),
      supabase.from('menu_items').select('*').eq('available', true),
    ]).then(([restaurantResult, menuResult]) => {
      if (restaurantResult.data?.length) {
        setRestaurantData(restaurantResult.data.map((r: any) => ({
          id: r.id, name: r.name, cuisine: r.cuisine, description: r.description ?? '',
          image: r.image_url ?? '', rating: String(r.rating ?? '4.5'),
          time: r.delivery_minutes ?? '20–30 min', price: r.price_level ?? '$', featured: !!r.featured,
        })))
      }
      if (menuResult.data?.length) {
        setDishData(menuResult.data.map((d: any) => ({
          id: d.id, restaurantId: d.restaurant_id, name: d.name, description: d.description ?? '',
          category: d.category ?? 'Popular', price: Number(d.price), image: d.image_url ?? '',
          vegetarian: !!d.is_vegetarian, popular: !!d.is_popular,
        })))
      }
    })
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? ''))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? '')
    })
    return () => subscription.unsubscribe()
  }, [])

  const categories = ['All', 'Indian', 'Italian', 'Healthy', 'Japanese']
  const filtered = useMemo(() => restaurantData.filter(r =>
    (category === 'All' || r.cuisine.toLowerCase().includes(category.toLowerCase())) &&
    (r.name + ' ' + r.cuisine + ' ' + r.description).toLowerCase().includes(query.toLowerCase())
  ), [category, query])
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = dishData.reduce((sum, dish) => sum + dish.price * (cart[dish.id] || 0), 0)
  const menuItems = selected ? dishData.filter(d => d.restaurantId === selected.id) : []

  async function authenticate(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true); setAuthMessage('')
    if (!supabase) {
      setAuthMessage('Authentication is not connected yet. Add your Supabase URL and anon key to the Vercel environment variables.')
      setBusy(false); return
    }
    const result = modal === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (result.error) setAuthMessage(result.error.message)
    else {
      setUserEmail(result.data.session?.user.email ?? '')
      setAuthMessage(modal === 'signup' ? 'Account created! Check your email if confirmation is enabled.' : 'You are now signed in.')
      if (modal === 'login') setModal(null)
    }
    setBusy(false)
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUserEmail('')
  }

  function toggleFavorite(id: string) {
    setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])
  }
  function addToCart(id: string) {
    setCart(current => ({ ...current, [id]: (current[id] || 0) + 1 }))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setSelected(null)}><span className="brand-mark"><ChefHat size={21}/></span><span>foodie<span className="brand-accent">hub</span></span></a>
        <div className="location"><MapPin size={16}/><span>Discover great food near you</span></div>
        <div className="header-actions">
          <button className="icon-button cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19}/>{cartCount > 0 && <b className="cart-count">{cartCount}</b>}</button>
          {userEmail ? <button className="account-button" onClick={() => void signOut()}><UserRound size={17}/><span>Sign out</span></button> : <button className="login-button" onClick={() => { setModal('login'); setAuthMessage('') }}><LogIn size={17}/> Log in</button>}
          <button className="icon-button mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu size={21}/></button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"/> GOOD FOOD. GOOD MOOD.</div>
            <h1>Your next favorite<br/><em>meal</em> is waiting.</h1>
            <p>Find the neighborhood spots, crave-worthy dishes, and little food discoveries worth sharing.</p>
            <div className="hero-search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search restaurants or cuisines..."/><button onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}>Explore</button></div>
            <div className="hero-note"><span><Star size={14} fill="currentColor"/> Curated local favorites</span><span><Clock3 size={14}/> Menus at a glance</span></div>
          </div>
          <div className="hero-art"><div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=90" alt="A colorful table of delicious food"/><div className="floating-note"><span className="note-icon"><Flame size={17}/></span><span><b>Made for food lovers</b><small>Discover something delicious</small></span></div></div><div className="hero-stamp">FRESH<br/>FINDS <span>✳</span></div></div>
        </section>

        <section className="content-section" id="restaurants">
          <div className="section-heading"><div><div className="eyebrow">THE GOOD STUFF</div><h2>Explore restaurants</h2><p>Good places. Great plates. Your kind of flavor.</p></div><span className="result-count">{filtered.length} places to explore</span></div>
          <div className="category-row">{categories.map(item => <button key={item} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => setCategory(item)}>{item === 'All' ? '✳' : item === 'Healthy' ? '🥑' : item === 'Italian' ? '🍝' : item === 'Japanese' ? '🍣' : '🍛'} {item}</button>)}</div>
          <div className="restaurant-grid">{filtered.map((restaurant, index) => <article className="restaurant-card" key={restaurant.id} style={{ animationDelay: index * 70 + 'ms' }}><button className="restaurant-image" onClick={() => setSelected(restaurant)}><img src={restaurant.image} alt={restaurant.name}/>{restaurant.featured && <span className="image-tag">COMMUNITY FAVORITE</span>}<span className="image-arrow"><ArrowRight size={18}/></span></button><div className="restaurant-info"><div className="restaurant-title-row"><h3>{restaurant.name}</h3><button className={favorites.includes(restaurant.id) ? 'favorite active' : 'favorite'} onClick={() => toggleFavorite(restaurant.id)} aria-label="Save restaurant"><Heart size={18} fill={favorites.includes(restaurant.id) ? 'currentColor' : 'none'}/></button></div><p>{restaurant.cuisine}</p><div className="restaurant-meta"><span className="rating"><Star size={14} fill="currentColor"/> {restaurant.rating}</span><span><Clock3 size={14}/> {restaurant.time}</span><span>{restaurant.price}</span></div><button className="menu-link" onClick={() => setSelected(restaurant)}>View menu <ArrowRight size={15}/></button></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Search size={28}/><h3>No places found</h3><p>Try another restaurant name or cuisine.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</button></div>}
        </section>

        <section className="feature-strip"><div className="feature-icon"><Leaf size={23}/></div><div><b>A little something for every craving.</b><p>From comfort classics to fresh, feel-good favorites.</p></div><button onClick={() => { setCategory('All'); document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' }) }}>Find your flavor <ArrowRight size={16}/></button></section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><ChefHat size={18}/></span><span>foodie<span className="brand-accent">hub</span></span></a><span>Made with an appetite for discovery.</span><span>© 2026 FoodieHub</span></footer>

      {selected && <div className="overlay" onClick={() => setSelected(null)}><section className="menu-modal" onClick={e => e.stopPropagation()}><div className="menu-cover"><img src={selected.image} alt={selected.name}/><button className="close-button" onClick={() => setSelected(null)}><X size={20}/></button><div className="menu-cover-title"><span>{selected.cuisine}</span><h2>{selected.name}</h2></div></div><div className="menu-body"><div className="menu-intro"><p>{selected.description}</p><div className="menu-stats"><span><Star size={14} fill="currentColor"/> {selected.rating}</span><span><Clock3 size={14}/> {selected.time}</span></div></div><div className="menu-section-title"><div><span className="eyebrow">MADE FRESH</span><h3>Our menu</h3></div><span>{menuItems.length} dishes</span></div><div className="dish-list">{menuItems.map(dish => <article className="dish-card" key={dish.id}><img src={dish.image} alt={dish.name}/><div className="dish-details"><div className="dish-labels">{dish.popular && <span className="popular-label"><Flame size={11}/> POPULAR</span>}{dish.vegetarian && <span className="veg-label"><Leaf size={11}/> VEG</span>}</div><h4>{dish.name}</h4><p>{dish.description}</p><b>${dish.price.toFixed(2)}</b></div><button className="add-button" onClick={() => addToCart(dish.id)}>+</button></article>)}</div></div></section></div>}

      {modal && <div className="overlay auth-overlay" onClick={() => setModal(null)}><section className="auth-modal" onClick={e => e.stopPropagation()}><button className="close-button dark-close" onClick={() => setModal(null)}><X size={19}/></button><div className="auth-icon"><LockKeyhole size={23}/></div><div className="eyebrow">WELCOME TO FOODIEHUB</div><h2>{modal === 'login' ? 'Good to see you.' : 'Join the table.'}</h2><p>{modal === 'login' ? 'Log in to save your favorite places.' : 'Create an account and keep your favorites close.'}</p><form onSubmit={authenticate}><label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"/></label><button className="submit-button" disabled={busy}>{busy ? 'Please wait…' : modal === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={16}/></button></form>{authMessage && <div className="auth-message">{authMessage}</div>}<div className="auth-switch">{modal === 'login' ? 'New to FoodieHub?' : 'Already have an account?'} <button onClick={() => { setModal(modal === 'login' ? 'signup' : 'login'); setAuthMessage('') }}>{modal === 'login' ? 'Create an account' : 'Log in'}</button></div></section></div>}

      {cartOpen && <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}><section className="cart-panel" onClick={e => e.stopPropagation()}><div className="cart-heading"><div><span className="eyebrow">YOUR PICKS</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>{cartCount === 0 ? <div className="empty-cart"><ShoppingBag size={35}/><h3>Your bag is taking a break.</h3><p>Add a dish or two from a restaurant menu.</p></div> : <><div className="cart-items">{dishData.filter(d => cart[d.id]).map(d => <div className="cart-line" key={d.id}><img src={d.image} alt=""/><div><b>{d.name}</b><small>${d.price.toFixed(2)} each</small><div className="quantity"><button onClick={() => setCart(c => ({ ...c, [d.id]: Math.max(0, (c[d.id] || 0) - 1) }))}>−</button><span>{cart[d.id]}</span><button onClick={() => addToCart(d.id)}>+</button></div></div><strong>${(d.price * cart[d.id]).toFixed(2)}</strong></div>)}</div><div className="cart-total"><span>Estimated total</span><b>${cartTotal.toFixed(2)}</b></div><p className="cart-disclaimer">Demo cart only — checkout and payments are not enabled.</p></>}</section></div>}

      {mobileMenu && <div className="mobile-menu"><button onClick={() => { setModal('login'); setMobileMenu(false) }}>Log in</button><button onClick={() => { setCartOpen(true); setMobileMenu(false) }}>Your bag ({cartCount})</button></div>}
    </div>
  )
}
