// Vercel Serverless Function for Mercado Pago API Integration
// Handles Pix, Boleto, and Credit Card preference creation securely from Vercel backend

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { orderData, customToken } = req.body || {};

    const accessToken = (
      customToken ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      process.env.VITE_MERCADOPAGO_ACCESS_TOKEN ||
      ''
    ).trim();

    if (!orderData) {
      return res.status(400).json({ error: 'Dados do pedido ausentes' });
    }

    if (!accessToken) {
      return res.status(400).json({
        error: 'Access Token de PRODUÇÃO do Mercado Pago não configurado. Insira o token em /admin.'
      });
    }

    const cleanCpf = (orderData.customer?.cpf || '').replace(/\D/g, '');
    const nameParts = (orderData.customer?.fullName || 'Cliente XM').trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'XM';
    const paymentMethod = orderData.paymentMethod || 'pix';

    // 1. Direct Pix Payment API Call
    if (paymentMethod === 'pix') {
      const pixPayload = {
        transaction_amount: Number(orderData.totalAmount.toFixed(2)),
        description: `Pedido ${orderData.orderNumber} - XM Calçados`,
        payment_method_id: 'pix',
        external_reference: orderData.orderNumber,
        payer: {
          email: orderData.customer?.email || 'cliente@xmcalcados.com.br',
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
          }
        }
      };

      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `pix-${orderData.orderNumber}-${Date.now()}`
        },
        body: JSON.stringify(pixPayload)
      });

      const mpData = await mpResponse.json();

      if (!mpResponse.ok) {
        console.error('Erro na API Pix Mercado Pago:', mpData);
        // Fallback to preference creation if payment API rejects payer info
        return createPreferenceFallback(accessToken, orderData, firstName, lastName, cleanCpf, res);
      }

      return res.status(200).json({
        success: true,
        id: mpData.id,
        status: mpData.status,
        paymentMethod: 'pix',
        qr_code: mpData.point_of_interaction?.transaction_data?.qr_code || '',
        qr_code_base64: mpData.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        ticket_url: mpData.point_of_interaction?.transaction_data?.ticket_url || ''
      });
    }

    // 2. Direct Boleto Payment API Call
    if (paymentMethod === 'boleto') {
      const boletoPayload = {
        transaction_amount: Number(orderData.totalAmount.toFixed(2)),
        description: `Pedido ${orderData.orderNumber} - XM Calçados`,
        payment_method_id: 'bolbradesco',
        external_reference: orderData.orderNumber,
        payer: {
          email: orderData.customer?.email || 'cliente@xmcalcados.com.br',
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: 'CPF',
            number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
          },
          address: {
            zip_code: (orderData.customer?.cep || '').replace(/\D/g, ''),
            street_name: orderData.customer?.address || 'Rua',
            street_number: orderData.customer?.number || '1',
            neighborhood: orderData.customer?.neighborhood || 'Centro',
            city: orderData.customer?.city || 'Cidade',
            federal_unit: (orderData.customer?.state || 'SP').toUpperCase()
          }
        }
      };

      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `bol-${orderData.orderNumber}-${Date.now()}`
        },
        body: JSON.stringify(boletoPayload)
      });

      const mpData = await mpResponse.json();

      if (!mpResponse.ok) {
        console.error('Erro na API Boleto Mercado Pago:', mpData);
        return createPreferenceFallback(accessToken, orderData, firstName, lastName, cleanCpf, res);
      }

      return res.status(200).json({
        success: true,
        id: mpData.id,
        status: mpData.status,
        paymentMethod: 'boleto',
        boleto_url: mpData.transaction_details?.external_resource_url || '',
        boleto_barcode: mpData.barcode?.content || mpData.transaction_details?.payment_method_reference_id || ''
      });
    }

    // 3. Credit Card Preference / Checkout Pro
    return createPreferenceFallback(accessToken, orderData, firstName, lastName, cleanCpf, res);
  } catch (error) {
    console.error('Erro no servidor Vercel Mercado Pago:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar pagamento Mercado Pago' });
  }
}

async function createPreferenceFallback(accessToken, orderData, firstName, lastName, cleanCpf, res) {
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
        email: orderData.customer?.email || 'cliente@xmcalcados.com.br',
        phone: {
          number: (orderData.customer?.phone || '').replace(/\D/g, '')
        },
        identification: {
          type: 'CPF',
          number: cleanCpf.length >= 11 ? cleanCpf : '00000000000'
        }
      },
      external_reference: orderData.orderNumber
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferencePayload)
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      return res.status(mpResponse.status).json({ error: mpData.message || 'Erro na preferência do Mercado Pago' });
    }

    return res.status(200).json({
      success: true,
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
