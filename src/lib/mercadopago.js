// Mercado Pago SDK Helper for XM Calçados
const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

export const isMercadoPagoConfigured = Boolean(
  mercadoPagoPublicKey && mercadoPagoPublicKey.startsWith('APP_USR-')
);

/**
 * Creates a Mercado Pago Payment Preference (PIX, Credit Card, Boleto)
 * Can be called via a backend server function, Vercel Serverless Function, or API endpoint
 */
export async function createMercadoPagoPreference(orderData) {
  const accessToken = import.meta.env.MERCADOPAGO_ACCESS_TOKEN || import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '';

  if (!accessToken) {
    // Return mock preference if Mercado Pago keys are not connected yet
    return {
      id: `mp_pref_${Date.now()}`,
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect',
      qr_code: '00020126580014BR.GOV.BCB.PIX0136xmcalcados-mercadopago-pix-key-real',
      qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      isMock: true
    };
  }

  try {
    const preferencePayload = {
      items: orderData.items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(item.price)
      })),
      payer: {
        name: orderData.customer.fullName,
        email: orderData.customer.email,
        identification: {
          type: 'CPF',
          number: orderData.customer.cpf.replace(/\D/g, '')
        },
        phone: {
          number: orderData.customer.phone.replace(/\D/g, '')
        },
        address: {
          street_name: orderData.customer.address,
          street_number: orderData.customer.number,
          zip_code: orderData.customer.cep.replace(/\D/g, '')
        }
      },
      external_reference: orderData.orderNumber,
      back_urls: {
        success: `${window.location.origin}/cliente`,
        failure: `${window.location.origin}/checkout`,
        pending: `${window.location.origin}/cliente`
      },
      auto_return: 'approved'
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferencePayload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao gerar pagamento no Mercado Pago:', error);
    return { error: error.message };
  }
}
