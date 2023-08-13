import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import useFetchFunction from '../../hooks/useFetchFunction';
import ValidationErrorType from '../../types/ValidationErrorType';
import { BASE_API_URL } from '../../utils/Contantes';
import { toast } from "react-toastify";
import useAuth from '../../hooks/useAuth';

type FormType = {
  name: string,
  image: FileList
}

type FormTypeKeys = keyof FormType;

const GenresSave = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState } = useForm<FormType>();
  const { data, error, isLoading, fetchFunction, status } = useFetchFunction();
  const [image, setImage] = useState<File | null>(null);
  const { isAuthenticated, token, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (formValues: FormType) => {
    if(!isAuthenticated()) {
      navigate('/auth/login');
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
    fetchFunction(`${BASE_API_URL}/api/genres`, {
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
      toast.success("Gênero cadastrado com sucesso");
      navigate('/genres');
    }
  }, [data, navigate]);

  const getServerError = (input: FormTypeKeys): string | undefined => {
    if(error && status && status === 422) {
      const serverError = error as ValidationErrorType;
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

  return (
    <div className="main-form-container">
      <div className="out-form-container max-w-lg">
        <div className="form-card-container">
          <h3 className="form-title">Cadastrar novo gênero</h3>
          { image && (
            <div className='flex justify-center mb-1'>
              <img
                className="h-32 w-32 rounded-full"
                src={URL.createObjectURL(image)}
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
              disabled={isLoading}
              type="submit"
              className="form-btn"
            >Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GenresSave;
