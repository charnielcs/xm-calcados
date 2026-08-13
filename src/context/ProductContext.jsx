import { createContext, useState, useEffect, useContext } from 'react';
import initialProductsData from '../data/products.json';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('xm_products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (e) {
        console.error('Erro ao ler produtos do localStorage', e);
      }
    }
    return initialProductsData;
  });

  useEffect(() => {
    localStorage.setItem('xm_products', JSON.stringify(products));
  }, [products]);

  // Add new product
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price),
      discount: Number(newProduct.discount || 0),
      rating: Number(newProduct.rating || 5.0),
      reviewsCount: Number(newProduct.reviewsCount || 1),
      sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : [38, 39, 40, 41, 42],
      colors: Array.isArray(newProduct.colors) ? newProduct.colors : ['Padrão'],
      inStock: newProduct.inStock !== false
    };
    setProducts((prev) => [productWithId, ...prev]);
    return productWithId;
  };

  // Update existing product
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: Number(updatedFields.price ?? p.price),
            originalPrice: Number(updatedFields.originalPrice ?? p.originalPrice),
            discount: Number(updatedFields.discount ?? p.discount),
          };
        }
        return p;
      })
    );
  };

  // Delete product
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset back to mock data
  const resetProducts = () => {
    setProducts(initialProductsData);
    localStorage.setItem('xm_products', JSON.stringify(initialProductsData));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
}
