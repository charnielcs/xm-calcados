import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Truck,
  ShoppingBag,
  Trash2
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../context/ProductContext';

export function Cliente() {
  const { addToCart } = useCart();
  const { products } = useProducts();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('pedidos');

  const [profile, setProfile] = useState({
    name: 'Maria Oliveira Silva',
    email: 'maria.oliveira@email.com',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Avenida Paulista, 1000 - Apto 42',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-100'
  });

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
    },
    {
      id: 'XM-73104',
      date: '28 de Julho, 2026',
      status: 'Em Trânsito',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      total: 349.90,
      trackingCode: 'BR472910394XM',
      items: [
        {
          name: 'Sapato Social Couro XM Premium Classic',
          size: 40,
          color: 'Café',
          price: 349.90,
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  const [wishlist, setWishlist] = useState([products[0], products[1], products[4]].filter(Boolean));

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Dados cadastrais atualizados com sucesso!');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="XM Calçados" className="h-10 mx-auto object-contain mb-2" />
          <h1 className="text-2xl font-black text-slate-900">
            {authMode === 'login' ? 'Acesse sua Conta' : 'Crie sua Conta XM'}
          </h1>
          <p className="text-xs text-slate-500">
            {authMode === 'login'
              ? 'Acompanhe seus pedidos e gerencie suas compras'
              : 'Cadastre-se gratuitamente para comprar com frete exclusivo'}
          </p>
        </div>

        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'login' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'register' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoggedIn(true);
          }}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs"
        >
          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                placeholder="Seu nome completo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="seu.email@exemplo.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            {authMode === 'login' ? 'Entrar na Minha Conta' : 'Criar Minha Conta'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400">
              Minha Conta • XM Calçados
            </span>
            <h1 className="text-xl sm:text-2xl font-black">{profile.name}</h1>
            <p className="text-xs text-slate-400">{profile.email} • Cliente desde 2026</p>
          </div>
        </div>

        <button
          onClick={() => setIsLoggedIn(false)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-800 px-4 py-2 rounded-xl transition-colors border border-slate-700"
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
                activeTab === 'pedidos'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-700 hover:bg-slate-50'
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
                activeTab === 'favoritos'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-700 hover:bg-slate-50'
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
                activeTab === 'dados'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-700 hover:bg-slate-50'
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

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CPF</label>
                    <input
                      type="text"
                      value={profile.cpf}
                      onChange={(e) => setProfile({ ...profile, cpf: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Endereço Principal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Endereço</label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CEP</label>
                      <input
                        type="text"
                        value={profile.cep}
                        onChange={(e) => setProfile({ ...profile, cep: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-all"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
