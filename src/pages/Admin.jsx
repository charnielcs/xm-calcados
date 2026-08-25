import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Package,
  X,
  Search,
  Tag,
  ExternalLink,
  Sparkles,
  Award,
  Palette,
  SlidersHorizontal,
  LayoutGrid,
  Globe,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon,
  Lock,
  UserCheck,
  LogOut,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Admin() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    syncWithBling,
    isSyncingBling,
    lastBlingSync
  } = useProducts();
  const [blingTokenInput, setBlingTokenInput] = useState('');
  const [blingSyncStatus, setBlingSyncStatus] = useState(null);
  const {
    config,
    updateStoreInfo,
    updateThemeColors,
    updatePixSettings,
    updateBannerSlides,
    updateFeaturedCategories,
    updateHomeSections,
    resetConfig
  } = useSiteConfig();

  const [pixForm, setPixForm] = useState(config.pixSettings || {
    key: 'atendimento@xmcalcados.com.br',
    keyType: 'E-mail',
    receiverName: 'XM Calçados Ltda',
    bankName: 'Sua Conta Bancária (Pix Direto / Asaas / PagBank)'
  });

  // --- ADMIN AUTHENTICATION STATE ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('xm_admin_authenticated') === 'true';
  });

  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Credentials configuration
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'xm-calcados-2026!'
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setAdminLoginError('');

    const usernameMatch =
      adminUsernameInput.trim().toLowerCase() === ADMIN_CREDENTIALS.username ||
      adminUsernameInput.trim().toLowerCase() === 'admin@xmcalcados.com.br';
    const passwordMatch = adminPasswordInput === ADMIN_CREDENTIALS.password;

    if (usernameMatch && passwordMatch) {
      sessionStorage.setItem('xm_admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
    } else {
      setAdminLoginError('Usuário ou senha incorretos. Verifique suas credenciais de administrador.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('xm_admin_authenticated');
    setIsAdminAuthenticated(false);
    setAdminUsernameInput('');
    setAdminPasswordInput('');
  };

  // Admin Top-Level Tab State: 'products' or 'layout'
  const [adminTab, setAdminTab] = useState('products');

  // Layout Sub-Tab State: 'carousel', 'colors', 'storeInfo', 'sections', 'categories'
  const [layoutSubTab, setLayoutSubTab] = useState('carousel');

  // Product Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Product Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: '',
    category: 'Tênis',
    brand: 'XM Athletic',
    price: '',
    originalPrice: '',
    discount: '0',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'Calçado de alta qualidade e extremo conforto para todas as ocasiões.',
    sizesStr: '38, 39, 40, 41, 42, 43',
    colorsStr: 'Preto, Branco'
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- LAYOUT FORM STATES ---
  const [storeInfoForm, setStoreInfoForm] = useState(config.storeInfo || {});
  const [colorsForm, setColorsForm] = useState(config.themeColors || { primary: '#ff5500', secondary: '#3b4268' });
  const [slidesForm, setSlidesForm] = useState(config.bannerSlides || []);
  const [categoriesForm, setCategoriesForm] = useState(config.featuredCategories || []);
  const [sectionsForm, setSectionsForm] = useState(
    [...(config.homeSections || [])].sort((a, b) => a.order - b.order)
  );

  // Filtered Products for Admin Table
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || 'XM Athletic',
      price: product.price.toString(),
      originalPrice: (product.originalPrice || product.price).toString(),
      discount: (product.discount || 0).toString(),
      image: product.image,
      description: product.description || '',
      sizesStr: product.sizes ? product.sizes.join(', ') : '38, 39, 40, 41, 42',
      colorsStr: product.colors ? product.colors.join(', ') : 'Preto, Branco'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const sizes = formData.sizesStr
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    const colors = formData.colorsStr
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const productPayload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      discount: Number(formData.discount || 0),
      installments: `10x de R$ ${(Number(formData.price) / 10).toFixed(2).replace('.', ',')} sem juros`,
      image: formData.image,
      description: formData.description,
      sizes: sizes.length > 0 ? sizes : [38, 39, 40, 41, 42],
      colors: colors.length > 0 ? colors : ['Preto', 'Branco']
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja remover o produto "${name}" do catálogo?`)) {
      deleteProduct(id);
    }
  };

  // --- LAYOUT HANDLERS ---
  const handleSaveStoreInfo = (e) => {
    e.preventDefault();
    updateStoreInfo(storeInfoForm);
    alert('Textos institucionais atualizados com sucesso!');
  };

  const handleSaveColors = (e) => {
    e.preventDefault();
    updateThemeColors(colorsForm);
    alert('Cores do tema atualizadas em tempo real em todo o site!');
  };

  const handleSavePixSettings = (e) => {
    e.preventDefault();
    updatePixSettings(pixForm);
    alert('Chave Pix oficial da loja salva com sucesso! Os clientes usarão essa chave nas compras por Pix.');
  };

  const handleSaveSlides = (e) => {
    e.preventDefault();
    updateBannerSlides(slidesForm);
    alert('Banners do carrossel salvos com sucesso!');
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      tag: "NOVA PROMOÇÃO",
      title: "Título do Novo Banner",
      subtitle: "Subtítulo explicativo com detalhes da promoção",
      ctaText: "Ver Ofertas",
      ctaLink: "/catalogo",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80"
    };
    setSlidesForm([...slidesForm, newSlide]);
  };

  const handleRemoveSlide = (id) => {
    setSlidesForm(slidesForm.filter((s) => s.id !== id));
  };

  const handleSaveCategories = (e) => {
    e.preventDefault();
    updateFeaturedCategories(categoriesForm);
    alert('Categorias em destaque salvas com sucesso!');
  };

  const handleSaveSections = (e) => {
    e.preventDefault();
    updateHomeSections(sectionsForm);
    alert('Ordem e visibilidade das seções da Home salvas com sucesso!');
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...sectionsForm];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const reordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSectionsForm(reordered);
  };

  const handleToggleSectionEnabled = (index) => {
    const newSections = [...sectionsForm];
    newSections[index].enabled = !newSections[index].enabled;
    setSectionsForm(newSections);
  };

  // =========================================================================
  // ADMIN LOGIN SCREEN (IF UNAUTHENTICATED)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-brand-500 flex items-center justify-center mx-auto shadow-xl border border-slate-800">
              <Lock className="w-8 h-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Acesso Restrito ao Administrador
            </span>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Painel de Gestão XM Calçados
            </h1>
            <p className="text-xs text-slate-500">
              Digite a senha de administrador para gerenciar produtos e o layout do site.
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4 text-xs">
            
            {adminLoginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Usuário Administrador</label>
              <input
                type="text"
                required
                placeholder="Ex: admin"
                value={adminUsernameInput}
                onChange={(e) => setAdminUsernameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Senha de Acesso</label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-3.5 pr-10 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-brand-500" /> Entrar no Painel de Admin
            </button>
          </form>

        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGGED-IN ADMIN PANEL (AUTHORIZED VIEW)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner with Logout */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Sessão de Administrador Autenticada
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administração — XM Calçados
          </h1>
          <p className="text-xs text-slate-400">
            Gerencie o catálogo de produtos e personalize todo o layout do site pelo navegador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Deseja resetar todos os produtos e configurações para o padrão original?')) {
                resetProducts();
                resetConfig();
                window.location.reload();
              }
            }}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-3 rounded-xl border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Geral
          </button>

          {adminTab === 'products' && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Novo Produto
            </button>
          )}

          <button
            onClick={handleAdminLogout}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow transition-colors"
            title="Encerrar sessão de administrador"
          >
            <LogOut className="w-4 h-4" /> Sair do Admin
          </button>
        </div>
      </div>

      {/* Top Level Navigation Tabs: Gestão de Produtos vs Configuração do Layout */}
      <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl text-xs sm:text-sm font-extrabold max-w-xl mx-auto shadow-inner">
        <button
          onClick={() => setAdminTab('products')}
          className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            adminTab === 'products'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-brand-400" />
          <span>Gestão de Produtos ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('layout')}
          className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            adminTab === 'layout'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-400" />
          <span>Configurações do Site</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GESTÃO DE PRODUTOS */}
      {/* ========================================================================= */}
      {adminTab === 'products' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Total de Produtos</span>
                <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
              </div>
              <div className="p-3 bg-brand-50 text-brand-500 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Categorias</span>
                <h3 className="text-2xl font-black text-slate-900">{categories.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <Tag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Destaques da Loja</span>
                <h3 className="text-2xl font-black text-slate-900">
                  {products.filter((p) => p.isFeatured).length || 4}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BLING ERP SYNCHRONIZATION CARD */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-lg shadow-inner">
                  <RefreshCw className={`w-6 h-6 ${isSyncingBling ? 'animate-spin text-emerald-400' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      Bling ERP v3 API
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Estoque & Produtos Sincronizados
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">Sincronização com o Bling ERP</h3>
                </div>
              </div>

              <button
                type="button"
                disabled={isSyncingBling}
                onClick={async () => {
                  setBlingSyncStatus('Sincronizando produtos e estoques com o Bling...');
                  const res = await syncWithBling(blingTokenInput);
                  if (res.success) {
                    setBlingSyncStatus(`Sincronização concluída com sucesso! ${res.products?.length || 0} produtos atualizados.`);
                  } else {
                    setBlingSyncStatus(`Erro: ${res.error || 'Não foi possível conectar ao Bling.'}`);
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingBling ? 'animate-spin' : ''}`} />
                {isSyncingBling ? 'Sincronizando...' : 'Sincronizar com o Bling Agora'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block font-bold text-slate-300">Chave API v3 do Bling (Opcional - Ou insira no .env na Vercel)</label>
                <input
                  type="password"
                  placeholder="Insira seu Token API v3 do Bling (ex: 88f2a9...)"
                  value={blingTokenInput}
                  onChange={(e) => setBlingTokenInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex flex-col justify-center text-xs space-y-1">
                <span className="text-slate-400 font-semibold">Última Sincronização:</span>
                <strong className="text-emerald-400 font-mono text-xs">
                  {lastBlingSync ? new Date(lastBlingSync).toLocaleString('pt-BR') : 'Nunca sincronizado'}
                </strong>
                <span className="text-[11px] text-slate-400">
                  Estoque zerado = Marcado automaticamente como "Indisponível"
                </span>
              </div>
            </div>

            {blingSyncStatus && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-semibold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{blingSyncStatus}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou marca..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer w-full sm:w-auto"
              >
                <option value="">Todas as Categorias</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase tracking-wider text-[11px] font-extrabold">
                  <tr>
                    <th className="p-4">Calçado</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Marca</th>
                    <th className="p-4 text-right">Preço (R$)</th>
                    <th className="p-4 text-center">Desconto</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            />
                            <div>
                              <Link
                                to={`/produto/${p.id}`}
                                className="font-bold text-slate-900 hover:text-brand-500 transition-colors flex items-center gap-1"
                                target="_blank"
                              >
                                {p.name} <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                              <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-bold text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-slate-800">{p.brand}</span>
                        </td>

                        <td className="p-4 text-right">
                          <span className="font-extrabold text-slate-900 text-sm block">
                            R$ {p.price.toFixed(2).replace('.', ',')}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              R$ {p.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {p.discount > 0 ? (
                            <span className="bg-brand-50 text-brand-600 font-extrabold px-2 py-0.5 rounded text-[11px]">
                              -{p.discount}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 rounded-xl transition-colors"
                              title="Editar Produto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl transition-colors"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-500">
                        Nenhum produto encontrado correspondente aos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONFIGURAÇÕES DO LAYOUT DO SITE */}
      {/* ========================================================================= */}
      {adminTab === 'layout' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setLayoutSubTab('carousel')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'carousel'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Banners do Carrossel
            </button>

            <button
              onClick={() => setLayoutSubTab('colors')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'colors'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Palette className="w-4 h-4" /> Cores da Marca
            </button>

            <button
              onClick={() => setLayoutSubTab('pixSettings')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'pixSettings'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-4 h-4" /> Chave Pix da Loja
            </button>

            <button
              onClick={() => setLayoutSubTab('storeInfo')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'storeInfo'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4" /> Textos & Rodapé
            </button>

            <button
              onClick={() => setLayoutSubTab('sections')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'sections'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Reordenar Seções Home
            </button>

            <button
              onClick={() => setLayoutSubTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                layoutSubTab === 'categories'
                  ? 'bg-brand-500 text-white shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-4 h-4" /> Categorias da Home
            </button>
          </div>

          {layoutSubTab === 'carousel' && (
            <form onSubmit={handleSaveSlides} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Gerenciar Banners do Carrossel</h3>
                  <p className="text-xs text-slate-500">Altere fotos, títulos e botões das ofertas principais da Home.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Adicionar Slide
                </button>
              </div>

              <div className="space-y-6">
                {slidesForm.map((slide, index) => (
                  <div key={slide.id || index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-xs text-slate-800">Slide #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(slide.id)}
                        className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover Slide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tag / Selo do Banner</label>
                        <input
                          type="text"
                          value={slide.tag}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].tag = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">URL da Imagem de Fundo</label>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].image = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 font-mono text-[11px]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Título Principal (H1)</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].title = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 font-bold text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Subtítulo Explicativo</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].subtitle = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Texto do Botão (CTA)</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].ctaText = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Link de Destino do Botão</label>
                        <input
                          type="text"
                          value={slide.ctaLink}
                          onChange={(e) => {
                            const updated = [...slidesForm];
                            updated[index].ctaLink = e.target.value;
                            setSlidesForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
              >
                Salvar Alterações no Carrossel
              </button>
            </form>
          )}

          {layoutSubTab === 'colors' && (
            <form onSubmit={handleSaveColors} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Personalizar Cores do Tema</h3>
                <p className="text-xs text-slate-500">Altere a cor principal e secundária do site em tempo real sem recompilar o código.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-extrabold text-slate-800">Cor Principal (Botões, Destaques, Links)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colorsForm.primary}
                      onChange={(e) => setColorsForm({ ...colorsForm, primary: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={colorsForm.primary}
                      onChange={(e) => setColorsForm({ ...colorsForm, primary: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl py-2 px-3 font-mono font-bold uppercase text-xs flex-1"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Usada nos botões de compra, links e ícones em destaque.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-extrabold text-slate-800">Cor Secundária / Azul Índigo da Logo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colorsForm.secondary}
                      onChange={(e) => setColorsForm({ ...colorsForm, secondary: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={colorsForm.secondary}
                      onChange={(e) => setColorsForm({ ...colorsForm, secondary: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl py-2 px-3 font-mono font-bold uppercase text-xs flex-1"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Usada nas barras superiores, rodapé e menus institucionais.</p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
              >
                Aplicar Novas Cores no Site
              </button>
            </form>
          )}

          {layoutSubTab === 'pixSettings' && (
            <div className="space-y-6">
              {/* Mercado Pago Access Token Config Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" /> Mercado Pago (Pix Automático com Valor Predefinido)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Insira o seu <strong>Access Token de Produção</strong> do Mercado Pago para gerar Pix automático com o valor exato travado na compra do cliente (ex: R$ 299,90).
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Mercado Pago Ativo
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const token = e.target.mpToken.value.trim();
                    if (token) {
                      localStorage.setItem('xm_mp_access_token', token);
                      alert('Token do Mercado Pago salvo com sucesso no site! As próximas compras gerarão o Pix automático do Mercado Pago.');
                    } else {
                      localStorage.removeItem('xm_mp_access_token');
                      alert('Token removido.');
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Access Token do Mercado Pago (Começa com APP_USR-...)</label>
                    <input
                      type="password"
                      name="mpToken"
                      defaultValue={localStorage.getItem('xm_mp_access_token') || ''}
                      placeholder="Cole aqui seu Access Token (ex: APP_USR-342f9aeb-9412-4219...)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Você pode pegar esse token no seu painel em: <strong>mercadopago.com.br/developers ➔ Credenciais de produção ➔ Access Token</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01]"
                  >
                    Salvar Token do Mercado Pago no Site
                  </button>
                </form>
              </div>

              {/* Direct Store Pix Key Config Card */}
              <form onSubmit={handleSavePixSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">Chave Pix Direta da Loja (Alternativa para Conta Bancária)</h3>
                  <p className="text-xs text-slate-500">Chave Pix para onde o valor das compras será enviado caso você prefira transferência direta no seu banco.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Chave Pix da Loja (E-mail, CNPJ, Celular ou Chave Aleatória)</label>
                    <input
                      type="text"
                      value={pixForm.key}
                      onChange={(e) => setPixForm({ ...pixForm, key: e.target.value })}
                      placeholder="Ex: atendimento@xmcalcados.com.br"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Chave Pix</label>
                    <select
                      value={pixForm.keyType}
                      onChange={(e) => setPixForm({ ...pixForm, keyType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-bold"
                    >
                      <option value="E-mail">E-mail</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="Celular">Celular</option>
                      <option value="Chave Aleatória">Chave Aleatória</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome do Favorecido / Razão Social</label>
                    <input
                      type="text"
                      value={pixForm.receiverName}
                      onChange={(e) => setPixForm({ ...pixForm, receiverName: e.target.value })}
                      placeholder="Ex: XM Calçados Ltda"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
                >
                  Salvar Chave Pix Alternativa
                </button>
              </form>
            </div>
          )}

          {layoutSubTab === 'storeInfo' && (
            <form onSubmit={handleSaveStoreInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Textos Institucionais & Rodapé</h3>
                <p className="text-xs text-slate-500">Atualize informações de contato, aviso da barra superior e redes sociais.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome da Loja</label>
                  <input
                    type="text"
                    value={storeInfoForm.name || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / 0800</label>
                  <input
                    type="text"
                    value={storeInfoForm.phone || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail de Atendimento</label>
                  <input
                    type="email"
                    value={storeInfoForm.email || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Endereço Físico / Sede</label>
                  <input
                    type="text"
                    value={storeInfoForm.address || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Aviso da Barra Superior do Header</label>
                  <input
                    type="text"
                    value={storeInfoForm.topNotice || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, topNotice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Slogan / Texto do Rodapé</label>
                  <textarea
                    rows="2"
                    value={storeInfoForm.slogan || ''}
                    onChange={(e) => setStoreInfoForm({ ...storeInfoForm, slogan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
              >
                Salvar Textos Institucionais
              </button>
            </form>
          )}

          {layoutSubTab === 'sections' && (
            <form onSubmit={handleSaveSections} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Reordenar & Ativar Seções da Home</h3>
                <p className="text-xs text-slate-500">Suba ou desça as seções da página principal e ative/desative a exibição.</p>
              </div>

              <div className="space-y-3">
                {sectionsForm.map((sec, index) => (
                  <div
                    key={sec.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      sec.enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{sec.name}</h4>
                        <span className="text-[11px] text-slate-400">ID da seção: {sec.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveSection(index, 'up')}
                          className="p-1.5 hover:bg-white rounded-lg text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Mover para cima"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === sectionsForm.length - 1}
                          onClick={() => handleMoveSection(index, 'down')}
                          className="p-1.5 hover:bg-white rounded-lg text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Mover para baixo"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSectionEnabled(index)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          sec.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {sec.enabled ? (
                          <> <Eye className="w-3.5 h-3.5" /> Exibindo </>
                        ) : (
                          <> <EyeOff className="w-3.5 h-3.5" /> Oculto </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
              >
                Salvar Ordem das Seções
              </button>
            </form>
          )}

          {layoutSubTab === 'categories' && (
            <form onSubmit={handleSaveCategories} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Editar Categorias em Destaque (Home)</h3>
                <p className="text-xs text-slate-500">Altere foto, nome e filtro das 5 categorias exibidas na página inicial.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {categoriesForm.map((cat, index) => (
                  <div key={cat.id || index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                      <span className="font-bold text-slate-800">Categoria #{index + 1}</span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nome Exibido</label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = [...categoriesForm];
                          updated[index].name = e.target.value;
                          setCategoriesForm(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Selo / Subtítulo</label>
                      <input
                        type="text"
                        value={cat.count}
                        onChange={(e) => {
                          const updated = [...categoriesForm];
                          updated[index].count = e.target.value;
                          setCategoriesForm(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">URL da Imagem</label>
                      <input
                        type="text"
                        value={cat.image}
                        onChange={(e) => {
                          const updated = [...categoriesForm];
                          updated[index].image = e.target.value;
                          setCategoriesForm(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
              >
                Salvar Categorias em Destaque
              </button>
            </form>
          )}

        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-500" />
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Calçado'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Calçado / Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tênis XM Runner Ultra Speed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Tênis">Tênis</option>
                    <option value="Sapatos Sociais">Sapatos Sociais</option>
                    <option value="Sandálias">Sandálias</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Esportivo">Esportivo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: XM Athletic"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Atual (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="299.90"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Original (De)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="399.90"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Desconto (%)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL da Imagem</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tamanhos (separados por vírgula)</label>
                  <input
                    type="text"
                    placeholder="38, 39, 40, 41, 42"
                    value={formData.sizesStr}
                    onChange={(e) => setFormData({ ...formData, sizesStr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cores (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Preto/Laranja, Cinza/Azul"
                    value={formData.colorsStr}
                    onChange={(e) => setFormData({ ...formData, colorsStr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-xl shadow"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
