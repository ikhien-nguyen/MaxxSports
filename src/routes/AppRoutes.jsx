import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Product from '../pages/Product/Product';
import Cart from '../pages/Cart/Cart';
import Payment from '../pages/Payment/Payment';
import PaymentManagement from '../pages/PaymentManagement/PaymentManagement';
import Auth from '../pages/Auth/Auth';
import CategoryPage from '../pages/Category/Category';
import NotFound from '../pages/NotFound';
import MainLayout from '../components/layout/MainLayout';

export default function AppRoutes() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-management" element={<PaymentManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

