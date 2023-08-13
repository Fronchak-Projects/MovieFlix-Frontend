import { Outlet } from 'react-router-dom';
import LoginImage from '../../assets/imgs/login.svg';

const AuthContainer = () => {
  return (
    <div className="main-form-container">
      <div className="out-form-container max-w-md md:order-2">
        <div className="form-card-container">
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
