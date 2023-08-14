import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFetchFunction from '../../hooks/useFetchFunction';
import TokenResponseType from '../../types/TokenResponseType';
import { BASE_API_URL } from '../../utils/Contantes';

type LoginFormType = {
  email: string,
  password: string
}

type LoginFormTypeKeys = keyof LoginFormType;

const Login = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState } = useForm<LoginFormType>();
  const { data, error, isLoading, fetchFunction, status } = useFetchFunction<TokenResponseType>();
  const { saveToken } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state ? state.from : "/genres";

  const onSubmit = (formData: LoginFormType) => {
    fetchFunction(`${BASE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        "Accept": 'application/json'
      },
      body: JSON.stringify(formData)
    });
  }

  useEffect(() => {
    if(data) {
      saveToken(data.access_token);
      navigate(from, { replace: true });
      toast.success('Logado com sucesso');
    }
  }, [data, navigate, saveToken]);

  const getErrorMessage = (input: LoginFormTypeKeys): string | undefined => {
    return errors[input]?.message;
  }

  const isFieldInvalid = (input: LoginFormTypeKeys): boolean => {
    return getFieldState(input).invalid;
  }

  const hasLoginError = (): boolean => {
    return error !== undefined && status !== undefined && (status === 401 || status === 422);
  }

  return (
    <div>
      <h3 className="form-title">Login</h3>
      { hasLoginError() && (
        <div className="mb-3 p-2 text-red-500 bg-red-200 rounded-lg">Email ou senha inválidos</div>
      )}
      <form className="mb-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            { ...register('email', {
              required: 'Campo obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: `Invalid email`
              }
            }) }
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={`form ${isFieldInvalid('email') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('email') }</div>
        </div>
        <div className="mb-3">
          <input
            { ...register('password', {
              required: 'Campo obrigatório',
            }) }
            type="password"
            placeholder="Senha"
            className={`form ${isFieldInvalid('password') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('password') }</div>
        </div>
        <button
          disabled={isLoading}
          className="form-btn"
        >Entrar <i className="bi bi-box-arrow-in-right"></i></button>
      </form>
      <p className="text-sm">Ainda não possui uma conta? <Link to="/auth/register" className="text-blue-500 hover:underline">Clique aqui</Link>.</p>
    </div>
  );
}

export default Login;
