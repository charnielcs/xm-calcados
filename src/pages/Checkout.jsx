import { useState, useMemo } from 'react';
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
  Package
} from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    fullName: 'Maria Oliveira Silva',
    email: 'maria.oliveira@email.com',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    cep: '01310-100',
    address: 'Avenida Paulista',
    number: '1000',
    complement: 'Apto 42',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP'
  });

  const [paymentMethod, setPaymentMethod] = useState('pix');

  const [cardForm, setCardForm] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardHolder: 'MARIA O SILVA',
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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

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

    setPlacedOrderData(orderData);
    setIsOrderPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136xmcalcados-pay-store-94821");
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
          
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Pedido Realizado com Sucesso
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
              <p className="text-slate-500">Tel: {placedOrderData.customer.phone}</p>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" /> Endereço de Entrega
              </h4>
              <p className="font-semibold text-slate-800">
                {placedOrderData.customer.address}, {placedOrderData.customer.number} ({placedOrderData.customer.complement})
              </p>
              <p className="text-slate-500">
                {placedOrderData.customer.neighborhood} — {placedOrderData.customer.city}/{placedOrderData.customer.state}
              </p>
              <p className="text-slate-500">CEP: {placedOrderData.customer.cep}</p>
            </div>
          </div>

          {placedOrderData.paymentMethod === 'pix' && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" /> Pagamento via Pix (Chave Copia e Cola)
                </span>
                <span className="text-[11px] font-bold text-emerald-700">Aprovação Instantânea</span>
              </div>
              <p className="text-slate-600">
                Abra seu aplicativo de banco e selecione a opção <strong>Pix Copia e Cola</strong> com a chave abaixo:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="00020126580014BR.GOV.BCB.PIX0136xmcalcados-pay-store-94821"
                  className="bg-white border border-emerald-300 rounded-xl px-3 py-2 text-[11px] text-slate-700 font-mono flex-1 select-all"
                />
                <button
                  onClick={handleCopyPixKey}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
                >
                  {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedPix ? 'Copiado!' : 'Copiar Chave'}
                </button>
              </div>
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
            Finalizar Compra (Checkout)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Preencha seus dados para concluir o pedido na XM Calçados
          </p>
        </div>

        <Link to="/carrinho" className="text-xs font-bold text-slate-600 hover:text-brand-500 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900">1. Dados Pessoais</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={customerForm.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={customerForm.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  name="cpf"
                  value={customerForm.cpf}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone / Celular</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={customerForm.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900">2. Endereço de Entrega</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  required
                  name="cep"
                  value={customerForm.cep}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Logradouro / Rua</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={customerForm.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Número</label>
                <input
                  type="text"
                  required
                  name="number"
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
                  value={customerForm.complement}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bairro</label>
                <input
                  type="text"
                  required
                  name="neighborhood"
                  value={customerForm.neighborhood}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={customerForm.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">UF / Estado</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={customerForm.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-extrabold text-slate-900">3. Forma de Pagamento</h2>
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
                  <Check className="w-4 h-4 text-emerald-600" /> Desconto de 5% aplicado no Pix!
                </span>
                <p className="text-slate-600">
                  O QR Code Pix e a chave de cópia serão gerados assim que você clicar em <strong>Finalizar Pedido</strong>. A aprovação é imediata.
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
                    <label className="block font-bold text-slate-700 mb-1">Opções de Parcelamento</label>
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
                  <FileText className="w-4 h-4 text-slate-700" /> Boleto Bancário
                </span>
                <p className="text-slate-600">
                  O boleto bancário será gerado após a confirmação. Prazo de vencimento: 3 dias úteis.
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
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Finalizar Pedido
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Pagamento 100% Protegido pela XM Calçados
              </p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
