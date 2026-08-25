// Mercado Pago Direct Payments SDK Helper (Transparent In-Site Pix & Boleto)
const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

export const isMercadoPagoConfigured = Boolean(
  mercadoPagoPublicKey && (mercadoPagoPublicKey.startsWith('APP_USR-') || mercadoPagoPublicKey.startsWith('TEST-'))
);

/**
 * Generates transparent Pix or Boleto payments directly in the site
 */
export async function createMercadoPagoPreference(orderData) {
  const savedAdminToken = typeof localStorage !== 'undefined' ? localStorage.getItem('xm_mp_access_token') : '';
  const accessToken = (
    import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN ||
    import.meta.env.MERCADOPAGO_ACCESS_TOKEN ||
    savedAdminToken ||
    ''
  ).trim();

  const cleanCpf = (orderData.customer.cpf || '').replace(/\D/g, '');
  const nameParts = (orderData.customer.fullName || 'Cliente XM').trim().split(' ');
  const firstName = nameParts[0] || 'Cliente';
  const lastName = nameParts.slice(1).join(' ') || 'XM';

  // Demo fallback mode if Access Token is missing
  if (!accessToken) {
    return {
      id: `mp_demo_${Date.now()}`,
      paymentMethod: orderData.paymentMethod,
      qr_code: '00020126580014BR.GOV.BCB.PIX0136xmcalcados-mercadopago-pix-key-oficial-demo',
      qr_code_base64: '',
      boleto_url: 'https://www.mercadopago.com.br',
      boleto_barcode: '23793.38128 60000.000001 00000.000000 1 94820000029990',
      isMock: true
    };
  }

  try {
    if (orderData.paymentMethod === 'pix') {
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
          'X-Idempotency-Key': `pix-${orderData.orderNumber}-${Date.now()}`
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

      return {
        id: data.id,
        paymentMethod: 'pix',
        status: data.status,
        qr_code: data.point_of_interaction?.transaction_data?.qr_code || '',
        qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        ticket_url: data.point_of_interaction?.transaction_data?.ticket_url || '',
        isMock: false
      };
    }

    if (orderData.paymentMethod === 'boleto') {
      const boletoPayload = {
        transaction_amount: Number(orderData.totalAmount.toFixed(2)),
        description: `Pedido ${orderData.orderNumber} - XM Calçados`,
        payment_method_id: 'bolbradesco',
        external_reference: orderData.orderNumber,
        payer: {
          email: orderData.customer.email,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
          },
          address: {
            zip_code: (orderData.customer.cep || '').replace(/\D/g, ''),
            street_name: orderData.customer.address || 'Rua',
            street_number: orderData.customer.number || '1',
            neighborhood: orderData.customer.neighborhood || 'Centro',
            city: orderData.customer.city || 'Cidade',
            federal_unit: (orderData.customer.state || 'SP').toUpperCase()
          }
        }
      };

      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `bol-${orderData.orderNumber}-${Date.now()}`
        },
        body: JSON.stringify(boletoPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro na API Boleto do Mercado Pago:', data);
        return {
          error: data.message || data.cause?.[0]?.description || 'Erro ao gerar Boleto no Mercado Pago'
        };
      }

      return {
        id: data.id,
        paymentMethod: 'boleto',
        status: data.status,
        boleto_url: data.transaction_details?.external_resource_url || '',
        boleto_barcode: data.barcode?.content || data.transaction_details?.payment_method_reference_id || '',
        isMock: false
      };
    }

    // Default Credit Card / Checkout Pro Preference
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
      external_reference: orderData.orderNumber
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
