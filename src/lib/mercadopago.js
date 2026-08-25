// Mercado Pago SDK Helper for XM Calçados
const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

export const isMercadoPagoConfigured = Boolean(
  mercadoPagoPublicKey && (mercadoPagoPublicKey.startsWith('APP_USR-') || mercadoPagoPublicKey.startsWith('TEST-'))
);

/**
 * Generates a real Mercado Pago Payment (PIX / Preference)
 */
export async function createMercadoPagoPreference(orderData) {
  const accessToken = import.meta.env.MERCADOPAGO_ACCESS_TOKEN || import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '';

  if (!accessToken) {
    // Return mock preference if Mercado Pago keys are not connected yet
    return {
      id: `mp_pref_${Date.now()}`,
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect',
      qr_code: '00020126580014BR.GOV.BCB.PIX0136xmcalcados-mercadopago-pix-demo-key',
      qr_code_base64: '',
      isMock: true
    };
  }

  const cleanCpf = (orderData.customer.cpf || '').replace(/\D/g, '');
  const nameParts = (orderData.customer.fullName || 'Cliente XM').trim().split(' ');
  const firstName = nameParts[0] || 'Cliente';
  const lastName = nameParts.slice(1).join(' ') || 'XM';

  try {
    if (orderData.paymentMethod === 'pix') {
      // Direct Mercado Pago PIX Payment API (v1/payments)
      const pixPayload = {
        transaction_amount: Number(orderData.totalAmount.toFixed(2)),
        description: `Pedido ${orderData.orderNumber} - XM Calçados`,
        payment_method_id: 'pix',
        external_reference: orderData.orderNumber,
        payer: {
          email: orderData.customer.email,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
          }
        }
      };

      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `${orderData.orderNumber}-${Date.now()}`
        },
        body: JSON.stringify(pixPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro na API Pix do Mercado Pago:', data);
        return {
          error: data.message || data.cause?.[0]?.description || 'Erro ao gerar Pix no Mercado Pago'
        };
      }

      const qrCode = data.point_of_interaction?.transaction_data?.qr_code || '';
      const qrCodeBase64 = data.point_of_interaction?.transaction_data?.qr_code_base64 || '';
      const ticketUrl = data.point_of_interaction?.transaction_data?.ticket_url || '';

      return {
        id: data.id,
        status: data.status,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
        ticket_url: ticketUrl,
        isMock: false
      };
    }

    // Default Checkout Pro Preference for Credit Card / Boleto
    const preferencePayload = {
      items: orderData.items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(item.price)
      })),
      payer: {
        name: firstName,
        surname: lastName,
        email: orderData.customer.email,
        identification: {
          type: 'CPF',
          number: cleanCpf
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
    console.error('Erro ao conectar com Mercado Pago:', error);
    return { error: error.message || 'Falha de conexão com Mercado Pago' };
  }
}
