const Footer = () => {

  return (
    <footer className="py-10 bg-black text-white">
      <div className="container px-2 mx-auto grid sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-start gap-y-4">
        <div>
          <h4 className="text-lg uppercase mb-3">Resources</h4>
          <ul>
            <li><a href="#" className="footer-link">About</a></li>
            <li><a href="#" className="footer-link">Resource listing</a></li>
            <li><a href="#" className="footer-link">Press kit</a></li>
            <li><a href="#" className="footer-link">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg uppercase mb-3">Help</h4>
          <ul>
            <li><a href="#" className="footer-link">Stack Overflow</a></li>
            <li><a href="#" className="footer-link">Join Discord</a></li>
            <li><a href="#" className="footer-link">Gitter</a></li>
            <li><a href="#" className="footer-link">Report Issues</a></li>
            <li><a href="#" className="footer-link">Code of Conduct</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg uppercase mb-3">Community</h4>
          <ul>
            <li><a href="#" className="footer-link">Events</a></li>
            <li><a href="#" className="footer-link">Meetups</a></li>
            <li><a href="#" className="footer-link">Twitter</a></li>
            <li><a href="#" className="footer-link">GitHub</a></li>
            <li><a href="#" className="footer-link">Contribute</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg uppercase mb-3">Languages</h4>
          <ul>
            <li><a href="#" className="footer-link">English</a></li>
            <li><a href="#" className="footer-link">Español</a></li>
            <li><a href="#" className="footer-link">Portuguese</a></li>
            <li><a href="#" className="footer-link">简体中文版</a></li>
            <li><a href="#" className="footer-link">Complete language list</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-10 mt-5 border-t border-gray-300">
        <p className="text-center">Copyright &copy; 2023 - MovieFlix</p>
      </div>
    </footer>
  );
}

export default Footer;
