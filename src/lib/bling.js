// Bling ERP API v3 Integration Module for XM Calçados
const blingApiKey = import.meta.env.VITE_BLING_API_KEY || import.meta.env.VITE_BLING_ACCESS_TOKEN || '';

export const isBlingConfigured = Boolean(blingApiKey && blingApiKey.length > 10);

/**
 * Fetch products and stock balances from Bling API v3
 * Strictly filters out sensitive financial/supplier/tax data.
 */
export async function fetchBlingProducts(customToken = '') {
  const token = customToken || blingApiKey;

  if (!token) {
    // Return sample Bling sync data when API key is not connected yet
    return {
      success: true,
      isMock: true,
      products: [
        {
          id: 'bling-101',
          sku: 'BLG-TEN-001',
          name: 'Tênis Running Bling Pro Ultra',
          price: 289.90,
          originalPrice: 349.90,
          description: 'Sincronizado automaticamente do Bling ERP. Tênis de alta performance com amortecimento responsivo.',
          category: 'Esportivo',
          brand: 'XM Calçados',
          inStock: true,
          stockQuantity: 14,
          sizes: [38, 39, 40, 41, 42, 43],
          colors: ['Preto/Grafite', 'Azul/Branco'],
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
          lastSyncedAt: new Date().toISOString()
        },
        {
          id: 'bling-102',
          sku: 'BLG-SAP-002',
          name: 'Sapato Social Oxford Couro Legítimo',
          price: 359.00,
          originalPrice: 399.00,
          description: 'Sincronizado do Bling ERP. Sapato social artesanal em couro macio.',
          category: 'Sapatos Sociais',
          brand: 'XM Calçados',
          inStock: true,
          stockQuantity: 8,
          sizes: [39, 40, 41, 42],
          colors: ['Café', 'Preto'],
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
          gallery: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80'],
          lastSyncedAt: new Date().toISOString()
        },
        {
          id: 'bling-103',
          sku: 'BLG-SND-003',
          name: 'Sandália Anabela Couro Confort',
          price: 189.90,
          originalPrice: 219.90,
          description: 'Sincronizado do Bling ERP. Sandália feminina salto anabela leve.',
          category: 'Sandálias',
          brand: 'XM Calçados',
          inStock: false, // Stock zeroed out in Bling!
          stockQuantity: 0,
          sizes: [35, 36, 37, 38],
          colors: ['Nude', 'Caramelo'],
          image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80',
          gallery: ['https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80'],
          lastSyncedAt: new Date().toISOString()
        }
      ]
    };
  }

  try {
    const response = await fetch('https://api.bling.com.br/v3/produtos?limite=100', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error?.message || `Erro ${response.status} ao conectar à API do Bling`
      };
    }

    const data = await response.json();
    const blingItems = data.data || [];

    // Map public fields ONLY (Filter out cost, supplier, margins, NCM)
    const sanitizedProducts = blingItems.map((item) => {
      const availableStock = item.estoque?.saldoDisponivel ?? item.estoque?.saldoFisicoTotal ?? 0;
      const isAvailable = availableStock > 0 && item.situacao !== 'I';

      return {
        id: `bling-${item.id}`,
        sku: item.codigo || item.sku || `SKU-${item.id}`,
        name: item.nome,
        price: Number(item.preco || item.precoVenda || 0),
        originalPrice: Number(item.precoDe || item.preco || 0),
        description: item.descricaoCurta || item.descricaoComplementar || 'Produto sincronizado do Bling ERP.',
        category: item.categoria?.descricao || 'Geral',
        brand: 'XM Calçados',
        inStock: isAvailable, // Automatically marks "Indisponível" if stock is 0
        stockQuantity: availableStock,
        sizes: [37, 38, 39, 40, 41, 42],
        colors: ['Padrão'],
        image: item.midia?.imagens?.externas?.[0]?.link || item.midia?.imagens?.internas?.[0]?.link || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        gallery: [
          item.midia?.imagens?.externas?.[0]?.link || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
        ],
        lastSyncedAt: new Date().toISOString()
      };
    });

    return {
      success: true,
      isMock: false,
      products: sanitizedProducts
    };
  } catch (error) {
    console.error('Erro ao buscar produtos do Bling:', error);
    return {
      success: false,
      error: error.message || 'Falha de conexão com os servidores do Bling'
    };
  }
}
