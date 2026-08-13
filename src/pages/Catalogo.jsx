import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  Check
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { useProducts } from '../context/ProductContext';

export function Catalogo() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('categoria') || '';
  const initialSearch = searchParams.get('busca') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('relevancia');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('categoria')) setSelectedCategory(searchParams.get('categoria'));
    if (searchParams.get('busca')) setSearchQuery(searchParams.get('busca'));
  }, [searchParams]);

  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const sizesList = useMemo(() => {
    const allSizes = products.flatMap((p) => p.sizes || []);
    return Array.from(new Set(allSizes)).sort((a, b) => a - b);
  }, [products]);

  const colorsList = useMemo(() => {
    const rawColors = products.flatMap((p) => p.colors || []);
    const colorSet = new Set();
    rawColors.forEach(c => {
      if (c.includes('Preto')) colorSet.add('Preto');
      if (c.includes('Cinza')) colorSet.add('Cinza');
      if (c.includes('Café') || c.includes('Marrom')) colorSet.add('Marrom/Café');
      if (c.includes('Nude') || c.includes('Caramelo')) colorSet.add('Nude/Caramelo');
      if (c.includes('Azul')) colorSet.add('Azul');
      if (c.includes('Branco')) colorSet.add('Branco');
      if (c.includes('Rosa') || c.includes('Lilás')) colorSet.add('Rosa/Lilás');
      if (c.includes('Metalizado')) colorSet.add('Metalizado');
    });
    return Array.from(colorSet);
  }, [products]);

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(500);
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory && product.category !== selectedCategory) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);
          if (!matches) return false;
        }

        if (product.price > maxPrice) return false;

        if (selectedSizes.length > 0) {
          const hasSize = product.sizes && product.sizes.some((s) => selectedSizes.includes(s));
          if (!hasSize) return false;
        }

        if (selectedColors.length > 0) {
          const hasColor = product.colors && product.colors.some((colorStr) =>
            selectedColors.some((selectedC) => {
              if (selectedC === 'Preto') return colorStr.includes('Preto');
              if (selectedC === 'Cinza') return colorStr.includes('Cinza');
              if (selectedC === 'Marrom/Café') return colorStr.includes('Café') || colorStr.includes('Marrom');
              if (selectedC === 'Nude/Caramelo') return colorStr.includes('Nude') || colorStr.includes('Caramelo');
              if (selectedC === 'Azul') return colorStr.includes('Azul');
              if (selectedC === 'Branco') return colorStr.includes('Branco');
              if (selectedC === 'Rosa/Lilás') return colorStr.includes('Rosa') || colorStr.includes('Lilás');
              if (selectedC === 'Metalizado') return colorStr.includes('Dourado') || colorStr.includes('Prata');
              return colorStr.includes(selectedC);
            })
          );
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'menor_preco') return a.price - b.price;
        if (sortBy === 'maior_preco') return b.price - a.price;
        if (sortBy === 'avaliacao') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [products, selectedCategory, searchQuery, maxPrice, selectedSizes, selectedColors, sortBy]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (maxPrice < 500 ? 1 : 0);

  const renderFilterControls = () => (
    <div className="space-y-6 text-slate-800">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Buscar no Catálogo
        </h4>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nome, modelo..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Categoria
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
              selectedCategory === ''
                ? 'bg-brand-50 text-brand-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Todas as Categorias</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-brand-500" />}
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-50 text-brand-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-brand-500" />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Preço Máximo
          </h4>
          <span className="text-xs font-extrabold text-brand-500 bg-brand-50 px-2 py-0.5 rounded">
            Até R$ {maxPrice.toFixed(0)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>R$ 100</span>
          <span>R$ 500</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Tamanho Disponível
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {sizesList.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleToggleSize(size)}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand-500'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Cor
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {colorsList.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => handleToggleColor(color)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-500 border-brand-500 text-white font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Limpar Todos os Filtros ({activeFiltersCount})
          </button>
        </div>
      )}

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Início</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Catálogo de Calçados</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Catálogo de Calçados
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Encontre tênis, sapatos sociais, sandálias e botas com envio rápido em todo o Brasil.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start md:self-auto">
            Exibindo <strong className="text-slate-900">{filteredProducts.length}</strong> produtos
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow hover:bg-slate-800 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>

        <div className="hidden lg:flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Filtros:</span>
          
          {selectedCategory && (
            <span className="bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full border border-brand-200 flex items-center gap-1">
              Cat: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer hover:text-brand-900" onClick={() => setSelectedCategory('')} />
            </span>
          )}

          {searchQuery && (
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
              " {searchQuery} "
              <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSearchQuery('')} />
            </span>
          )}

          {selectedSizes.map((size) => (
            <span key={size} className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1 text-[11px]">
              Tam {size}
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleToggleSize(size)} />
            </span>
          ))}

          {activeFiltersCount === 0 && (
            <span className="text-slate-400 italic">Nenhum filtro aplicado</span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sortBy" className="text-xs font-bold text-slate-600 text-nowrap">
            Ordenar por:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="relevancia">Mais Vendidos / Relevância</option>
            <option value="menor_preco">Menor Preço</option>
            <option value="maior_preco">Maior Preço</option>
            <option value="avaliacao">Melhor Avaliados ★</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200 h-fit sticky top-28 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-500" /> Filtros
            </h3>
            {activeFiltersCount > 0 && (
              <span className="text-[11px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {renderFilterControls()}
        </aside>

        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm my-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Nenhum calçado encontrado
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Não encontramos produtos correspondentes aos filtros selecionados. Tente remover alguns filtros ou buscar por outro termo.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Limpar Filtros
              </button>
            </div>
          )}
        </main>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filtrar Produtos
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              {renderFilterControls()}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md text-center"
              >
                Ver {filteredProducts.length} Produtos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
