import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  Heart,
  Check,
  ChevronRight,
  Ruler,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';

export function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0];
  }, [id, products]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"
    ];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 40);
  const [selectedColor, setSelectedColor] = useState(product?.colors ? product.colors[0] : 'Padrão');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(product.sizes ? product.sizes[0] : 40);
      setSelectedColor(product.colors ? product.colors[0] : 'Padrão');
      setQuantity(1);
      setShippingResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Produto não encontrado</h2>
        <Link to="/catalogo" className="mt-4 inline-block bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold">
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleCalculateShipping = (e) => {
    e.preventDefault();
    if (cep.trim().length >= 8) {
      setShippingResult([
        { type: 'Frete Econômico', price: 'GRÁTIS (compras > R$ 199)', days: '3 a 5 dias úteis' },
        { type: 'Frete Express (Sedex)', price: 'R$ 14,90', days: '1 a 2 dias úteis' }
      ]);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const mockReviews = [
    {
      id: 1,
      name: "Carlos Eduardo S.",
      date: "02 de Agosto, 2026",
      rating: 5,
      title: "Excelente qualidade e extremamente confortável!",
      comment: "Comprei para usar no dia a dia e superou minhas expectativas. A entrega da loja foi super rápida.",
      recommended: true,
      verified: true
    },
    {
      id: 2,
      name: "Mariana Alvez",
      date: "28 de Julho, 2026",
      rating: 5,
      title: "Tamanho exato e produto idêntico às fotos",
      comment: "A cor é linda e o calce é perfeito. Já é meu segundo par comprado na loja XM Calçados.",
      recommended: true,
      verified: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-600">Início</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/catalogo" className="hover:text-slate-600">Catálogo</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-slate-600">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-brand-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                -{product.discount}% OFF
              </span>
            )}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-slate-400 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Ângulo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
                </div>
                <span>({product.reviewsCount} avaliações)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {product.installments || `10x de R$ ${(product.price / 10).toFixed(2).replace('.', ',')} sem juros`}
              </p>
              <p className="text-[11px] text-slate-500">
                ou <strong className="text-slate-800">R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}</strong> no Pix (5% de desconto)
              </p>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Cor: <span className="font-normal text-slate-600">{selectedColor}</span></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedColor === color
                        ? 'bg-slate-900 border-slate-900 text-white shadow'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-700">Tamanho Disponível:</span>
                <button className="text-brand-600 font-semibold flex items-center gap-1 hover:underline">
                  <Ruler className="w-3.5 h-3.5" /> Guia de Tamanhos
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                      selectedSize === size
                        ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25 scale-105'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-brand-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantidade:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedToast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02]'
                  }`}
                >
                  {addedToast ? (
                    <> <Check className="w-4 h-4" /> Adicionado ao Carrinho </>
                  ) : (
                    <> <ShoppingBag className="w-4 h-4" /> Adicionar ao Carrinho </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl font-extrabold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" /> Comprar Agora
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <Truck className="w-4 h-4 text-brand-500" /> Calcular Frete e Prazo de Entrega
              </label>
              
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input
                  type="text"
                  maxLength="9"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  OK
                </button>
              </form>

              {shippingResult && (
                <div className="mt-3 space-y-1.5 text-xs">
                  {shippingResult.map((res, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700">{res.type} ({res.days}):</span>
                      <span className="font-extrabold text-emerald-600">{res.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> Produto vendido e entregue diretamente por XM Calçados com garantia de fábrica.
            </div>
          </div>

        </div>

      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Descrição & Especificações do Produto</h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {product.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Categoria</span>
            <span className="font-bold text-slate-800">{product.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Gênero</span>
            <span className="font-bold text-slate-800">{product.gender || 'Unissex'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Garantia</span>
            <span className="font-bold text-slate-800">90 dias contra defeitos</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Origem</span>
            <span className="font-bold text-slate-800">Nacional (Fabricação Própria)</span>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Avaliações dos Clientes</h3>
            <p className="text-xs text-slate-500 mt-1">Opiniões de quem comprou este calçado na XM Calçados</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="text-3xl font-black text-slate-900">{product.rating}</span>
              <div className="flex text-amber-400 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              Escrever Avaliação
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3 h-3" /> Comprador Verificado
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">{rev.date}</span>
              </div>

              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>

              <h4 className="font-bold text-sm text-slate-800">{rev.title}</h4>
              <p className="text-xs text-slate-600">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Produtos Relacionados em <span className="text-brand-500">{product.category}</span>
            </h3>
            <Link to={`/catalogo?categoria=${product.category}`} className="text-xs font-bold text-brand-600 hover:underline">
              Ver mais
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
