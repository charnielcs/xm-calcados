import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const defaultSize = product.sizes ? product.sizes[0] : 40;
  const defaultColor = product.colors ? product.colors[0] : 'Padrão';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discount > 0 && (
          <span className="bg-brand-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Tag className="w-3 h-3" /> -{product.discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-slate-900 text-amber-400 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider border border-slate-700 shadow">
            ★ Destaque
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleLike}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:scale-110"
        aria-label="Adicionar aos favoritos"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Image Link */}
      <Link to={`/produto/${product.id}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-xs font-semibold text-white bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 shadow">
            Ver Detalhes
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name & Brand */}
          <Link to={`/produto/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
            {product.brand}
          </span>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
            {product.installments || `10x de R$ ${(product.price / 10).toFixed(2).replace('.', ',')} sem juros`}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25 hover:shadow-md active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Adicionado ao Carrinho
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Adicionar ao Carrinho
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
