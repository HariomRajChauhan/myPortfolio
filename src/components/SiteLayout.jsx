import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CursorGlow from './CursorGlow';

const SiteLayout = () => (
  <div className="site-shell">
    <CursorGlow />
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default SiteLayout;
