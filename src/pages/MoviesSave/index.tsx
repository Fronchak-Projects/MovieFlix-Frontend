import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import { BASE_API_URL } from '../../utils/Contantes';
import GenreType from '../../types/models/GenreType';
import useFetchFunction from '../../hooks/useFetchFunction';
import ValidationErrorType from '../../types/ValidationErrorType';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

type FormType = {
  title: string;
  synopsis: string;
}

type FormTypeKeys = keyof FormType;

const MoviesSave = () => {

  const { register, handleSubmit, formState: { errors }, getFieldState, getValues } = useForm<FormType>();
  const { data, isLoading, error, status } = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      "Accept": "application/json"
    }
  });
  const useFetchFunctionObj = useFetchFunction();
  const [image, setImage] = useState<File | null>(null);
  const [genreIds, setGenreIds] = useState<Array<number>>([]);
  const [wasSubmited, setWasSubmited] = useState<boolean>(false);
  const genreIdsError = genreIds.length === 0 ? 'Campo obrigatório' : '';
  const { isAuthenticated, token, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (formValues: FormType) => {
    if(genreIds.length === 0 || image === null) return;
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
    formData.append("title", formValues.title);
    formData.append("synopsis", formValues.synopsis);
    formData.append("image", image);
    genreIds.forEach((genreId) => formData.append("genres[]", genreId + ""));

    useFetchFunctionObj.fetchFunction(`${BASE_API_URL}/api/movies`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })
  }

  const getServerError = (input: FormTypeKeys): string | undefined => {
    const error = useFetchFunctionObj.error;
    const status = useFetchFunctionObj.status;
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const isChecked = e.target.checked;
    if(isChecked) {
      const nextGenreIds = [ ...genreIds, id ];

      setGenreIds(nextGenreIds);
    }
    else {
      const nextGenreIds = genreIds.filter((genreId) => genreId !== id);
      setGenreIds(nextGenreIds);
    }
  }

  return (
    <div className="main-form-container">
      <div className="out-form-container max-w-3xl">
        <div className="form-card-container">
          { isLoading && isLoading === true && (
            <p>Carregando formulário</p>
          ) }
          { isLoading !== undefined && isLoading === false && data && (
            <>
              <h3 className="form-title">Cadastrar novo filme</h3>
              { image && (
                <div className='flex justify-center mb-1'>
                  <img
                    className="h-32 w-32 rounded-full"
                    src={URL.createObjectURL(image)}
                  />
                </div>
              ) }
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                <div>
                  <div className="mb-3">
                    <label className="label" htmlFor="title">Nome</label>
                    <input
                      { ...register('title', {
                        required: 'Campo obrigatório',
                        minLength: {
                          value: 2,
                          message: 'Título deve possui pelo menos duas letras'
                        }
                      }) }
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Ação"
                      className={`form ${isFieldInvalid('title') && 'is-invalid'}`}
                    />
                    <div className="error-form-feedback">{ getErrorMessage('title') }</div>
                  </div>
                  <div className="mb-3">
                    <label className="label" htmlFor="image">Imagem</label>
                    <input
                      type='file'
                      name="image"
                      id="image"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/jpg"
                      className={`form ${wasSubmited && image == null && 'is-invalid'}`}
                    />
                    <div className="error-form-feedback">{ wasSubmited && !image && 'Campo obrigatório' }</div>
                  </div>
                  <div className="mb-3 md:mb-0">
                    <label className='label' >Gêneros</label>
                    <div className='flex flex-wrap gap-2 mb-1'>
                      { data.map((genre) => (
                        <div className="flex gap-1 items-center" key={genre.id}>
                          <input
                            type='checkbox'
                            id={genre.id + ''}
                            onChange={(e) => handleCheckboxChange(e, genre.id)}
                          />
                          <label htmlFor={genre.id + ''}>{ genre.name }</label>
                        </div>
                      )) }
                    </div>
                    <div className="error-form-feedback">{ wasSubmited ? genreIdsError : '' }</div>
                  </div>
                </div>
                <div className="mb-3 md:mb-0">
                  <label className="label" htmlFor="synopsis">Sinopse</label>
                  <textarea
                    { ...register('synopsis', {
                      required: 'Campo obrigatório',
                      minLength: {
                        value: 10,
                        message: "Sinopse deve possuir pelo menos 10 letras"
                      }
                    }) }
                    id="synopsis"
                    name='synopsis'
                    placeholder='Sinopse'
                    rows={6}
                    className={`form resize-y ${isFieldInvalid('synopsis') && 'is-invalid'}`}
                  ></textarea>
                  <div className="error-form-feedback">{ getErrorMessage('synopsis') }</div>
                </div>
                <div className="md:col-span-2 md:text-end md:mt-3">
                  <button
                    disabled={useFetchFunctionObj.isLoading}
                    onClick={() => setWasSubmited(true)}
                    type="submit"
                    className="form-btn md:w-auto md:px-10"
                  >Salvar</button>
                </div>
              </form>
            </>
          ) }
        </div>
      </div>
    </div>
  );
}

export default MoviesSave;
