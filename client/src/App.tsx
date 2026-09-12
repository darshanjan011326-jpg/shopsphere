import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Heart,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Toaster, toast } from "sonner";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  tone: string;
  description: string;
  stock: number;
};

type CartLine = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: "Arc wireless headphones",
    category: "Electronics",
    price: 129,
    originalPrice: 179,
    rating: 4.9,
    reviews: 214,
    badge: "Best seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    tone: "#dce7f3",
    description: "Immersive studio sound, cloud-soft memory foam, and 32 hours of battery life for the journeys between here and everywhere.",
    stock: 23,
  },
  {
    id: 2,
    name: "Luna ceramic set",
    category: "Home",
    price: 68,
    rating: 4.8,
    reviews: 86,
    badge: "New arrival",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85",
    tone: "#ece3d3",
    description: "A tactile, hand-finished set of four ceramic cups with a gently irregular silhouette and warm matte glaze.",
    stock: 14,
  },
  {
    id: 3,
    name: "Everyday canvas tote",
    category: "Accessories",
    price: 44,
    originalPrice: 58,
    rating: 4.7,
    reviews: 132,
    badge: "-24%",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
    tone: "#e2d5c6",
    description: "A structured everyday carryall, cut from sturdy organic canvas and finished with vegetable-tanned leather details.",
    stock: 36,
  },
  {
    id: 4,
    name: "Aster desk lamp",
    category: "Home",
    price: 92,
    rating: 4.6,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    tone: "#e4e7db",
    description: "Sculptural light for slow mornings and late nights, with a dimmable warm LED and a quiet brass switch.",
    stock: 8,
  },
  {
    id: 5,
    name: "Haven linen overshirt",
    category: "Fashion",
    price: 116,
    originalPrice: 148,
    rating: 4.8,
    reviews: 73,
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
    tone: "#e9ded4",
    description: "Relaxed linen with a soft washed hand-feel. An easy layer built for bright days and golden evenings.",
    stock: 11,
  },
  {
    id: 6,
    name: "Serein facial ritual",
    category: "Beauty",
    price: 76,
    rating: 4.9,
    reviews: 191,
    badge: "Customer favorite",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
    tone: "#eadedc",
    description: "A three-step ritual of cleansing balm, botanical mist, and barrier cream for calm, luminous skin.",
    stock: 29,
  },
  {
    id: 7,
    name: "Field notes journal",
    category: "Stationery",
    price: 24,
    rating: 4.7,
    reviews: 59,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85",
    tone: "#e5e0d3",
    description: "A linen-bound notebook with 160 pages of warm ivory paper, ready for lists, sketches, and loose ideas.",
    stock: 41,
  },
  {
    id: 8,
    name: "Mori travel bottle",
    category: "Accessories",
    price: 32,
    originalPrice: 42,
    rating: 4.6,
    reviews: 108,
    badge: "-24%",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",
    tone: "#dfe8e3",
    description: "Double-wall stainless steel, made to keep your daily pour cool for 24 hours and warm for 12.",
    stock: 18,
  },
];

const categories = [
  { name: "Electronics", count: "24 pieces", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80" },
  { name: "Fashion", count: "48 pieces", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80" },
  { name: "Home", count: "36 pieces", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" },
  { name: "Beauty", count: "19 pieces", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80" },
];

const money = (value: number) => `$${value.toFixed(2)}`;

function Logo() {
  return (
    <Link href="/" className="brand" aria-label="ShopSphere home">
      <span className="brand-mark">S</span>
      <span>shopsphere</span>
    </Link>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function Header({ cartCount, wishlistCount, onMenu }: { cartCount: number; wishlistCount: number; onMenu: () => void }) {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`;
  };
  return (
    <>
      <div className="announcement"><span><Sparkles size={13} /> Complimentary delivery on orders over $75</span><span className="announcement-right">The autumn edit is here <ArrowRight size={13} /></span></div>
      <header className="site-header">
        <div className="header-inner">
          <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={21} /></button>
          <Logo />
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/shop" className={location.startsWith("/shop") ? "active" : ""}>Shop</Link>
            <Link href="/categories" className={location === "/categories" ? "active" : ""}>Categories</Link>
            <Link href="/about" className={location === "/about" ? "active" : ""}>Our story</Link>
          </nav>
          <div className="header-actions">
            <button className="header-action search-toggle" onClick={() => setSearchOpen((value) => !value)} aria-label="Search"><Search size={19} /></button>
            <Link href="/wishlist" className="header-action count-action" aria-label="Wishlist"><Heart size={19} /><span>{wishlistCount}</span></Link>
            <Link href="/cart" className="header-action count-action" aria-label="Cart"><ShoppingBag size={19} /><span>{cartCount}</span></Link>
            <Link href="/profile" className="avatar-link" aria-label="Profile"><span className="avatar">AM</span></Link>
          </div>
        </div>
        {searchOpen && <form className="search-panel" onSubmit={navigate}><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, categories, and more" /><button type="button" onClick={() => setSearchOpen(false)}><X size={18} /></button></form>}
      </header>
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <div className="mobile-drawer-backdrop" onClick={onClose}><aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-top"><Logo /><button onClick={onClose} className="icon-button"><X size={21} /></button></div><nav><Link href="/shop" onClick={onClose}>Shop <ArrowRight size={16} /></Link><Link href="/categories" onClick={onClose}>Categories <ArrowRight size={16} /></Link><Link href="/about" onClick={onClose}>Our story <ArrowRight size={16} /></Link><Link href="/admin" onClick={onClose}>Admin workspace <ArrowRight size={16} /></Link></nav><div className="drawer-footer"><p>Everything you need,<br />all in one place.</p><span>© 2026 ShopSphere</span></div></aside></div>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Logo /><p className="footer-note">Thoughtful goods for<br />everyday living.</p></div><div className="footer-column"><strong>Explore</strong><Link href="/shop">Shop all</Link><Link href="/categories">Categories</Link><Link href="/about">Our story</Link></div><div className="footer-column"><strong>Support</strong><a href="#">Shipping & returns</a><a href="#">Help center</a><a href="#">Contact us</a></div><div className="footer-newsletter"><strong>Stay in the know</strong><p>Monthly notes on new arrivals, thoughtful living, and little things worth keeping.</p><form onSubmit={(event) => { event.preventDefault(); toast.success("You're on the list."); }}><input placeholder="Your email address" type="email" required /><button aria-label="Subscribe"><ArrowRight size={17} /></button></form></div></div><div className="footer-bottom"><span>© 2026 ShopSphere Studio</span><span>Privacy <i>·</i> Terms <i>·</i> Instagram</span></div></footer>;
}

function ProductCard({ product, onAdd, onWishlist, wished }: { product: Product; onAdd: (product: Product) => void; onWishlist: (id: number) => void; wished: boolean }) {
  return <article className="product-card"><div className="product-image-wrap" style={{ background: product.tone }}><Link href={`/products/${product.id}`}><img src={product.image} alt={product.name} /></Link>{product.badge && <Badge className="product-badge">{product.badge}</Badge>}<button className={`wish-button ${wished ? "wished" : ""}`} onClick={() => onWishlist(product.id)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}><Heart size={18} fill={wished ? "currentColor" : "none"} /></button><button className="quick-add" onClick={() => onAdd(product)}>Quick add <PlusIcon /></button></div><div className="product-meta"><div className="product-category">{product.category}<span className="rating"><Star size={12} fill="currentColor" /> {product.rating}</span></div><Link href={`/products/${product.id}`} className="product-name">{product.name}</Link><div className="product-price">{money(product.price)} {product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div></article>;
}

function PlusIcon() { return <span className="plus-icon">+</span>; }

function HomePage({ onAdd, onWishlist, wishlist }: { onAdd: (product: Product) => void; onWishlist: (id: number) => void; wishlist: number[] }) {
  return <main>
    <section className="hero-section"><div className="hero-copy"><Badge>THE EVERYDAY EDIT · 2026</Badge><h1>Small things,<br /><em>beautifully</em> chosen.</h1><p>Thoughtful goods for a considered life. Discover pieces with a point of view, made to be lived with and loved for longer.</p><div className="hero-actions"><Link href="/shop" className="button button-dark">Explore the edit <ArrowRight size={17} /></Link><Link href="/categories" className="text-link">Browse categories <ArrowRight size={15} /></Link></div><div className="hero-proof"><div className="proof-avatars"><span>AL</span><span>MK</span><span>JS</span></div><div><strong>Loved by 12,000+ curious people</strong><p>★★★★★ <span>4.9 average rating</span></p></div></div></div><div className="hero-visual"><div className="hero-photo main-photo"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=88" alt="Minimal watch and everyday objects on a table" /></div><div className="hero-note"><span>01</span><strong>Objects<br />with intention</strong><ArrowRight size={17} /></div><div className="hero-sticker"><span>EST.</span><strong>2021</strong></div></div></section>
    <section className="logo-strip"><span>AS SEEN IN</span><strong>nordic living</strong><strong>FORM / FUNCTION</strong><strong>the mindful edit</strong><strong>STUDIO NOTES</strong></section>
    <section className="section-block category-section"><div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Shop by feeling</h2></div><Link href="/categories" className="text-link">View all categories <ArrowRight size={15} /></Link></div><div className="category-grid">{categories.map((category, index) => <Link href={`/shop?category=${category.name}`} className={`category-tile tile-${index}`} key={category.name}><img src={category.image} alt={category.name} /><div className="category-overlay"><span>{category.count}</span><strong>{category.name}</strong><ArrowRight size={16} /></div></Link>)}</div></section>
    <section className="section-block product-section"><div className="section-heading"><div><span className="eyebrow">THE SHORTLIST</span><h2>Currently coveting</h2></div><Link href="/shop" className="text-link">Shop all products <ArrowRight size={15} /></Link></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onWishlist={onWishlist} wished={wishlist.includes(product.id)} />)}</div></section>
    <section className="editorial-banner"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1100&q=85" alt="Warm, curated interior" /></div><div className="editorial-copy"><span className="eyebrow">THE SHOPSPHERE JOURNAL</span><h2>Make room<br />for <em>better.</em></h2><p>From the things we bring home to the rituals we keep, a slower approach to everyday living can start with one considered choice.</p><Link href="/about" className="button button-outline">Read our story <ArrowRight size={16} /></Link></div></section>
    <section className="section-block promise-section"><div className="section-heading centered"><div><span className="eyebrow">WHY SHOPSPHERE</span><h2>Designed for the long haul.</h2></div></div><div className="promise-grid"><div><ShieldCheck size={23} /><strong>Considered quality</strong><p>We choose useful, well-made pieces with a story behind them.</p></div><div><Truck size={23} /><strong>Easy, always</strong><p>Fast delivery, simple returns, and real humans when you need us.</p></div><div><Heart size={23} /><strong>Good to have around</strong><p>Products that earn their place in your home and daily rhythm.</p></div></div></section>
  </main>;
}

function ShopPage({ onAdd, onWishlist, wishlist }: { onAdd: (product: Product) => void; onWishlist: (id: number) => void; wishlist: number[] }) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialCategory = params.get("category") || "All products";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("Featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const filtered = useMemo(() => {
    let list = products.filter((product) => (category === "All products" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Price: low to high") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, query, sort]);
  return <main className="page-shell"><div className="page-intro"><span className="eyebrow">THE FULL COLLECTION</span><h1>Find your next <em>favourite.</em></h1><p>Good-looking, useful things for the way you live now.</p></div><div className="shop-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></div><div className="toolbar-controls"><button className={`filter-button ${filterOpen ? "active" : ""}`} onClick={() => setFilterOpen((value) => !value)}>Filters <Settings2 size={16} /></button><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Top rated</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={15} /></label></div></div>{filterOpen && <div className="filter-row"><div><span>Category</span><div className="filter-pills">{["All products", "Electronics", "Fashion", "Home", "Beauty", "Accessories", "Stationery"].map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><button className="clear-button" onClick={() => { setCategory("All products"); setQuery(""); }}>Clear all</button></div>}<div className="results-row"><span>{filtered.length} pieces</span><span className="view-toggle"><span className="active">▦</span> <span>☷</span></span></div>{filtered.length ? <div className="product-grid shop-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onWishlist={onWishlist} wished={wishlist.includes(product.id)} />)}</div> : <div className="empty-state"><Search size={28} /><h3>Nothing matched that search.</h3><p>Try a different word or clear the filters to see the full collection.</p><button className="button button-dark" onClick={() => { setQuery(""); setCategory("All products"); }}>View all products</button></div>}</main>;
}

function ProductPage({ product, onAdd, onWishlist, wished }: { product: Product; onAdd: (product: Product) => void; onWishlist: (id: number) => void; wished: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Description");
  return <main className="page-shell product-detail"><Link href="/shop" className="back-link"><ChevronLeft size={16} /> Back to collection</Link><div className="detail-grid"><div className="detail-image"><img src={product.image} alt={product.name} /><Badge className="detail-badge">{product.badge || "Thoughtfully selected"}</Badge></div><div className="detail-copy"><div className="product-category">{product.category} <span className="detail-rating"><Star size={14} fill="currentColor" /> {product.rating} <u>{product.reviews} reviews</u></span></div><h1>{product.name}</h1><p className="detail-lede">{product.description}</p><div className="detail-price">{money(product.price)} {product.originalPrice && <><del>{money(product.originalPrice)}</del><Badge className="sale-badge">Save {money(product.originalPrice - product.price)}</Badge></>}</div><div className="stock-line"><span className="stock-dot" /> In stock · ships within 2 business days</div><div className="detail-divider" /><div className="buy-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button></div><button className="button button-dark buy-button" onClick={() => { onAdd({ ...product }); toast.success(`${product.name} added to your bag.`); }}>Add to bag <ShoppingBag size={17} /></button><button className={`heart-outline ${wished ? "wished" : ""}`} onClick={() => onWishlist(product.id)} aria-label="Wishlist"><Heart size={19} fill={wished ? "currentColor" : "none"} /></button></div><div className="detail-accordions">{["Description", "Details & materials", "Shipping & returns"].map((item) => <div className="accordion-item" key={item}><button onClick={() => setTab(tab === item ? "" : item)}><span>{item}</span>{tab === item ? <X size={17} /> : <PlusIcon />}</button>{tab === item && <p>{item === "Description" ? product.description : item === "Details & materials" ? "Designed with durable materials and a quiet, considered finish. Every detail is selected to wear beautifully over time." : "Complimentary delivery over $75. Returns are easy within 30 days of delivery."}</p>}</div>)}</div></div></div><section className="reviews-preview"><div><span className="eyebrow">FROM THE COMMUNITY</span><h2>Looks even better<br />in real life.</h2></div><div className="review-quote"><div className="stars">★★★★★</div><p>“The kind of object that makes a small everyday moment feel a bit more special. Beautifully packaged too.”</p><strong>— Maya R. · Verified buyer</strong></div></section></main>;
}

function CartPage({ cart, updateCart, removeCart, onCheckout }: { cart: CartLine[]; updateCart: (id: number, delta: number) => void; removeCart: (id: number) => void; onCheckout: () => void }) {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7;
  const total = subtotal + shipping;
  return <main className="page-shell cart-page"><div className="page-title-row"><div><span className="eyebrow">YOUR SELECTION</span><h1>Your bag <span>({cart.reduce((sum, line) => sum + line.quantity, 0)})</span></h1></div><Link href="/shop" className="text-link"><ChevronLeft size={15} /> Continue shopping</Link></div>{cart.length ? <div className="cart-layout"><div className="cart-lines">{cart.map((line) => <div className="cart-line" key={line.id}><img src={line.image} alt={line.name} /><div className="cart-line-info"><span>{line.category}</span><h3>{line.name}</h3><p>{money(line.price)}</p><div className="cart-line-actions"><div className="quantity small"><button onClick={() => updateCart(line.id, -1)}>−</button><span>{line.quantity}</span><button onClick={() => updateCart(line.id, 1)}>+</button></div><button onClick={() => removeCart(line.id)} className="remove-link">Remove</button></div></div><strong>{money(line.price * line.quantity)}</strong></div>)}<div className="cart-benefit"><Zap size={18} /><span><strong>You're {subtotal >= 75 ? "all set" : money(75 - subtotal) + " away"}</strong> from complimentary delivery.</span></div></div><aside className="summary-card"><h2>Summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>{shipping === 0 ? "Complimentary" : money(shipping)}</strong></div><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="button button-dark full-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button><p className="secure-note"><ShieldCheck size={14} /> Secure checkout · Taxes calculated at checkout</p></aside></div> : <div className="empty-state cart-empty"><ShoppingBag size={34} /><h3>Your bag is waiting.</h3><p>When you find something you love, it will appear here.</p><Link href="/shop" className="button button-dark">Start exploring <ArrowRight size={16} /></Link></div>}</main>;
}

function WishlistPage({ wishlist, onAdd, onWishlist }: { wishlist: number[]; onAdd: (product: Product) => void; onWishlist: (id: number) => void }) {
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <main className="page-shell"><div className="page-intro compact"><span className="eyebrow">YOUR SAVED PIECES</span><h1>A little <em>wishlist.</em></h1><p>Keep the good things close until you're ready.</p></div>{saved.length ? <div className="product-grid shop-grid">{saved.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} onWishlist={onWishlist} wished />)}</div> : <div className="empty-state"><Heart size={30} /><h3>Nothing saved yet.</h3><p>Tap the heart on anything that catches your eye.</p><Link href="/shop" className="button button-dark">Browse the edit</Link></div>}</main>;
}

function CheckoutPage({ cart, onBack, onComplete }: { cart: CartLine[]; onBack: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("card");
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  return <main className="page-shell checkout-page"><div className="checkout-head"><div><span className="eyebrow">A FEW FINAL DETAILS</span><h1>Checkout</h1></div><div className="checkout-steps"><span className={step >= 1 ? "active" : ""}>01 <b>Delivery</b></span><i /> <span className={step >= 2 ? "active" : ""}>02 <b>Payment</b></span><i /> <span className={step >= 3 ? "active" : ""}>03 <b>Complete</b></span></div></div><div className="checkout-layout"><div className="checkout-form">{step === 1 && <><h2>Where should we send it?</h2><p className="form-intro">Your details are used only to make this delivery happen smoothly.</p><div className="form-grid"><label>First name<input placeholder="Amelia" /></label><label>Last name<input placeholder="Morgan" /></label><label className="span-2">Email address<input type="email" placeholder="amelia@example.com" /></label><label className="span-2">Address<input placeholder="14 Willow Lane" /></label><label>City<input placeholder="New York" /></label><label>ZIP code<input placeholder="10001" /></label></div><div className="checkout-actions"><button className="text-link" onClick={onBack}><ChevronLeft size={15} /> Back to bag</button><button className="button button-dark" onClick={() => setStep(2)}>Continue to payment <ArrowRight size={16} /></button></div></>}{step === 2 && <><h2>How would you like to pay?</h2><p className="form-intro">This is a secure payment simulation for the ShopSphere demo.</p><div className="payment-options"><button className={payment === "card" ? "selected" : ""} onClick={() => setPayment("card")}><CreditCard size={20} /><span><strong>Card</strong><small>Visa, Mastercard, Amex</small></span><span className="radio-dot" /></button><button className={payment === "upi" ? "selected" : ""} onClick={() => setPayment("upi")}><Zap size={20} /><span><strong>UPI / wallet</strong><small>Fast and easy</small></span><span className="radio-dot" /></button><button className={payment === "cod" ? "selected" : ""} onClick={() => setPayment("cod")}><Package size={20} /><span><strong>Cash on delivery</strong><small>Pay when it arrives</small></span><span className="radio-dot" /></button></div>{payment === "card" && <div className="form-grid card-fields"><label className="span-2">Card number<input placeholder="4242 4242 4242 4242" /></label><label>Expiry date<input placeholder="MM / YY" /></label><label>Security code<input placeholder="CVC" /></label></div>}{payment === "upi" && <label className="upi-field">UPI ID<input placeholder="yourname@upi" /></label>}<div className="checkout-actions"><button className="text-link" onClick={() => setStep(1)}><ChevronLeft size={15} /> Back</button><button className="button button-dark" onClick={() => setStep(3)}>Place order <ArrowRight size={16} /></button></div></>}{step === 3 && <div className="success-step"><div className="success-mark"><Check size={28} /></div><span className="eyebrow">ALL SET</span><h2>Order placed beautifully.</h2><p>Your order <strong>#SS-24018</strong> is confirmed. We'll send a little note when it starts its journey.</p><button className="button button-dark" onClick={onComplete}>View my orders <ArrowRight size={16} /></button></div>}</div><aside className="summary-card checkout-summary"><h2>Your order</h2>{cart.map((line) => <div className="mini-line" key={line.id}><img src={line.image} alt="" /><span>{line.name}<small>Qty {line.quantity}</small></span><strong>{money(line.price * line.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><div className="checkout-trust"><ShieldCheck size={17} /><span>Your information is protected<br />with secure encryption.</span></div></aside></div></main>;
}

function OrdersPage() {
  return <main className="page-shell orders-page"><div className="page-title-row"><div><span className="eyebrow">YOUR SHOPSPHERE</span><h1>My orders</h1></div><Link href="/profile" className="text-link">View profile <ArrowRight size={15} /></Link></div><div className="order-card"><div className="order-card-head"><div><Badge className="success-badge">Delivered</Badge><h3>Order #SS-24018</h3><span>Placed on September 12, 2026 · 3 items</span></div><strong>{money(284)}</strong></div><div className="order-products">{products.slice(0, 3).map((product) => <img key={product.id} alt={product.name} src={product.image} />)}</div><div className="order-card-foot"><span><Truck size={15} /> Delivered September 16</span><Link href="/orders/SS-24018" className="button button-outline small-button">View details <ArrowRight size={14} /></Link></div></div><div className="order-card muted-order"><div className="order-card-head"><div><Badge>Processing</Badge><h3>Order #SS-23904</h3><span>Placed on August 29, 2026 · 1 item</span></div><strong>{money(92)}</strong></div><div className="order-card-foot"><span><Package size={15} /> Preparing for dispatch</span><Link href="/shop" className="text-link">Shop again <ArrowRight size={14} /></Link></div></div></main>;
}

function ProfilePage() {
  return <main className="page-shell profile-page"><div className="profile-hero"><div className="profile-avatar">AM</div><div><span className="eyebrow">WELCOME BACK</span><h1>Amelia Morgan</h1><p>amelia.morgan@example.com · Member since 2023</p></div><button className="button button-outline">Edit profile <Settings2 size={15} /></button></div><div className="profile-panels"><div className="profile-nav"><strong>Account</strong><Link className="selected" href="/profile">Overview <ArrowRight size={15} /></Link><Link href="/orders">My orders <ArrowRight size={15} /></Link><Link href="/wishlist">Wishlist <ArrowRight size={15} /></Link><strong>Preferences</strong><a href="#">Addresses <ArrowRight size={15} /></a><a href="#">Notifications <ArrowRight size={15} /></a><a href="#">Security <ArrowRight size={15} /></a></div><div className="profile-overview"><div className="stat-cards"><div><span>Total orders</span><strong>12</strong><small>+2 this month</small></div><div><span>Saved pieces</span><strong>08</strong><small>Across 4 categories</small></div><div><span>Reward points</span><strong>1,240</strong><small>840 until next reward</small></div></div><div className="profile-section-head"><h2>Recent order</h2><Link href="/orders" className="text-link">See all <ArrowRight size={15} /></Link></div><div className="recent-order"><div className="recent-order-icon"><Package size={21} /></div><div><strong>Order #SS-24018</strong><span>3 items · Delivered September 16</span></div><Badge className="success-badge">Delivered</Badge><strong>{money(284)}</strong></div></div></div></main>;
}

function AdminPage() {
  const [range, setRange] = useState("Last 30 days");
  return <main className="admin-shell"><aside className="admin-sidebar"><Logo /><div className="admin-label">Workspace</div><nav><Link href="/admin" className="active"><LayoutDashboard size={17} /> Overview</Link><Link href="/admin/products"><Package size={17} /> Products <span>24</span></Link><Link href="/admin/orders"><ShoppingCart size={17} /> Orders <span>08</span></Link><Link href="/admin/customers"><Users size={17} /> Customers</Link><Link href="/admin/analytics"><BarChart3 size={17} /> Analytics</Link></nav><div className="admin-label">Manage</div><nav><a href="#"><Settings2 size={17} /> Settings</a><a href="#"><Bell size={17} /> Notifications</a></nav><div className="admin-profile"><span className="avatar">AM</span><span><strong>Alex Morgan</strong><small>Administrator</small></span><ChevronDown size={15} /></div></aside><section className="admin-content"><div className="admin-topbar"><div><span className="eyebrow">SATURDAY, SEPTEMBER 12</span><h1>Good morning, Alex <span>✦</span></h1></div><div className="admin-top-actions"><button className="icon-button"><Bell size={18} /></button><button className="button button-dark">Add product <PlusIcon /></button></div></div><div className="admin-stat-grid"><div className="admin-stat featured"><span>Gross revenue <BarChart3 size={17} /></span><strong>$24,890.40</strong><small><b>+18.6%</b> vs last month</small><div className="mini-chart"><i style={{ height: "36%" }} /><i style={{ height: "44%" }} /><i style={{ height: "32%" }} /><i style={{ height: "60%" }} /><i style={{ height: "52%" }} /><i style={{ height: "70%" }} /><i style={{ height: "82%" }} /><i style={{ height: "68%" }} /><i style={{ height: "92%" }} /></div></div><div className="admin-stat"><span>Orders <ShoppingBag size={17} /></span><strong>486</strong><small><b>+12.4%</b> vs last month</small></div><div className="admin-stat"><span>Customers <Users size={17} /></span><strong>2,849</strong><small><b>+8.2%</b> vs last month</small></div><div className="admin-stat"><span>Avg. order value <CreditCard size={17} /></span><strong>$86.42</strong><small><b>+4.1%</b> vs last month</small></div></div><div className="admin-main-grid"><div className="sales-panel"><div className="panel-head"><div><h2>Revenue overview</h2><p>Your store's pulse, at a glance.</p></div><label className="range-select"><select value={range} onChange={(event) => setRange(event.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select><ChevronDown size={14} /></label></div><div className="chart-area"><div className="chart-y"><span>$3k</span><span>$2k</span><span>$1k</span><span>$0</span></div><div className="chart-content"><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><svg viewBox="0 0 700 230" preserveAspectRatio="none" className="sales-chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5b67d9" stopOpacity=".25" /><stop offset="100%" stopColor="#5b67d9" stopOpacity="0" /></linearGradient></defs><path d="M0,180 C45,172 58,136 103,149 S143,96 191,118 S239,152 285,105 S323,88 372,108 S423,74 468,84 S511,122 548,82 S593,54 632,69 S668,27 700,33 L700,230 L0,230 Z" fill="url(#chartFill)" /><path d="M0,180 C45,172 58,136 103,149 S143,96 191,118 S239,152 285,105 S323,88 372,108 S423,74 468,84 S511,122 548,82 S593,54 632,69 S668,27 700,33" fill="none" stroke="#5361d2" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-x"><span>Aug 14</span><span>Aug 21</span><span>Aug 28</span><span>Sep 04</span><span>Sep 12</span></div></div></div></div><div className="side-panel"><div className="panel-head"><div><h2>Top products</h2><p>By revenue this month</p></div><a href="#">View all</a></div>{products.slice(0, 4).map((product, index) => <div className="top-product" key={product.id}><span className="top-rank">0{index + 1}</span><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{[84, 62, 48, 31][index]} sold</small></span><b>{money([3876, 2976, 2160, 1214][index])}</b></div>)}</div></div><div className="admin-bottom-grid"><div className="panel-table"><div className="panel-head"><div><h2>Recent orders</h2><p>The latest activity in your store.</p></div><a href="#">View all</a></div><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{[["#SS-24018", "Amelia Morgan", "Sep 12, 2026", "$284.00", "Delivered"], ["#SS-24017", "Sofia Chen", "Sep 12, 2026", "$129.00", "Processing"], ["#SS-24016", "Jon Bell", "Sep 11, 2026", "$68.00", "Shipped"], ["#SS-24015", "Priya Shah", "Sep 11, 2026", "$216.00", "Delivered"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 4 ? <Badge className={cell === "Delivered" ? "success-badge" : ""}>{cell}</Badge> : cell}</td>)}</tr>)}</tbody></table></div><div className="inventory-panel"><div className="panel-head"><div><h2>Inventory watch</h2><p>Keep the good stuff in stock.</p></div><a href="#">Manage</a></div>{[["Aster desk lamp", 8, "Low stock"], ["Haven linen overshirt", 11, "Healthy"], ["Mori travel bottle", 18, "Healthy"], ["Luna ceramic set", 14, "Healthy"]].map((row) => <div className="inventory-row" key={row[0]}><span className="inventory-dot" /><span><strong>{row[0]}</strong><small>{row[2]}</small></span><b>{row[1]} <small>left</small></b></div>)}</div></div></section></main>;
}

function AboutPage() {
  return <main className="about-page"><section className="about-hero"><span className="eyebrow">A NOTE FROM THE FOUNDERS</span><h1>Better things,<br /><em>less noise.</em></h1><p>ShopSphere started with a simple belief: the things we live with should make life feel better, not busier.</p></section><section className="about-split"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85" alt="Quiet worktable with thoughtful objects" /><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>Useful can still be beautiful.</h2><p>We spend our days looking for the pieces that sit at the intersection of function and feeling. A lamp that makes you want to stay a little longer. A shirt that gets better with every wash. A notebook that gives your thoughts room.</p><p>Every item in our collection is chosen with care, so you can choose with confidence.</p><Link href="/shop" className="button button-dark">Explore the collection <ArrowRight size={16} /></Link></div></section></main>;
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  return <main className="auth-page"><div className="auth-visual"><Logo /><div><span className="eyebrow">WELCOME TO SHOPSPHERE</span><h1>Come for the<br /><em>good things.</em></h1><p>A considered collection for everyday living.</p></div><span className="auth-caption">Objects with intention · Since 2021</span></div><div className="auth-form"><div className="auth-form-inner"><span className="eyebrow">YOUR ACCOUNT</span><h2>Welcome back</h2><p>Sign in to pick up where you left off.</p><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label><div className="auth-row"><label className="checkbox-label"><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div><button className="button button-dark full-button" onClick={onLogin}>Sign in <ArrowRight size={16} /></button><div className="auth-divider"><span>or</span></div><button className="social-button"><span>G</span> Continue with Google</button><p className="auth-switch">New to ShopSphere? <Link href="/register">Create an account</Link></p></div></div></main>;
}

export default function App() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartLine[]>([{ ...products[0], quantity: 1 }]);
  const [wishlist, setWishlist] = useState<number[]>([3, 6]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const addToCart = (product: Product) => { setCart((current) => { const found = current.find((line) => line.id === product.id); return found ? current.map((line) => line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...product, quantity: 1 }]; }); toast.success(`${product.name} added to your bag.`, { description: "You can review it whenever you're ready." }); };
  const toggleWishlist = (id: number) => { setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); toast.success(wishlist.includes(id) ? "Removed from wishlist." : "Saved to your wishlist."); };
  const updateCart = (id: number, delta: number) => setCart((current) => current.map((line) => line.id === id ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line));
  const removeCart = (id: number) => setCart((current) => current.filter((line) => line.id !== id));
  const path = window.location.pathname;
  const productId = Number(path.split("/").pop());
  const product = products.find((item) => item.id === productId) || products[0];
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  if (path.startsWith("/admin")) return <><AdminPage /><Toaster richColors position="bottom-right" /></>;
  const renderPage = () => {
    if (path === "/") return <HomePage onAdd={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} />;
    if (path === "/shop" || path === "/categories") return <ShopPage onAdd={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} />;
    if (path.startsWith("/products/")) return <ProductPage product={product} onAdd={addToCart} onWishlist={toggleWishlist} wished={wishlist.includes(product.id)} />;
    if (path === "/cart") return <CartPage cart={cart} updateCart={updateCart} removeCart={removeCart} onCheckout={() => setLocation("/checkout")} />;
    if (path === "/wishlist") return <WishlistPage wishlist={wishlist} onAdd={addToCart} onWishlist={toggleWishlist} />;
    if (path === "/checkout") return <CheckoutPage cart={cart} onBack={() => setLocation("/cart")} onComplete={() => { setCart([]); setLocation("/orders"); }} />;
    if (path.startsWith("/orders")) return <OrdersPage />;
    if (path === "/profile") return <ProfilePage />;
    if (path === "/about") return <AboutPage />;
    if (path === "/login" || path === "/register") return <LoginPage onLogin={() => { setLoggedIn(true); toast.success("Welcome back, Amelia."); setLocation("/"); }} />;
    return <HomePage onAdd={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} />;
  };
  if (path === "/checkout") return <><div className="minimal-header"><Logo /><span><ShieldCheck size={15} /> Secure checkout</span></div>{renderPage()}<Toaster richColors position="bottom-right" /></>;
  return <div className="app-shell"><Header cartCount={cartCount} wishlistCount={wishlist.length} onMenu={() => setMobileMenu(true)} /><MobileMenu open={mobileMenu} onClose={() => setMobileMenu(false)} />{renderPage()}<Footer /><Toaster richColors position="bottom-right" /></div>;
}
