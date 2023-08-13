import { Link } from 'react-router-dom';

const Login = () => {

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Login</h3>
      <form className="mb-1">
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form"
          />
        </div>
        <div className="mb-3">
          <input
              type="password"
              placeholder="Senha"
              className="form"
            />
        </div>
        <button
          className="w-full p-2 rounded-md bg-blue-500 text-white uppercase font-bold hover:bg-blue-700 duration-300"
        >Entrar <i className="bi bi-box-arrow-in-right"></i></button>
      </form>
      <p className="text-sm">Ainda não possui uma conta? <Link to="/auth/register" className="text-blue-500 hover:underline">Clique aqui</Link>.</p>
    </div>
  );
}

export default Login;
