import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Zap,
  Mail,
  CheckCircle2,
  Truck,
  ShieldCheck,
  CreditCard,
  Award
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Home() {
  const { products } = useProducts();
  const { config } = useSiteConfig();
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = useMemo(() => {
    return config?.bannerSlides || [];
  }, [config]);

  const featuredCategories = useMemo(() => {
    return config?.featuredCategories || [];
  }, [config]);

  const homeSections = useMemo(() => {
    const sections = config?.homeSections || [];
    return [...sections].sort((a, b) => a.order - b.order);
  }, [config]);

  useEffect(() => {
    if (bannerSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [bannerSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const bestSellers = products.slice(0, 8);

  // Section Renderers
  const renderCarouselSection = () => {
    if (bannerSlides.length === 0) return null;
    return (
      <section key="carousel" className="relative overflow-hidden bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 min-h-[440px] sm:min-h-[480px]">
            
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between p-6 sm:p-12 gap-8 ${
                  index === currentSlide ? 'opacity-100 z-10 pointer-events-auto scale-100' : 'opacity-0 z-0 pointer-events-none scale-95'
                }`}
              >
                {/* Background Subtle Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-brand-900/40 to-slate-950 z-0 pointer-events-none" />

                {/* Left Text Content Column */}
                <div className="relative z-20 max-w-xl text-left space-y-4 flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.tag}
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      to={slide.ctaLink || '/catalogo'}
                      className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-7 py-4 rounded-2xl shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                      {slide.ctaText || 'Aproveitar Ofertas'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/catalogo"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-sm transition-colors"
                    >
                      Ver Catálogo
                    </Link>
                  </div>
                </div>

                {/* Right Hero Product Image Box - Crisp, Visible & Beautiful */}
                <div className="relative z-20 w-full md:w-1/2 h-64 sm:h-80 md:h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group bg-slate-900/60 flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>

              </div>
            ))}

            {/* Navigation Controls */}
            {bannerSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 transition-all hover:scale-110 shadow-xl"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 transition-all hover:scale-110 shadow-xl"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center items-center gap-2">
                  {bannerSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'w-8 bg-brand-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Ir para slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    );
  };

  const renderCategoriesSection = () => {
    if (featuredCategories.length === 0) return null;
    return (
      <section key="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-500 block mb-1">
              Explore por Estilo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Categorias em Destaque
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="text-xs font-bold text-slate-600 hover:text-brand-500 flex items-center gap-1 transition-colors"
          >
            Ver todas as categorias <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id || cat.name}
              to={`/catalogo?categoria=${encodeURIComponent(cat.query || cat.name)}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-4 border border-slate-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="relative z-10 space-y-0.5">
                <span className="text-[11px] font-semibold text-brand-300 block">
                  {cat.count}
                </span>
                <h3 className="text-base font-extrabold text-white group-hover:text-brand-300 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderBestSellersSection = () => (
    <section key="bestSellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Sucessos de Vendas
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mais Vendidos na XM Calçados
          </h2>
        </div>

        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-slate-200"
        >
          Ver Catálogo Completo <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  const renderAdvantagesSection = () => (
    <section key="advantages" className="bg-brand-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="p-3 bg-brand-500 text-white rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Frete Rápido & Seguro</h4>
              <p className="text-xs text-slate-300">Entrega garantida para todo o Brasil</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="p-3 bg-brand-500 text-white rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Parcele em até 10x</h4>
              <p className="text-xs text-slate-300">Sem juros no cartão de crédito</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="p-3 bg-brand-500 text-white rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Garantia Direta de Fábrica</h4>
              <p className="text-xs text-slate-300">90 dias contra qualquer defeito</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="p-3 bg-brand-500 text-white rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Troca Grátis</h4>
              <p className="text-xs text-slate-300">Primeira troca sem custo em 30 dias</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderNewsletterSection = () => (
    <section key="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 flex items-center justify-center md:justify-start gap-1">
            <Mail className="w-4 h-4" /> Desconto Exclusivo
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ganhe <span className="text-brand-500">R$ 30,00 OFF</span> na primeira compra
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Cadastre seu e-mail para receber ofertas secretas, cupons de frete grátis e novidades da loja em primeira mão.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="w-full md:w-auto flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="Digite seu melhor e-mail"
            className="bg-white border border-slate-300 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1 min-w-[240px]"
          />
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Cadastrar
          </button>
        </form>
      </div>
    </section>
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {homeSections.map((sec) => {
        if (!sec.enabled) return null;
        if (sec.id === 'carousel') return renderCarouselSection();
        if (sec.id === 'categories') return renderCategoriesSection();
        if (sec.id === 'bestSellers') return renderBestSellersSection();
        if (sec.id === 'advantages') return renderAdvantagesSection();
        if (sec.id === 'newsletter') return renderNewsletterSection();
        return null;
      })}
    </div>
  );
}
