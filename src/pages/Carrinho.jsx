import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function Carrinho() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItemsCount } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'XM30') {
      setAppliedCoupon({ code: 'XM30', discount: 30, type: 'fixed', label: 'R$ 30,00 OFF' });
    } else if (code === 'PRIMEIRACOMPRA' || code === 'XM10') {
      setAppliedCoupon({ code: 'XM10', discount: 10, type: 'percent', label: '10% OFF' });
    } else {
      setCouponError('Cupom inválido ou expirado. Tente XM30 ou PRIMEIRACOMPRA');
    }
  };

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'fixed') return appliedCoupon.discount;
    if (appliedCoupon.type === 'percent') return (totalPrice * appliedCoupon.discount) / 100;
    return 0;
  }, [appliedCoupon, totalPrice]);

  // Single shipping calculation for the entire store
  const shippingTotal = totalPrice >= 199 || totalPrice === 0 ? 0 : 15.00;
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingTotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Você ainda não adicionou nenhum calçado ao seu carrinho. Explore nosso catálogo e encontre o par perfeito!
        </p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
        >
          Explorar Calçados <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meu Carrinho
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'} no carrinho)
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Esvaziar Carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* UNIFIED SINGLE ITEM LIST (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 divide-y divide-slate-100">
            {cart.map((item, index) => {
              const itemKey = `${item.id}-${item.size}-${item.color}`;
              return (
                <div
                  key={itemKey || index}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/produto/${item.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-brand-500 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                          Tamanho: {item.size}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                          Cor: {item.color}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-900 sm:hidden">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-l-xl"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-extrabold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-r-xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right hidden sm:block min-w-[90px]">
                      <span className="text-sm font-black text-slate-900 block">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-slate-400">
                          (R$ {item.price.toFixed(2).replace('.', ',')} cada)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(itemKey)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remover produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continuar Comprando
            </Link>
          </div>

        </div>

        {/* ORDER SUMMARY (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Resumo do Pedido
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                <Tag className="w-3.5 h-3.5 text-brand-500" /> Possui Cupom de Desconto?
              </label>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ex: XM30"
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center justify-between border border-emerald-200">
                  <span>Cupom <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.label})</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-rose-600">×</button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium mt-1">{couponError}</p>
              )}
            </div>

            <div className="space-y-3 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos produtos:</span>
                <span className="font-bold text-slate-800">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Frete do Pedido:</span>
                {shippingTotal === 0 ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FRETE GRÁTIS</span>
                ) : (
                  <span className="font-bold text-slate-800">R$ {shippingTotal.toFixed(2).replace('.', ',')}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto de cupom:</span>
                  <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-sm">
                <span className="font-extrabold text-slate-900">Total do Pedido:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 block">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    ou em até 10x de R$ {(finalTotal / 10).toFixed(2).replace('.', ',')} sem juros
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Ir para o Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Ambiente 100% Criptografado & Seguro
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
