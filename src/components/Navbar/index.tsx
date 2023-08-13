import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {

  const { isAuthenticated, tokenData, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/auth/login');
    toast.info('Deslogado com sucesso');
  }

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-1 flex justify-between md:justify-start items-center">
        <div className="flex gap-x-2 text-xl">
          <i className="bi bi-film"></i>
          <h1 className="font-bold">Movie Flix</h1>
        </div>
        <i className="bi bi-list text-white md:invisible"></i>
        <nav className="hidden md:flex flex-1 justify-between">
          <ul className="flex">
            <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/movies">Movies</NavLink></li>
            <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/genres">Genres</NavLink></li>
            <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/">About Us</NavLink></li>
          </ul>
          { isAuthenticated() ?
            <ul className="flex">
              <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/auth/login">{ tokenData?.email }</NavLink></li>
              <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="#" onClick={onLogout}>Logout</NavLink></li>
            </ul>
           :
            <ul className="flex">
              <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/auth/login">Login</NavLink></li>
              <li><NavLink className="inline-block px-2 py-1 hover:bg-gray-500 duration-300" to="/auth/register">Register</NavLink></li>
            </ul>
          }

        </nav>
      </div>
    </header>
  );
}

export default Navbar;
