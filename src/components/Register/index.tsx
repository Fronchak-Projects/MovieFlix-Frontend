import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../../utils/Contantes";

type RegisterFormType = {
  name: string,
  email: string,
  password: string,
  confirm_password: string
}

const Register = () => {

  const { register, handleSubmit, setValue, setError, formState: { errors }, getFieldState, getValues,watch } = useForm<RegisterFormType>();
  const [wasSubmited, setWasSubmited] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormType) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          "Accept": 'application/json'
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData);
    }
    catch(e) {
      console.error(e);
    }
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
            className={`form ${getFieldState('email').invalid && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ errors['email']?.message }</div>
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
            className={`form ${getFieldState('name').invalid && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ errors['name']?.message }</div>
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
              className="form"
            />
            <div className="error-form-feedback">{ errors['password']?.message }</div>
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
              className="form"
            />
            <div className="error-form-feedback">{ errors['confirm_password']?.message }</div>
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
