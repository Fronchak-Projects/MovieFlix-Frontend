import { Outlet } from 'react-router-dom';
import LoginImage from '../../assets/imgs/login.svg';

const AuthContainer = () => {
  return (
    <div className="container mx-auto py-6 md:py-16 flex justify-center">
      <div className="px-4 md:px-10 w-full max-w-md md:order-2">
        <div className="py-16 md:py-24 px-2 md:px-4 bg-white rounded-3xl shadow-white shadow-sm">
          <Outlet />
        </div>
      </div>
      <div className="hidden md:block">
        <img src={ LoginImage } />
      </div>
    </div>
  );
}

export default AuthContainer;
