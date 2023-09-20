import { useRouteError } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const ErrorPage = () => {

  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="text-center text-lg px-5">
          <div className="bg-red-400 border-red-700 border rounded-lg text-white py-5 px-10 my-10 inline-block">
            <h1>Oops!</h1>
            <p >Sorry, an unexpected error has occurred</p>
            <hr className="my-2" />
            <p><i>{error.statusText || error.message}</i></p>
          </div>
        </div>
      </div>
      <Footer />
    </ div>
  )
}

export default ErrorPage;
