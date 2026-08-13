import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';

// Base Page Imports
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Produto } from './pages/Produto';
import { Carrinho } from './pages/Carrinho';
import { Checkout } from './pages/Checkout';
import { Cliente } from './pages/Cliente';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="catalogo" element={<Catalogo />} />
                  <Route path="produto/:id" element={<Produto />} />
                  <Route path="produto" element={<Produto />} />
                  <Route path="carrinho" element={<Carrinho />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="cliente" element={<Cliente />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="*" element={<Home />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </ProductProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}
