import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { BASE_API_URL } from "../../utils/Contantes";
import GenreType from "../../types/models/GenreType";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import ValidationErrorType from '../../types/ValidationErrorType';
import useFetchFunction from '../../hooks/useFetchFunction';

type Params = {
  id: string;
}

type FormType = {
  name: string,
  image: FileList
}

type FormTypeKeys = keyof FormType;

const GenresEdit = () => {

  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const useFetchObj = useFetch<GenreType>(`${BASE_API_URL}/api/genres/${id}`, {
    headers: {
      "Accept": "application/json"
    }
  });
  const useFetchFunctionObj = useFetchFunction();
  const { register, handleSubmit, formState: { errors }, getFieldState, setValue } = useForm<FormType>();
  const [image, setImage] = useState<File | null>(null);
  const { isAuthenticated, token, hasAnyRole, logout } = useAuth();

  useEffect(() => {
    const error = useFetchObj.error;
    const status = useFetchObj.status;
    if(error && status !== undefined) {
      if(status === 404) {
        toast.info("Gênero não encontrado");
      }
      else {
        toast.error("Algo deu errado, favor tentar novamente mais tarde");
      }
      navigate("/admin/genres");
    }
  }, [useFetchObj.status, useFetchObj.error]);

  useEffect(() => {
    const data = useFetchObj.data;
    if(data) {
      setValue('name', data.name);
    }
  }, [useFetchObj.data])

  const onSubmit = (formValues: FormType) => {
    if(!isAuthenticated()) {
      navigate('/auth/login');
      logout();
      toast.info('Você precisa estar logado para realizar essa ação');
      return;
    }
    if(!hasAnyRole(['worker', 'admin'])) {
      navigate('/');
      toast.info('Você não possui permissão para executar essa ação');
      return;
    }
    const formData = new FormData();
    formData.append('name', formValues.name);
    if(formValues.image && formValues.image.length > 0) {
      formData.append('image', formValues.image.item(0) as File);
    }
    formData.append("_method", "PUT");
    useFetchFunctionObj.fetchFunction(`${BASE_API_URL}/api/genres/${id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })
  }

  useEffect(() => {
    const error = useFetchFunctionObj.error;
    const status = useFetchFunctionObj.status;
    if(error && status !== undefined) {
      if(status === 422) return;
      if(status === 401) {
        navigate('/auth/login');
        logout();
        toast.info("Você precisa estar logado para executar essa ação");
      }
      else if(status === 403) {
        navigate("/admin/genres");
        toast.info("Você não possui autorização para realizar essa ação");
      }
      else if(status === 404) {
        navigate("/admin/genres");
        toast.error("Erro ao atualizar, gênero não encontrado");
      }
    }
  }, [useFetchFunctionObj.error, useFetchFunctionObj.status]);

  useEffect(() => {
    if(useFetchFunctionObj.data) {
      navigate("/admin/genres");
      toast.success("Gênero atualizado com sucesso");
    }
  }, [useFetchFunctionObj.data])

  const getServerError = (input: FormTypeKeys): string | undefined => {
    if(useFetchFunctionObj.error && useFetchFunctionObj.status && useFetchFunctionObj.status === 422) {
      const serverError = useFetchFunctionObj.error as ValidationErrorType;
      return serverError.message[input] && serverError.message[input][0];
    }
  }

  const getErrorMessage = (input: FormTypeKeys): string | undefined => {
    return errors[input]?.message || getServerError(input);
  }

  const isFieldInvalid = (input: FormTypeKeys): boolean => {
    return getFieldState(input).invalid || getServerError(input) !== undefined;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files && files.length >= 0) {
      setImage(files.item(0));
    }
  }

  const canShowImage = (): boolean => {
    const dataImage = useFetchObj.data?.image;
    return image !== null || (dataImage !== undefined && dataImage !== null);
  }

  return (
    <div className="main-form-container">
      { useFetchObj.isLoading && (
        <p className='text-2xl'>Carregando informações</p>
      ) }
      { useFetchObj.isLoading === false && useFetchObj.data !== undefined && (
      <div className="out-form-container max-w-lg">
      <div className="form-card-container">
        <h3 className="form-title">Atualizar gênero</h3>
        { (canShowImage()) && (
          <div className='flex justify-center mb-1'>
            <img
              className="h-32 w-32 rounded-full"
              src={image ? URL.createObjectURL(image) : `${BASE_API_URL}/storage/${useFetchObj.data.image}` }
            />
          </div>
        ) }
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="label" htmlFor="name">Nome</label>
            <input
              { ...register('name', {
                required: 'Campo obrigatório',
                minLength: {
                  value: 2,
                  message: 'Gênero deve possui pelo menos duas letras'
                }
              }) }
              type="text"
              name="name"
              id="name"
              placeholder="Ação"
              className={`form ${isFieldInvalid('name') && 'is-invalid'}`}
            />
            <div className="error-form-feedback">{ getErrorMessage('name') }</div>
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="label">Imagem (opcional)</label>
            <input
              { ...register('image', {

              }) }
              type='file'
              name="image"
              id="image"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className={`form ${isFieldInvalid('image') && 'is-invalid'}`}
            />
            <div className="error-form-feedback">{ getErrorMessage('image') }</div>
          </div>
          <button
            disabled={useFetchFunctionObj.isLoading}
            type="submit"
            className="form-btn"
          >Atualizar</button>
        </form>
      </div>
    </div>
      ) }

    </div>
  );
}

export default GenresEdit;
