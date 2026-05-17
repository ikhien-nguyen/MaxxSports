import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content" id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
