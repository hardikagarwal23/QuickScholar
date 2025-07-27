import React, { useContext, useState, useEffect } from 'react';
import { LuFilter } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';


const Header = () => {
  const { setToken, posts, searchQuery, setSearchQuery, setFilteredPosts, uniqueStates, uniqueProviders, isProfileCompleted, profile } = useContext(AppContext);

  const [dropDown, setDropDown] = useState(false);
  const [offeredBy, setOfferedBy] = useState('');
  const [state, setState] = useState('');
  const [filter, setFilter] = useState(false);
  const [matchByProfile, setMatchByProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const matching = () => {
    if (!isProfileCompleted) return;
    setMatchByProfile((prev) => !prev);
  };

  const clearFilters = () => {
    setOfferedBy('');
    setState('');
  };

  useEffect(() => {
    let filtered = posts;

    if (matchByProfile && isProfileCompleted) {
      filtered = filtered.filter((post) => {
        const stateMatch = post.state.toLowerCase().includes(profile.state.toLowerCase());
        const gpaMatch = post.mingpa === "--" || post.mingpa <= profile.GPA;

        let amountMatch = false;
        const amountStr = post.amount.toLowerCase();

        if (amountStr.includes("varies")) {
          amountMatch = true;
        } else {
          let numStr = "";
          for (let i = 0; i < post.amount.length; i++) {
            const ch = post.amount[i];
            if (ch >= '0' && ch <= '9') {
              numStr += ch;
            } else if (ch === ',' || ch === ' ' || ch === '$') {
              continue;
            } else if (numStr.length > 0) {
              break;
            }
          }

          const num = Number(numStr);
          if (!isNaN(num) && num >= profile.preferredAmount) {
            amountMatch = true;
          }
        }

        return stateMatch && gpaMatch && amountMatch;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (offeredBy) {
      filtered = filtered.filter((post) => post.provider === offeredBy);
    }
    if (state) {
      filtered = filtered.filter((post) => post.state === state);
    }

    setFilteredPosts(filtered);
  }, [posts, matchByProfile, isProfileCompleted, profile, searchQuery, offeredBy, state]);

  return (
    <div className="bg-purple-200 px-6 sm:px-10 py-4 relative">
      {/* Header Row */}
      <div className="flex flex-col xl:flex-row justify-between items-center flex-wrap gap-4">
        
        <a className="text-3xl font-bold text-center sm:text-left cursor-pointer" href='/'>QuickScholar</a>

        {/* Search & Menu */}
        <div className="flex flex-col sm:flex-row items-center gap-x-3 w-full sm:max-w-max">
          <div className="flex items-center w-full md:w-72  rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-400 bg-white">
            <input
              type="text"
              placeholder="Search scholarships by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 w-full outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 mr-2"
                aria-label="Clear search"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div
            onClick={() => setMobileMenu((prev) => !prev)}
            className="flex sm:hidden w-full justify-between items-center mt-2 px-4 py-1 bg-white rounded-lg font-semibold cursor-pointer"
          >
            Menu
            <span className={`inline-block text-3xl transform transition-transform duration-200 ${mobileMenu ? 'rotate-45' : ''}`}>
              +
            </span>
          </div>

          {/* Mobile Menu Options */}
          <AnimatePresence>
            {mobileMenu && (

              <motion.div
                key="mobileMenu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0.1, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex flex-col gap-y-2 mt-2 bg-purple-100 rounded-md p-2 w-full"
              >

                <div
                  onClick={() => {
                    setDropDown((prev) => !prev);
                    setFilter((prev) => !prev);
                  }}
                  className="flex items-center gap-2  px-4 py-2 bg-white rounded-lg font-semibold cursor-pointer hover:bg-purple-100 transition whitespace-nowrap"
                >
                  <span className='flex-shrink-0'>See Filters</span>
                  <LuFilter className={`flex-shrink-0 ${filter ? 'fill-black' : ''}`} size={20} />
                </div>

                <NavLink to="/profile">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-100 cursor-pointer rounded-lg font-semibold transition">
                    <span>Profile</span>
                  </div>
                </NavLink>

                <div
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-lg font-semibold transition"
                >
                  <span className="flex items-center gap-1 group">
                    LogOut <span className="group-hover:translate-x-2 transition"><MdLogout /></span>
                  </span>
                </div>


              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Buttons */}
          {!mobileMenu && (
            <>
              <div
                onClick={() => {
                  setDropDown((prev) => !prev);
                  setFilter((prev) => !prev);
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg font-semibold cursor-pointer hover:bg-purple-100 transition"
              >
                <span>See Filters</span>
                <LuFilter className={`${filter ? 'fill-black' : ''}`} size={20} />
              </div>

              <NavLink to="/profile">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-100 cursor-pointer rounded-lg font-semibold transition">
                  <span>Profile</span>
                </div>
              </NavLink>

              <div
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-lg font-semibold transition"
              >
                <span className="flex items-center gap-1 group">
                  LogOut <span className="group-hover:translate-x-2 transition"><MdLogout /></span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters Dropdown */}

      {dropDown && (
        <div className="bg-white rounded-lg shadow-md mt-4 p-4 flex flex-col sm:flex-row sm:justify-between flex-wrap gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2">
            <select
              value={offeredBy}
              onChange={(e) => setOfferedBy(e.target.value)}
              className="border p-2 rounded-md w-full sm:max-w-3xl cursor-pointer"
            >
              <option value="">Offered By</option>
              {uniqueProviders.map((prov, idx) => (
                <option key={idx} value={prov}>
                  {prov}
                </option>
              ))}
            </select>

            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border p-2 rounded-md w-full sm:w-auto cursor-pointer"
            >
              <option value="">State</option>
              {uniqueStates.map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full sm:w-auto cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          <div
            onClick={matching}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${isProfileCompleted
              ? matchByProfile
                ? 'bg-gradient-to-tr from-purple-500 to-purple-400 cursor-pointer'
                : 'bg-gradient-to-tr from-purple-400 to-purple-300 hover:from-purple-500 hover:to-purple-400 cursor-pointer'
              : 'bg-gradient-to-tr from-gray-400 to-gray-300 pointer-events-none cursor-not-allowed'
              }`}
          >
            <span>Match by profile ✦</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
