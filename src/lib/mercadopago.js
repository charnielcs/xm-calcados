// Mercado Pago SDK Helper for XM Calçados (Fail-safe Integration)
const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

export const isMercadoPagoConfigured = Boolean(
  mercadoPagoPublicKey && (mercadoPagoPublicKey.startsWith('APP_USR-') || mercadoPagoPublicKey.startsWith('TEST-'))
);

/**
 * Creates Mercado Pago Payment Checkout Link & Preference (PIX, Credit Card, Boleto)
 */
export async function createMercadoPagoPreference(orderData) {
  // Read Access Token from VITE_ prefix or localStorage admin setting
  const savedAdminToken = typeof localStorage !== 'undefined' ? localStorage.getItem('xm_mp_access_token') : '';
  const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || import.meta.env.MERCADOPAGO_ACCESS_TOKEN || savedAdminToken || '';

  const cleanCpf = (orderData.customer.cpf || '').replace(/\D/g, '');
  const nameParts = (orderData.customer.fullName || 'Cliente XM').trim().split(' ');
  const firstName = nameParts[0] || 'Cliente';
  const lastName = nameParts.slice(1).join(' ') || 'XM';

  // Demo fallback mode if Access Token is missing
  if (!accessToken) {
    return {
      id: `mp_pref_${Date.now()}`,
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect',
      qr_code: '00020126580014BR.GOV.BCB.PIX0136xmcalcados-mercadopago-pix-key-oficial',
      isMock: true
    };
  }

  try {
    const preferencePayload = {
      items: orderData.items.map((item) => ({
        id: item.id || `item-${Date.now()}`,
        title: `${item.name} (Tam: ${item.size || '39'})`,
        quantity: item.quantity || 1,
        currency_id: 'BRL',
        unit_price: Number(item.price)
      })),
      payer: {
        name: firstName,
        surname: lastName,
        email: orderData.customer.email,
        phone: {
          number: (orderData.customer.phone || '').replace(/\D/g, '')
        },
        identification: {
          type: 'CPF',
          number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
        }
      },
      external_reference: orderData.orderNumber,
      payment_methods: {
        excluded_payment_types: [],
        installments: 10
      },
      back_urls: {
        success: `${window.location.origin}/cliente?status=sucesso`,
        failure: `${window.location.origin}/checkout?status=erro`,
        pending: `${window.location.origin}/cliente?status=pendente`
      },
      auto_return: 'approved'
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.trim()}`
      },
      body: JSON.stringify(preferencePayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro na preferência do Mercado Pago:', data);
      return {
        error: data.message || data.cause?.[0]?.description || 'Erro ao gerar checkout no Mercado Pago',
        init_point: null
      };
    }

    return {
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      qr_code: `00020126580014BR.GOV.BCB.PIX0136mp-${data.id.substring(0, 20)}`,
      isMock: false
    };
  } catch (error) {
    console.error('Erro ao conectar com Mercado Pago:', error);
    return {
      error: error.message || 'Falha de conexão com Mercado Pago',
      init_point: null
    };
  }
}
