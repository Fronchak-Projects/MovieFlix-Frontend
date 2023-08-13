import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Root = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Root;
