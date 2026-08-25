/**
 * CRITICAL SECURITY & DATA INTEGRITY GUARANTEE FOR BLING ERP INTEGRATION:
 * ------------------------------------------------------------------
 * 1. STRICTLY READ-ONLY (SOMENTE LEITURA): This integration strictly reads product
 *    catalog and stock balances FROM Bling TO the website.
 * 2. HTTP GET METHOD ONLY: All API calls strictly use HTTP GET. No POST, PUT, PATCH,
 *    or DELETE calls exist in this module.
 * 3. OAUTH SCOPE RESTRICTION: Only read-only scopes (e.g. `produtos:read`, `estoque:read`)
 *    should be granted in Bling ERP.
 * 4. BLING DATA PROTECTION: There is ZERO risk of modifying, deleting, or overwriting
 *    any product, order, price, or inventory record inside your Bling account.
 * ------------------------------------------------------------------
 */

const blingApiKey = import.meta.env.VITE_BLING_API_KEY || import.meta.env.VITE_BLING_ACCESS_TOKEN || '';

export const isBlingConfigured = Boolean(blingApiKey && blingApiKey.length > 10);

/**
 * Fetch products and stock balances from Bling API v3
 * @param {string} customToken - Bling API v3 OAuth Access Token
 * @param {boolean} isTestMode - If true, restricts import to 2 items for safe testing
 */
export async function fetchBlingProducts(customToken = '', isTestMode = false) {
  const startTime = Date.now();
  const token = (customToken || blingApiKey || '').trim();

  // Return sample Bling sync data when API key is not connected yet
  if (!token) {
    const durationSeconds = '0.4';
    const mockProducts = [
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
      }
    ];

    const returnedProducts = isTestMode ? mockProducts.slice(0, 2) : mockProducts;

    return {
      success: true,
      isMock: true,
      isTestMode,
      products: returnedProducts,
      totalImported: returnedProducts.length,
      inactiveSkippedCount: 0,
      skippedItems: [
        { sku: 'BLG-ERR-099', name: 'Chinelo Incompleto', reason: 'Preço zerado (R$ 0,00) no Bling' }
      ],
      durationSeconds,
      totalPagesFetched: 1
    };
  }

  const importedProducts = [];
  const skippedItems = [];
  let inactiveSkippedCount = 0;

  let page = 1;
  let hasMorePages = true;
  const limit = isTestMode ? 2 : 100; // In test mode, restrict to 2 items
  const maxPagesLimit = isTestMode ? 1 : 50;

  try {
    while (hasMorePages && page <= maxPagesLimit) {
      // READ-ONLY HTTP GET QUERY TO BLING API V3
      const response = await fetch(`https://api.bling.com.br/v3/produtos?pagina=${page}&limite=${limit}&criterio=1`, {
        method: 'GET', // STRICTLY READ-ONLY HTTP GET
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
      const pageItems = data.data || [];

      if (pageItems.length === 0) {
        hasMorePages = false;
        break;
      }

      // Process each product with individual fault-tolerance
      for (const item of pageItems) {
        try {
          // 1. Skip inactive/archived items (situacao === 'I')
          if (item.situacao === 'I') {
            inactiveSkippedCount++;
            continue;
          }

          const sku = item.codigo || item.sku || `SKU-${item.id}`;
          const name = item.nome || 'Produto Sem Nome';
          const price = Number(item.preco || item.precoVenda || 0);

          // 2. Validate price
          if (price <= 0) {
            skippedItems.push({
              sku,
              name,
              reason: 'Preço não cadastrado ou zerado (R$ 0,00) no Bling'
            });
            continue;
          }

          // 3. Extract stock quantity
          const availableStock = item.estoque?.saldoDisponivel ?? item.estoque?.saldoFisicoTotal ?? 0;
          const isAvailable = availableStock > 0;

          // 4. Extract product image
          const imageUrl =
            item.midia?.imagens?.externas?.[0]?.link ||
            item.midia?.imagens?.internas?.[0]?.link ||
            item.imagemURL ||
            '';

          if (!imageUrl) {
            skippedItems.push({
              sku,
              name,
              reason: 'Sem imagem principal cadastrada no Bling (usada imagem padrão)'
            });
          }

          const fallbackImage = imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80';

          importedProducts.push({
            id: `bling-${item.id}`,
            sku,
            name,
            price,
            originalPrice: Number(item.precoDe || price),
            description: item.descricaoCurta || item.descricaoComplementar || 'Produto sincronizado automaticamente do Bling ERP.',
            category: item.categoria?.descricao || 'Geral',
            brand: 'XM Calçados',
            inStock: isAvailable, // Automatically marks "Indisponível" if stock is 0
            stockQuantity: availableStock,
            sizes: [37, 38, 39, 40, 41, 42],
            colors: ['Padrão'],
            image: fallbackImage,
            gallery: [fallbackImage],
            lastSyncedAt: new Date().toISOString()
          });

          // Break early if test mode target is reached
          if (isTestMode && importedProducts.length >= 2) {
            hasMorePages = false;
            break;
          }
        } catch (itemErr) {
          console.warn(`Erro ao processar item do Bling SKU: ${item.codigo}`, itemErr);
          skippedItems.push({
            sku: item.codigo || `ID-${item.id}`,
            name: item.nome || 'Produto com erro',
            reason: `Erro de formato nos dados: ${itemErr.message}`
          });
        }
      }

      // Check if we reached the last page or in test mode
      if (isTestMode || pageItems.length < limit) {
        hasMorePages = false;
      } else {
        page++;
      }
    }

    const durationMs = Date.now() - startTime;
    const durationSeconds = (durationMs / 1000).toFixed(1);

    return {
      success: true,
      isMock: false,
      isTestMode,
      products: importedProducts,
      totalImported: importedProducts.length,
      inactiveSkippedCount,
      skippedCount: skippedItems.length,
      skippedItems,
      durationSeconds,
      totalPagesFetched: page
    };
  } catch (error) {
    console.error('Erro ao buscar produtos do Bling:', error);
    return {
      success: false,
      error: error.message || 'Falha de conexão com os servidores do Bling'
    };
  }
}
