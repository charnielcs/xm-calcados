import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Truck,
  ShoppingBag,
  Trash2,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Database,
  Check
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export function Cliente() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { user, profile, signUp, signIn, signOut, updateProfile, isSupabaseConfigured } = useAuth();

  const isLoggedIn = Boolean(user);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('pedidos');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Editable Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        cep: profile.cep || ''
      });
    }
  }, [profile]);

  const ordersHistory = [
    {
      id: 'XM-84920',
      date: '10 de Agosto, 2026',
      status: 'Entregue',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      total: 299.90,
      trackingCode: 'BR984729102XM',
      items: [
        {
          name: 'Tênis XM Performance Ultra Speed',
          size: 39,
          color: 'Preto/Laranja',
          price: 299.90,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  const [wishlist, setWishlist] = useState([products[0], products[1]].filter(Boolean));

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setSubmitting(true);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Por favor, preencha o e-mail e a senha.');
      setSubmitting(false);
      return;
    }

    try {
      if (authMode === 'register') {
        const { error } = await signUp(emailInput.trim(), passwordInput, nameInput.trim());
        if (error) {
          setAuthError(error.message || 'Erro ao realizar cadastro.');
        } else {
          setAuthSuccessMsg('Cadastro realizado com sucesso! Bem-vindo à XM Calçados.');
        }
      } else {
        const { error } = await signIn(emailInput.trim(), passwordInput);
        if (error) {
          setAuthError(error.message || 'E-mail ou senha incorretos.');
        }
      }
    } catch (err) {
      setAuthError('Ocorreu um erro na autenticação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
    alert('Perfil atualizado com sucesso no banco de dados!');
  };

  // LOGGED OUT VIEW (Starts logged out by default!)
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="XM Calçados" className="h-12 mx-auto object-contain mb-3" />
          <h1 className="text-2xl font-black text-slate-900">
            {authMode === 'login' ? 'Acesse sua Conta' : 'Crie sua Conta na XM'}
          </h1>
          <p className="text-xs text-slate-500">
            {authMode === 'login'
              ? 'Acompanhe seus pedidos e gerencie suas compras de forma rápida e segura'
              : 'Cadastre-se para aproveitar ofertas exclusivas e frete grátis'}
          </p>

          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Database className="w-3.5 h-3.5 text-emerald-600" /> Autenticação Segura via Supabase (PostgreSQL)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Database className="w-3.5 h-3.5 text-amber-600" /> Modo de Demonstração (Conecte as chaves Supabase no .env)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shadow-inner">
          <button
            onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'login' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccessMsg(''); }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'register' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Senha (Criptografada no Banco)</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {submitting ? 'Processando...' : authMode === 'login' ? 'Entrar na Minha Conta' : 'Criar Minha Conta'}
          </button>
        </form>
      </div>
    );
  }

  // LOGGED IN VIEW
  const displayName = profile?.full_name || profile?.name || user?.email?.split('@')[0] || 'Cliente';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {displayName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400">
                Minha Conta • XM Calçados
              </span>
              {isSupabaseConfigured && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Autenticado no Supabase
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{displayName}</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-800 px-4 py-2.5 rounded-xl transition-colors border border-slate-700"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`w-full text-left p-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-colors ${
                activeTab === 'pedidos' ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-brand-500" />
                <span>Meus Pedidos</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {ordersHistory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favoritos')}
              className={`w-full text-left p-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-colors ${
                activeTab === 'favoritos' ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Meus Favoritos</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dados')}
              className={`w-full text-left p-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-colors ${
                activeTab === 'dados' ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Dados Pessoais</span>
              </div>
            </button>
          </div>
        </aside>

        <main className="lg:col-span-9">
          {activeTab === 'pedidos' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Histórico de Pedidos</h2>

              {ordersHistory.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">Pedido #{order.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Realizado em {order.date} • Compra Direta XM Calçados</p>
                    </div>

                    <span className="text-base font-black text-slate-900">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-slate-500">Tamanho: {item.size} • Cor: {item.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Truck className="w-4 h-4 text-brand-500" /> Rastreio: <strong className="font-mono text-slate-900">{order.trackingCode}</strong>
                    </span>

                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-colors">
                      Rastrear Entrega
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'favoritos' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Meus Calçados Favoritos</h2>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-400 hover:text-rose-600 shadow"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</h3>
                        <p className="text-[11px] text-slate-400">{product.brand}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-sm font-black text-slate-900 block">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => addToCart(product, product.sizes[0], product.colors[0], 1)}
                          className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Sua lista de favoritos está vazia.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Dados Pessoais & Endereço
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">E-mail Cadastrado</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telefone / Celular</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Endereço Principal de Entrega</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Logradouro / Rua</label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CEP</label>
                      <input
                        type="text"
                        value={profileForm.cep}
                        onChange={(e) => setProfileForm({ ...profileForm, cep: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">UF / Estado</label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium uppercase"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
                >
                  Salvar Perfil no Banco de Dados
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
