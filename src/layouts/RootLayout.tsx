import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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