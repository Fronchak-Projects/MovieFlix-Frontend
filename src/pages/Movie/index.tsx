import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import MovieType from "../../types/models/MovieType";
import useAuth from "../../hooks/useAuth";
import { BASE_API_URL } from "../../utils/Contantes";
import useFetchFunction from '../../hooks/useFetchFunction';
import UserReviewType from '../../types/models/UserReviewType';
import { useForm } from 'react-hook-form';
import ValidationErrorType from '../../types/ValidationErrorType';
import { toast } from 'react-toastify';
import MovieReviewType from '../../types/models/MovieReviewType';
import UserImage from '../../assets/imgs/user.png';
import Stars from '../../components/Stars';

type FormType = {
  rating: number;
  comment: string;
}

type FormTypeKeys = keyof FormType;

const ratings: Array<number> = [];

for(let i = 0; i <= 5; i = i + 0.5) {
  ratings.push(i);
}

const numberFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1
});

const Movie = () => {

  const { id } = useParams();
  const { token, hasAnyRole, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const movieFetchFunction = useFetchFunction<MovieType>();
  const refEffect = useRef<boolean>(false);
  const myReviewFetchFunction = useFetchFunction<UserReviewType>();
  const reviewsFetchFunction = useFetchFunction<Array<MovieReviewType>>();
  const saveReviewFetchFunction = useFetchFunction();
  const { register, handleSubmit, formState: { errors }, getFieldState } = useForm<FormType>();

  useEffect(() => {
    if(refEffect.current === false) {
      movieFetchFunction.fetchFunction(`${BASE_API_URL}/api/movies/${id}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      myReviewFetchFunction.fetchFunction(`${BASE_API_URL}/api/users/my-reviews/movies/${id}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      reviewsFetchFunction.fetchFunction(`${BASE_API_URL}/api/movies/${id}/reviews`, {
        headers: {
          "Accept": "application/json"
        }
      });
    }

    return () => {
      refEffect.current = true;
    }
  }, [id, movieFetchFunction.fetchFunction, myReviewFetchFunction.fetchFunction]);

  const movie = movieFetchFunction.data;
  const myReview = myReviewFetchFunction.data;
  const myReviewStatus = myReviewFetchFunction.status;
  const reviews = reviewsFetchFunction.data;

  const canShowReviewForm = (): boolean => {
    return myReviewFetchFunction.status === 404 && hasAnyRole(['admin', 'member', 'worker']);
  }

  const onSubmit = (formData: FormType) => {
    if(!isAuthenticated()) {
      logout();
      navigate("/auth/login", {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para avaliar um filme");
      return;
    }
    if(!hasAnyRole(['admin', 'worker', 'member'])) {
      toast.info('Você não possui permissão para avaliar o filme');
      return;
    }
    saveReviewFetchFunction.fetchFunction(`${BASE_API_URL}/api/movies/${id}/reviews`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

  }

  useEffect(() => {
    const status = saveReviewFetchFunction.status;
    if(status === 201) {
      movieFetchFunction.fetchFunction(`${BASE_API_URL}/api/movies/${id}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      myReviewFetchFunction.fetchFunction(`${BASE_API_URL}/api/users/my-reviews/movies/${id}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      reviewsFetchFunction.fetchFunction(`${BASE_API_URL}/api/movies/${id}/reviews`, {
        headers: {
          "Accept": "application/json"
        }
      });
    }
  }, [saveReviewFetchFunction.status]);

  const getServerError = (input: FormTypeKeys): string | undefined => {
    const error = myReviewFetchFunction.error;
    const status = myReviewFetchFunction.status;
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

  return (
    <div className='container px-2 mx-auto py-4 md:py-8'>
      { movie && (
        <div className='bg-white text-black rounded-lg grid md:grid-cols-2'>
          <img
            src={`${BASE_API_URL}/storage/${movie.image}`}
            className='w-full rounded-t-lg md:rounded-tr-none max-h-96'
          />
          <div className='p-4'>
            <h1 className='text-3xl font-bold mb-3'>{ movie.title }</h1>
            <div className='flex flex-wrap gap-3'>
              { movie.genres.map((genre) => (
                genre.image ? (
                  <div className='bg-blue-300 border-2 border-blue-600 text-blue-700 rounded-full flex items-center gap-3 pr-5 h-10' key={genre.id}>
                    { genre.image && <img src={`${BASE_API_URL}/storage/${genre.image}`} className='h-10 w-10 rounded-full'/> }
                    <span>{ genre.name }</span>
                  </div>
                ) : (
                  <div className='bg-blue-300 border-2 border-blue-600 text-blue-700 rounded-full flex items-center px-5 h-10' key={genre.id}>
                    <span>{ genre.name }</span>
                  </div>
                )
              )) }
            </div>
            { movie.rating && (
            <div className='flex gap-2 mt-3 text-3xl items-center'>
              <Stars rating={movie.rating} />
              <span className='text-yellow-400 text-2xl font-bold'>{ numberFormat.format(movie.rating) }/{ numberFormat.format(5) }</span>
            </div>
          ) }
          </div>
          <div className='p-4 md:col-span-2'>
            <p className='leading-relaxed text-gray-700'>{ movie.synopsis }</p>
          </div>
        </div>
      ) }
      { canShowReviewForm() && (
        <div className='bg-white px-4 py-2 rounded-lg mt-6'>
          <h3 className='text-2xl font-bold mb-3'>Adicione a sua avaliação do filme</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>

              <label className='label'>Sua nota: </label>
              <select
                { ...register('rating', {
                  required: 'Campo obrigatório',
                  min: {
                    value: 0,
                    message: 'Campo obrigatório'
                  },
                  max: {
                    value: 5,
                    message: 'Nota não pode ser superior do que 5'
                  }
                }) }
                id="rating"
                name='rating'
                defaultValue={-1}
                className={`px-2 py-1 rounded-md text-black placeholder:text-gray-400 border border-gray-400 outline-none ${isFieldInvalid('rating') && 'is-invalid'}`}
              >
                <option value={-1} disabled>Selecione uma nota</option>
                { ratings.map((rating) => (
                  <option key={rating} value={rating}>{ numberFormat.format(rating) }</option>
                )) }
              </select>
              <div className='error-form-feedback'>{ getErrorMessage('rating') }</div>
            </div>
            <div className='mb-3'>
              <label className='label'>Comentário (opcional):</label>
              <textarea
                { ...register('comment') }
                id='comment'
                name="comment"
                rows={2}
                placeholder='Muito bom, nota 10'
                className={`form resize-y ${isFieldInvalid('comment') && 'is-invalid'}`}
              ></textarea>
              <div className='error-form-feedback'>{ getErrorMessage('comment') }</div>
            </div>
            <button
              type='submit'
              className='btn px-2 py-1 bg-blue-500 hover:bg-blue-700'
            >Salvar avaliação</button>
          </form>
        </div>
      ) }
      { reviews && (
          <div className='mt-6 bg-white rounded-sm p-2'>
            <header className='mb-3'>
              <h3 className='text-2xl font-bold'>Avaliações</h3>
            </header>
            { reviews.length > 0 ? (
              <>

                { reviews.map((review) => (
                  <div className='mb-3 text-emerald-700' key={review.id}>
                    <div className='flex justify-between items-center px-6 py-2 bg-emerald-200 border-2 border-emerald-600 rounded-tl-3xl rounded-tr-3xl'>
                      <div className='flex gap-2 items-center'>
                        <img
                          src={review.user.image ? `${BASE_API_URL}/storage/${review.user.image}` : UserImage}
                          className='h-10 w-10 rounded-full'
                        />
                        <span className='text-emerald-700 text-md'>{ review.user.name }</span>
                      </div>
                      <div>{ numberFormat.format(review.rating) } / 5</div>
                    </div>
                    { review.comment && (
                      <div className='px-6 py-2 bg-emerald-200 border-2 border-emerald-600 border-t-0'>
                        { review.comment }
                      </div>
                    ) }

                  </div>
                ))}
              </>
            ) : (
              <p>Esse filme ainda não possui nenhuma avaliação, seja o primeiro a dar uma nota</p>
            ) }
          </div>
      ) }
    </div>
  )
}

export default Movie;
