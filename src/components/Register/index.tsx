import { Link } from "react-router-dom";

const Register = () => {

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Cadastre-se</h3>
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
            type="text"
            placeholder="Nome"
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
        <div className="mb-3">
          <input
              type="password"
              placeholder="Confirme a sua senha"
              className="form"
            />
        </div>
        <button
          className="w-full p-2 rounded-md bg-blue-500 text-white uppercase font-bold hover:bg-blue-700 duration-300"
        >Criar conta</button>
      </form>
      <p className="text-sm">Já possui uma conta? <Link to="/auth/login" className="text-blue-500 hover:underline">Clique aqui</Link>.</p>
    </div>
  );
}

export default Register;
