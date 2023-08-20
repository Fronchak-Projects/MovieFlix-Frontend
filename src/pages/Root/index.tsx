import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';

const Root = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Root;
