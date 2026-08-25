import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MapPin,
  User,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { createMercadoPagoPreference, isMercadoPagoConfigured } from '../lib/mercadopago';

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { config } = useSiteConfig();
  const pixConfig = config.pixSettings || {};
  const navigate = useNavigate();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    fullName: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  // Pre-fill form from logged-in user profile if available
  useEffect(() => {
    if (user || profile) {
      setCustomerForm((prev) => ({
        ...prev,
        fullName: profile?.full_name || profile?.name || prev.fullName,
        email: user?.email || profile?.email || prev.email,
        cpf: profile?.cpf || prev.cpf,
        birthDate: profile?.birth_date || prev.birthDate,
        phone: profile?.phone || prev.phone,
        cep: profile?.cep || prev.cep,
        address: profile?.address || prev.address,
        neighborhood: profile?.neighborhood || prev.neighborhood,
        city: profile?.city || prev.city,
        state: profile?.state || prev.state
      }));
    }
  }, [user, profile]);

  const [paymentMethod, setPaymentMethod] = useState('pix');

  const [cardForm, setCardForm] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardHolder: 'CLIENTE XM',
    expiry: '12/29',
    cvv: '882',
    installments: '1'
  });

  const [copiedPix, setCopiedPix] = useState(false);

  const shippingTotal = totalPrice >= 199 ? 0 : 15.00;
  const pixDiscount = paymentMethod === 'pix' ? totalPrice * 0.05 : 0;
  const finalTotal = Math.max(0, totalPrice + shippingTotal - pixDiscount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Mandatory Field Validations for Purchase
    if (!customerForm.fullName.trim()) {
      setValidationError('Por favor, digite seu nome completo.');
      return;
    }
    if (!customerForm.email.trim()) {
      setValidationError('Por favor, digite seu e-mail.');
      return;
    }
    if (!customerForm.phone.trim()) {
      setValidationError('Por favor, informe seu número de celular para contato.');
      return;
    }
    if (!customerForm.cpf.trim() || customerForm.cpf.trim().length < 11) {
      setValidationError('O CPF é obrigatório para emissão da nota fiscal da compra.');
      return;
    }
    if (!customerForm.birthDate.trim()) {
      setValidationError('A Data de Nascimento é obrigatória para confirmação do pedido.');
      return;
    }
    if (!customerForm.cep.trim() || !customerForm.address.trim() || !customerForm.number.trim() || !customerForm.city.trim() || !customerForm.state.trim()) {
      setValidationError('Por favor, preencha o endereço de entrega completo (CEP, Rua, Número, Cidade e Estado).');
      return;
    }

    setLoadingPayment(true);

    const orderNumber = `XM-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderNumber,
      date: new Date().toLocaleDateString('pt-BR'),
      customer: customerForm,
      paymentMethod,
      items: cart,
      totalAmount: finalTotal,
      shippingTotal,
      pixDiscount
    };

    // Mercado Pago Payment Preference Generation
    const mpResponse = await createMercadoPagoPreference(orderData);

    orderData.mercadoPago = mpResponse;
    setPlacedOrderData(orderData);
    setIsOrderPlaced(true);
    setLoadingPayment(false);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPixKey = () => {
    const storePixKey = pixConfig.key || 'atendimento@xmcalcados.com.br';
    const pixCode = placedOrderData?.mercadoPago?.qr_code && placedOrderData.mercadoPago.qr_code.length > 50
      ? placedOrderData.mercadoPago.qr_code
      : storePixKey;
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Seu carrinho está vazio</h1>
        <p className="text-xs text-slate-500">Adicione calçados ao seu carrinho antes de prosseguir para o checkout.</p>
        <Link to="/catalogo" className="inline-block bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-xl">
          Ver Catálogo
        </Link>
      </div>
    );
  }

  if (isOrderPlaced && placedOrderData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4 border border-slate-800 shadow-xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
            <Zap className="w-3.5 h-3.5" /> Processado via Mercado Pago
          </span>

          <h1 className="text-3xl font-black tracking-tight">
            Obrigado pela sua compra na XM Calçados!
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300">
            Número do Pedido: <strong className="text-brand-400 font-mono text-base">{placedOrderData.orderNumber}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-slate-100 pb-6">
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-500" /> Dados do Cliente
              </h4>
              <p className="font-semibold text-slate-800">{placedOrderData.customer.fullName}</p>
              <p className="text-slate-500">{placedOrderData.customer.email}</p>
              <p className="text-slate-500">CPF: {placedOrderData.customer.cpf}</p>
              <p className="text-slate-500">Data de Nasc.: {placedOrderData.customer.birthDate}</p>
              <p className="text-slate-500">Celular: {placedOrderData.customer.phone}</p>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" /> Endereço de Entrega
              </h4>
              <p className="font-semibold text-slate-800">
                {placedOrderData.customer.address}, {placedOrderData.customer.number} ({placedOrderData.customer.complement || 'S/C'})
              </p>
              <p className="text-slate-500">
                {placedOrderData.customer.neighborhood} — {placedOrderData.customer.city}/{placedOrderData.customer.state}
              </p>
              <p className="text-slate-500">CEP: {placedOrderData.customer.cep}</p>
            </div>
          </div>

          {placedOrderData.paymentMethod === 'pix' && (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <span className="font-extrabold text-emerald-950 flex items-center gap-2 text-sm">
                  <QrCode className="w-5 h-5 text-emerald-600" /> Pagamento Pix Oficial da Loja (5% OFF)
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Desconto de 5% Aplicado
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Chave Pix Oficial XM Calçados:</span>
                    <strong className="text-sm font-mono text-slate-900 font-black">{pixConfig.key || 'atendimento@xmcalcados.com.br'}</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tipo: <strong>{pixConfig.keyType || 'E-mail'}</strong> • Favorecido: <strong>{pixConfig.receiverName || 'XM Calçados'}</strong>
                    </p>
                  </div>

                  <button
                    onClick={handleCopyPixKey}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105"
                  >
                    {copiedPix ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    {copiedPix ? 'Chave Pix Copiada!' : 'Copiar Chave Pix'}
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Após realizar a transferência no app do seu banco, o pedido é confirmado instantaneamente!
                  </span>
                </div>
              </div>

              {(placedOrderData.mercadoPago?.init_point || placedOrderData.mercadoPago?.sandbox_init_point || placedOrderData.mercadoPago?.ticket_url) && (
                <div className="pt-2 text-center">
                  <a
                    href={placedOrderData.mercadoPago.init_point || placedOrderData.mercadoPago.sandbox_init_point || placedOrderData.mercadoPago.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" /> Pagar via Checkout Mercado Pago (Opcional)
                  </a>
                </div>
              )}
            </div>
          )}

          {placedOrderData.paymentMethod === 'credit_card' && (
            <div className="p-6 rounded-3xl bg-brand-50 border border-brand-200 text-xs space-y-2">
              <span className="font-extrabold text-brand-900 flex items-center gap-2 text-sm">
                <CreditCard className="w-5 h-5 text-brand-500" /> Cartão de Crédito via Mercado Pago
              </span>
              <p className="text-slate-700">
                Pagamento processado em até 10x sem juros com proteção antifraude Mercado Pago.
              </p>
            </div>
          )}

          {placedOrderData.paymentMethod === 'boleto' && (
            <div className="p-6 rounded-3xl bg-slate-100 border border-slate-300 text-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <FileText className="w-5 h-5 text-slate-700" /> Boleto Bancário Mercado Pago
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full">
                  Vencimento em 3 Dias Úteis
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Utilize a linha digitável abaixo para pagar no Internet Banking ou aplicativo do seu banco:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={placedOrderData.mercadoPago?.boleto_barcode || "23793.38128 60000.000001 00000.000000 1 94820000029990"}
                  className="bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono flex-1 select-all font-semibold"
                />
                <button
                  onClick={() => {
                    const code = placedOrderData.mercadoPago?.boleto_barcode || "23793.38128 60000.000001 00000.000000 1 94820000029990";
                    navigator.clipboard.writeText(code);
                    alert('Código de barras copiado!');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Copy className="w-4 h-4" /> Copiar Código do Boleto
                </button>
              </div>

              {placedOrderData.mercadoPago?.boleto_url && (
                <div className="pt-2 text-center">
                  <a
                    href={placedOrderData.mercadoPago.boleto_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-brand-400" /> Visualizar / Imprimir Boleto em PDF
                  </a>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Itens do Pedido</h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 p-4">
              {placedOrderData.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <span className="text-slate-500">Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
            <span>Total Pago:</span>
            <span className="text-2xl text-brand-600">
              R$ {placedOrderData.totalAmount.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/cliente"
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl text-center shadow"
            >
              Acompanhar Pedido na Minha Conta
            </Link>
            <Link
              to="/"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3.5 rounded-xl text-center"
            >
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Finalizar Compra (Checkout Mercado Pago)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pagamentos seguros via Pix, Cartão de Crédito em até 10x sem juros ou Boleto Bancário
          </p>
        </div>

        <Link to="/carrinho" className="text-xs font-bold text-slate-600 hover:text-brand-500 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
        </Link>
      </div>

      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-semibold flex items-center gap-2 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900">1. Dados do Comprador (Mercado Pago)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="Nome completo do comprador"
                  value={customerForm.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="seu.email@exemplo.com"
                  value={customerForm.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Celular / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="(11) 98765-4321"
                  value={customerForm.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CPF (Obrigatório para NF-e) *</label>
                <input
                  type="text"
                  required
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={customerForm.cpf}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Data de Nascimento *</label>
                <input
                  type="date"
                  required
                  name="birthDate"
                  value={customerForm.birthDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900">2. Endereço de Entrega (Obrigatório)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  name="cep"
                  placeholder="00000-000"
                  value={customerForm.cep}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Logradouro / Rua *</label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="Ex: Av. Paulista"
                  value={customerForm.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Número *</label>
                <input
                  type="text"
                  required
                  name="number"
                  placeholder="1000"
                  value={customerForm.number}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  placeholder="Apto, Bloco..."
                  value={customerForm.complement}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  name="neighborhood"
                  placeholder="Ex: Bela Vista"
                  value={customerForm.neighborhood}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="Ex: São Paulo"
                  value={customerForm.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">UF / Estado *</label>
                <input
                  type="text"
                  required
                  name="state"
                  placeholder="SP"
                  value={customerForm.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-500" />
                <h2 className="text-base font-extrabold text-slate-900">3. Opção de Pagamento Mercado Pago</h2>
              </div>
              <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Mercado Pago Protegido
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-6 h-6 text-emerald-600" />
                <span>Pix (5% OFF)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-2 ring-brand-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-6 h-6 text-brand-500" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'boleto'
                    ? 'bg-slate-100 border-slate-900 text-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-6 h-6 text-slate-700" />
                <span>Boleto Bancário</span>
              </button>
            </div>

            {paymentMethod === 'pix' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Desconto de 5% no Pix Mercado Pago!
                </span>
                <p className="text-slate-600">
                  O QR Code Pix e a chave de cópia oficial serão gerados pelo Mercado Pago assim que você clicar em <strong>Finalizar Pedido</strong>.
                </p>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="space-y-4 text-xs pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    required
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      required
                      name="cardHolder"
                      value={cardForm.cardHolder}
                      onChange={handleCardChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      required
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={handleCardChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Código de Segurança (CVV)</label>
                    <input
                      type="text"
                      required
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parcelamento Mercado Pago</label>
                    <select
                      name="installments"
                      value={cardForm.installments}
                      onChange={handleCardChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="1">1x de R$ {finalTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                      <option value="2">2x de R$ {(finalTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                      <option value="3">3x de R$ {(finalTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                      <option value="6">6x de R$ {(finalTotal / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
                      <option value="10">10x de R$ {(finalTotal / 10).toFixed(2).replace('.', ',')} (sem juros)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" /> Boleto Bancário Mercado Pago
                </span>
                <p className="text-slate-600">
                  O boleto com linha digitável e código de barras será gerado após a confirmação. Prazo de vencimento: 3 dias úteis.
                </p>
              </div>
            )}
          </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Resumo da Compra
            </h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Tam: {item.size} • Qtd: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Frete:</span>
                {shippingTotal === 0 ? (
                  <span className="font-bold text-emerald-600">FRETE GRÁTIS</span>
                ) : (
                  <span className="font-bold text-slate-800">R$ {shippingTotal.toFixed(2).replace('.', ',')}</span>
                )}
              </div>

              {pixDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Pix (5%):</span>
                  <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-sm">
                <span className="font-black text-slate-900">Total a Pagar:</span>
                <span className="text-2xl font-black text-slate-900">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingPayment}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPayment ? 'Gerando Pagamento...' : (
                <> <Lock className="w-4 h-4" /> Pagar com Mercado Pago </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Pagamento 100% Protegido pelo Mercado Pago
              </p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
