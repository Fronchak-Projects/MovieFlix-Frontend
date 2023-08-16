import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import useFetchFunction from "../../hooks/useFetchFunction";
import ValidationErrorType from "../../types/ValidationErrorType";
import { BASE_API_URL } from "../../utils/Contantes";
import { toast } from "react-toastify";

type FormType = {
  old_password: string,
  new_password: string,
  confirm_new_password: string
}

type FormTypeKeys = keyof FormType;

const ChangePasswordForm = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState, setValue, watch, reset } = useForm<FormType>();
  const { error, status, fetchFunction } = useFetchFunction();
  const { logout, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onSubmit = async (formData: FormType) => {
    if(!isAuthenticated()) {
      logout();
      navigate('/auth/login', {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisar estar logado para atualizar a sua senha");
      return;
    }
    fetchFunction(`${BASE_API_URL}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        "Accept": 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
  }

  useEffect(() => {
    if(!status) return;
    if(status === 200) {
      toast.success('Senha atualizada com sucesso');
      reset();
    }
    else if(status === 401) {
      toast.error('Senha antiga inválida');
    }
    else if(status === 422) {
      toast.error('As senhas não batem');
    }
  }, [status]);

  const getErrorMessage = (input: FormTypeKeys): string | undefined => {
    return errors[input]?.message;
  }

  const isFieldInvalid = (input: FormTypeKeys): boolean => {
    return getFieldState(input).invalid;
  }

  return (
    <>
      <h3 className="form-title">Mudar senha</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="label">Senha atual</label>
          <input
            { ...register('old_password', {
              required: "Campo obrigatório"
            }) }
            type="password"
            name="old_password"
            id="old_password"
            placeholder="Senha atual"
            className={`form ${isFieldInvalid('old_password') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('old_password') }</div>
        </div>
        <div className="mb-3">
          <label className="label">Nova senha</label>
          <input
            { ...register('new_password', {
              'required': "Campo obrigatório"
            }) }
            type="password"
            name="new_password"
            id="new_password"
            placeholder="Nova senha"
            className={`form ${isFieldInvalid('new_password') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('new_password') }</div>
        </div>
        <div className="mb-3">
          <label className="label">Confirme a nova senha</label>
          <input
            { ...register('confirm_new_password', {
              'required': "Campo obrigatório",
              validate: (confirmPassword: string) => {
                if(watch('new_password') !== confirmPassword) {
                  return 'Senhas não batem';
                }
              }
            }) }
            type="password"
            name="confirm_new_password"
            id="confirm_new_password"
            placeholder="Confirme a nova senha"
            className={`form ${isFieldInvalid('confirm_new_password') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('confirm_new_password') }</div>
        </div>
        <button
          type="submit"
          className="form-btn"
        >Mudar senha</button>
      </form>
    </>
  );
}

export default ChangePasswordForm;
