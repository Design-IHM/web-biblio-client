import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.tsx';
import Footer from '../components/layout/Footer.tsx';

const RootLayout = () => {
  return (
    <div className="">
      <Header />
      <main className="flex-grow  mx-auto ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
