// Mercado Pago Integration Client Helper for XM Calçados

export const isMercadoPagoConfigured = true;

/**
 * Sends payment request to Vercel Backend Serverless Endpoint /api/mercadopago
 */
export async function createMercadoPagoPreference(orderData) {
  const savedAdminToken = typeof localStorage !== 'undefined' ? localStorage.getItem('xm_mp_access_token') : '';

  try {
    const response = await fetch('/api/mercadopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderData,
        customToken: savedAdminToken || ''
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Erro na resposta do backend Mercado Pago:', data);
      return {
        error: data.error || 'Erro ao conectar com servidor do Mercado Pago',
        isMock: false
      };
    }

    return {
      ...data,
      isMock: false
    };
  } catch (error) {
    console.error('Erro ao conectar com /api/mercadopago:', error);
    return {
      error: error.message || 'Falha de conexão com backend do Mercado Pago',
      isMock: false
    };
  }
}
