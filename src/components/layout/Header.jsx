import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Sparkles, X, ChevronRight, Tag, Settings } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../context/ProductContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

export function Header() {
  const { totalItemsCount } = useCart();
  const { products } = useProducts();
  const { config } = useSiteConfig();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/catalogo?busca=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/produto/${productId}`);
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-all py-1.5 px-3 rounded-lg ${
      isActive
        ? 'text-brand-500 font-bold bg-brand-50 border-b-2 border-brand-500'
        : 'text-slate-700 hover:text-brand-500 hover:bg-slate-50'
    }`;

  const topNoticeText = config?.storeInfo?.topNotice || "XM Calçados — Loja Oficial | Parcele em até 10x sem juros | Frete Grátis acima de R$ 199";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Dynamic Top Banner Notice */}
      <div className="bg-brand-900 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent-orange animate-pulse" />
        <span>{topNoticeText}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src="/logo.png"
              alt={config?.storeInfo?.name || "XM Calçados Logo"}
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Search Bar with Live Autocomplete */}
          <div className="flex-1 max-w-lg relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setIsSearchOpen(true)}
                placeholder="Buscar por tênis, sapatos, sandálias, marcas..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500 p-1">
                  <Search className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown Overlay */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Sugestões encontradas ({searchResults.length})</span>
                      <span className="text-brand-500 font-normal">Pressione Enter para ver tudo</span>
                    </div>

                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between group transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-500 transition-colors line-clamp-1">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-600">
                                {product.category}
                              </span>
                              <span>• {product.brand}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 block">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                          {product.discount > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <Tag className="w-2.5 h-2.5" /> -{product.discount}%
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2.5 bg-slate-50 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1 border-t border-slate-100"
                    >
                      Ver todos os resultados para "{searchQuery}" <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Nenhum produto encontrado para "<strong className="text-slate-800">{searchQuery}</strong>"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions: Painel Admin, Minha Conta, Carrinho */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <NavLink
              to="/admin"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 px-3 py-2 rounded-xl transition-colors border border-slate-200"
              title="Painel Admin - Produtos & Layout"
            >
              <Settings className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Painel Admin</span>
            </NavLink>

            <NavLink
              to="/cliente"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-brand-500 transition-colors p-1.5 rounded-xl hover:bg-slate-50"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800">Conta</span>
            </NavLink>

            <NavLink
              to="/carrinho"
              className="relative flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-500 transition-colors p-2 rounded-xl hover:bg-slate-50"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-slate-800" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-slate-800">Carrinho</span>
            </NavLink>
          </div>
        </div>

        {/* Category Navigation Menu */}
        <nav className="flex items-center gap-2 sm:gap-4 py-2 border-t border-slate-100 overflow-x-auto text-nowrap scrollbar-none">
          <NavLink to="/" end className={navLinkStyle}>
            Início
          </NavLink>
          <NavLink to="/catalogo" className={navLinkStyle}>
            Todos os Produtos
          </NavLink>
          <NavLink to="/catalogo?categoria=Tênis" className={navLinkStyle}>
            Tênis
          </NavLink>
          <NavLink to="/catalogo?categoria=Sapatos Sociais" className={navLinkStyle}>
            Sapatos Sociais
          </NavLink>
          <NavLink to="/catalogo?categoria=Sandálias" className={navLinkStyle}>
            Sandálias
          </NavLink>
          <NavLink to="/catalogo?categoria=Infantil" className={navLinkStyle}>
            Infantil
          </NavLink>
          <NavLink to="/catalogo?categoria=Esportivo" className={navLinkStyle}>
            Esportivo
          </NavLink>
          
          <div className="ml-auto flex items-center gap-3 pl-4 border-l border-slate-200">
            <NavLink to="/admin" className="text-xs font-bold text-brand-600 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Editar Layout
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
