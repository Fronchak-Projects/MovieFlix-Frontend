import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';

const Root = () => {
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Root;
