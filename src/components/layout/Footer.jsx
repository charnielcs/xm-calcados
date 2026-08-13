import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Lock,
  Headphones,
  FileText,
  Award
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

export function Footer() {
  const { config } = useSiteConfig();
  const storeInfo = config?.storeInfo || {};
  const socials = storeInfo.socials || {};

  return (
    <footer className="bg-brand-900 text-slate-400 text-sm mt-auto border-t border-brand-800">
      
      {/* 1. Trust & Benefit Badges */}
      <div className="border-b border-brand-800/60 bg-slate-950/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-brand-800/40 border border-brand-700/50">
            <div className="p-2.5 bg-brand-500/20 text-brand-300 rounded-xl flex-shrink-0">
              <Truck className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Entrega em Todo o Brasil</h4>
              <p className="text-xs text-slate-400">Rastreamento em tempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-brand-800/40 border border-brand-700/50">
            <div className="p-2.5 bg-brand-500/20 text-brand-300 rounded-xl flex-shrink-0">
              <CreditCard className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Parcele em até 10x</h4>
              <p className="text-xs text-slate-400">Sem juros no cartão ou desconto no Pix</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-brand-800/40 border border-brand-700/50">
            <div className="p-2.5 bg-brand-500/20 text-brand-300 rounded-xl flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Compra 100% Segura</h4>
              <p className="text-xs text-slate-400">Garantia XM de satisfação</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-brand-800/40 border border-brand-700/50">
            <div className="p-2.5 bg-brand-500/20 text-brand-300 rounded-xl flex-shrink-0">
              <Award className="w-6 h-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Qualidade Garantida</h4>
              <p className="text-xs text-slate-400">Produtos com 90 dias de garantia</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-md inline-block">
              <img
                src="/logo.png"
                alt={storeInfo.name || "XM Calçados"}
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
          
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            {storeInfo.slogan || "Sua loja oficial de calçados online. Tênis, sapatos sociais, sandálias e botas com entrega rápida."}
          </p>

          {/* Social Media Links */}
          <div className="pt-2">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Siga a XM nas redes</h5>
            <div className="flex items-center gap-2">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-brand-800 hover:bg-accent-orange hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-brand-700">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-brand-800 hover:bg-accent-orange hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-brand-700">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-brand-800 hover:bg-accent-orange hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-brand-700">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socials.whatsapp && (
                <a href={socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-xl bg-brand-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-brand-700">
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Institutional Links */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-400 pl-2">
            Institucional
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><a href="#sobre" className="hover:text-white transition-colors">Sobre a {storeInfo.name || "XM Calçados"}</a></li>
            <li><a href="#trabalhe" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
            <li><a href="#privacidade" className="hover:text-white transition-colors">Políticas de Privacidade</a></li>
            <li><a href="#termos" className="hover:text-white transition-colors">Termos de Uso</a></li>
            <li><a href="#imprensa" className="hover:text-white transition-colors">Assessoria de Imprensa</a></li>
          </ul>
        </div>

        {/* Customer Help Links */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-400 pl-2">
            Ajuda & Suporte
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><Link to="/cliente" className="hover:text-white transition-colors">Meus Pedidos & Rastreamento</Link></li>
            <li><a href="#trocas" className="hover:text-white transition-colors">Trocas e Devoluções Grátis</a></li>
            <li><a href="#prazos" className="hover:text-white transition-colors">Prazos e Valores de Frete</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Perguntas Frequentes (FAQ)</a></li>
            <li><a href="#seguranca" className="hover:text-white transition-colors">Dicas de Segurança no Pix</a></li>
          </ul>
        </div>

        {/* Contact & Customer Care */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-400 pl-2">
            Central de Atendimento
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <Headphones className="w-4 h-4 text-brand-300 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{storeInfo.phone || "0800 777 9696"}</p>
                <p className="text-[11px] text-slate-400">Seg. a Sex. das 08h às 19h</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-brand-300 mt-0.5" />
              <div>
                <p className="font-medium text-white">{storeInfo.email || "atendimento@xmcalcados.com.br"}</p>
                <p className="text-[11px] text-slate-400">Resposta em até 24h úteis</p>
              </div>
            </div>

            <div className="p-3 bg-brand-800/80 rounded-xl border border-brand-700 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
                <Lock className="w-3 h-3" /> Conexão Criptografada SSL
              </span>
              Seus dados protegidos de ponta a ponta.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Accepted Payment Methods & Copyright */}
      <div className="border-t border-brand-800 bg-brand-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Formas de Pagamento:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-extrabold text-emerald-400 border border-brand-800">
                ❖ PIX (5% OFF)
              </span>
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-bold text-slate-200 border border-brand-800">
                VISA
              </span>
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-bold text-slate-200 border border-brand-800">
                MASTERCARD
              </span>
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-bold text-slate-200 border border-brand-800">
                ELO
              </span>
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-bold text-slate-200 border border-brand-800">
                HIPERCARD
              </span>
              <span className="px-2.5 py-1 bg-brand-900 rounded-md text-[11px] font-bold text-slate-200 border border-brand-800">
                BOLETO
              </span>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-slate-400">
            <p>© 2026 {storeInfo.name || "XM Calçados S.A."} CNPJ: 00.123.456/0001-89</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{storeInfo.address || "Av. Paulista, 1000 — São Paulo/SP"}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
