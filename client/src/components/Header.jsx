/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/properties?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4 gap-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-40 cursor-pointer" />
        </Link>

        <form
          className={`p-1 rounded-lg flex items-center border border-gray-300  ${
            menuOpen ? "hidden" : "flex"
          }`}
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none w-full p-2 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="text-green-600 p-2 rounded-full hover:bg-green-100 transition-colors"
          >
            <FaSearch size={20} />
          </button>
        </form>

        <button
          className="ml-4 block sm:hidden text-green-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <nav
          className={`fixed inset-0 bg-white z-40 transition-transform transform ${
            menuOpen ? "translate-y-0" : "translate-y-full"
          } sm:relative sm:translate-y-0 sm:flex sm:items-center sm:gap-8`}
        >
          <div className="flex flex-col items-center pt-8 sm:pt-0">
            <div className="flex justify-between items-center w-full px-4 sm:hidden">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img src={logo} alt="Logo" className="w-32" />
              </Link>
              <button
                className="text-green-600"
                onClick={() => setMenuOpen(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="flex flex-col items-center gap-6 sm:gap-8 mt-32 sm:mt-0 sm:flex-row text-lg sm:text-base font-medium">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  Contact
                </Link>
              </li>
              {currentUser && (
                <>
                  <li className="hidden sm:block">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="rounded-full h-8 w-8 object-cover border-2 border-green-600"
                      />
                    </Link>
                  </li>
                  <li className="block sm:hidden">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className=" text-green-600 hover:text-green-700 transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </>
              )}
              {!currentUser && (
                <li>
                  <Link
                    to="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
