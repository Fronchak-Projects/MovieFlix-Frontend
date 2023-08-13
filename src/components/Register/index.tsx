import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../../utils/Contantes";
import useFetchFunction from "../../hooks/useFetchFunction";
import ValidationErrorType from "../../types/ValidationErrorType";

type RegisterFormType = {
  name: string,
  email: string,
  password: string,
  confirm_password: string
}

type RegisterFormTypeKeys = keyof RegisterFormType;

type ResponseData = {
  access_token: string,
  token_type: string
}

const Register = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState, watch } = useForm<RegisterFormType>();
  const [wasSubmited, setWasSubmited] = useState<boolean>(false);
  const { data, error, isLoading, fetchFunction, status } = useFetchFunction<ResponseData>();

  const onSubmit = async (data: RegisterFormType) => {
    try {
      fetchFunction(`${BASE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          "Accept": 'application/json'
        },
        body: JSON.stringify(data)
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  const getServerError = (input: RegisterFormTypeKeys): string | undefined => {
    if(error && status && status === 422) {
      const serverError = error as ValidationErrorType;
      return serverError.message[input] && serverError.message[input][0];
    }
  }

  const getErrorMessage = (input: RegisterFormTypeKeys): string | undefined => {
    return errors[input]?.message || getServerError(input);
  }

  const isFieldInvalid = (input: RegisterFormTypeKeys): boolean => {
    return getFieldState(input).invalid || getServerError(input) !== undefined;
  }

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Cadastre-se</h3>
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
            { ...register('name', {
              required: 'Campo obrigatório',
              minLength: {
                value: 2,
                message: 'Nome deve possuir pelo duas letras'
              }
            }) }
            type="text"
            placeholder="Nome"
            className={`form ${isFieldInvalid('name') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('name') }</div>
        </div>
        <div className="mb-3">
          <input
              { ...register('password', {
                required: 'Campo obrigatório',
                minLength: {
                  value: 4,
                  message: 'Senha deve possuir pelo menos 4 letras'
                }
              }) }
              id="password"
              name="password"
              type="password"
              placeholder="Senha"
              className={`form ${isFieldInvalid('password') && 'is-invalid'}`}
            />
          <div className="error-form-feedback">{ getErrorMessage('password') }</div>
        </div>
        <div className="mb-3">
          <input
              { ...register('confirm_password', {
                required: 'Campo obrigatório',
                minLength: {
                  value: 4,
                  message: 'Senha deve possuir pelo menos 4 letras'
                },
                validate: (confirmPassword: string) => {
                  if(watch('password') !== confirmPassword) {
                    return 'Senhas não batem';
                  }
                }
              }) }
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirme a sua senha"
              className={`form ${isFieldInvalid('confirm_password') && 'is-invalid'}`}
            />
            <div className="error-form-feedback">{ getErrorMessage('confirm_password') }</div>
        </div>
        <button
          onClick={() => setWasSubmited(true)}
          type="submit"
          className="w-full p-2 rounded-md bg-blue-500 text-white uppercase font-bold hover:bg-blue-700 duration-300"
        >Criar conta</button>
      </form>
      <p className="text-sm">Já possui uma conta? <Link to="/auth/login" className="text-blue-500 hover:underline">Clique aqui</Link>.</p>
    </div>
  );
}

export default Register;
