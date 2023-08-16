import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from '../../hooks/useFetch';
import { toast } from "react-toastify";
import SimpleUserType from '../../types/models/SimpleUserType';
import { BASE_API_URL } from '../../utils/Contantes';
import UserImage from '../../assets/imgs/user.png';
import ValidationErrorType from '../../types/ValidationErrorType';
import useFetchFunction from '../../hooks/useFetchFunction';

type ProfileForm = {
  name: string;
}

type ProfileFormKeys = keyof ProfileForm;

const ProfileForm = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState, setValue } = useForm<ProfileForm>();
  const { logout, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [image, setImage] = useState<File | null>(null);
  const { data, status, error } = useFetch<SimpleUserType>(`${BASE_API_URL}/api/users/me`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const useFetchFunctionUpdate = useFetchFunction();

  const onSubmit = (formValues: ProfileForm) => {
    if(!isAuthenticated()) {
      navigate('/auth/login', {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info('Você precisa estar logado para realizar essa ação');
      return;
    }
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('_method', 'PUT');
    if(image) {
      formData.append('image', image);
    }
    useFetchFunctionUpdate.fetchFunction(`${BASE_API_URL}/api/users/update`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })
  }

  useEffect(() => {
    if(data) {
      setValue('name', data.name);
    }
  }, [data, setValue]);

  useEffect(() => {
    if(error && status) {
      if(status === 401) {
        logout();
        navigate("/auth/login", {
          replace: true,
          state: {
            from: pathname
          }
        });
        toast.info("Você precisa estar logado para acessar o seu perfil");
      }
      else {
        navigate("/movies");
        toast.error("Erro ao carregar as suas informações, favor tentar novamente mais tarde");
      }
    }

  }, [error, status, navigate, pathname]);

  useEffect(() => {
    const status = useFetchFunctionUpdate.status;
    if(status && status === 200) {
      toast.success("Usuário atualizado com sucesso");
    }
    else if(status === 401) {
      logout();
      navigate("/auth/login", {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para atualizar as suas informações");
    }
    else if(status && status !== 422) {
      toast.error("Erro ao tentar atualizar perfil, favor tentar novamente mais tarde");
    }
  }, [useFetchFunctionUpdate.status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files && files.length >= 0) {
      setImage(files.item(0));
    }
  }

  const getServerError = (input: ProfileFormKeys | 'image'): string | undefined => {
    if(error && status && status === 422) {
      const serverError = error as ValidationErrorType;
      return serverError.message[input] && serverError.message[input][0];
    }
  }

  const getErrorMessage = (input: ProfileFormKeys | 'image'): string | undefined => {
    if(input === 'name') {
      return errors[input]?.message || getServerError(input);
    }
    return getServerError(input);
  }

  const isFieldInvalid = (input: ProfileFormKeys | 'image'): boolean => {
    if(input === 'name') {
      return getFieldState(input).invalid || getServerError(input) !== undefined;
    }
    return getServerError(input) !== undefined;
  }

  return (
    <>
      <h3 className="form-title">Atualizar perfil</h3>
      { data && (
        <div className='flex justify-center mb-1'>
          <img
            className="h-32 w-32 rounded-full"
            src={image ? URL.createObjectURL(image) : (data.image ? `${BASE_API_URL}/storage/${data.image}` : UserImage)}
          />
        </div>
      ) }
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="label">Username</label>
          <input
            { ...register('name', {
              required: 'Campo obrigatório',
              minLength: {
                value: 2,
                message: "Nome de usuário deve possuir pelo menos duas letras"
              }
            }) }
            type="text"
            name="name"
            id="name"
            placeholder="Username"
            className={`form ${isFieldInvalid('name') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('name') }</div>
        </div>
        <div className="mb-3">
          <label className="label">Foto</label>
          <input

            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className={`form ${isFieldInvalid('image') && 'is-invalid'}`}
          />
          <div className="error-form-feedback">{ getErrorMessage('image') }</div>
        </div>
        <button
          type="submit"
          className="form-btn"
        >Salvar</button>
      </form>
    </>
  );
}

export default ProfileForm;
