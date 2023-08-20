import NetflixImg from '../../assets/imgs/netflix.svg';
import MovieNightImg from '../../assets/imgs/movie-night.svg'

const Home = () => {

  return (
    <div className='container mx-auto px-4 py-6'>
      <header className='mb-10'>
        <h1 className='text-3xl text-indigo-400 font-bold'>MovieFlix, os melhores filmes estão aqui!</h1>
      </header>
      <div className='grid md:grid-cols-2 justify-center items-center gap-10'>
        <img src={NetflixImg} />
        <img src={MovieNightImg} />
      </div>
    </div>
  );
}

export default Home;
