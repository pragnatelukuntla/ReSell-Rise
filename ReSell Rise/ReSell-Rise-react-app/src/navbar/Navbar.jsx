import React, { useContext, useState, useEffect } from "react";
import logo from "../assets/rr.png";
import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import Searchbar from "../Searchbar/Searchbar";
import "./Navbar.css";
import { AuthContext, FirebaseContext } from "../store/FirebaseContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getDocs, getFirestore, where, collection, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";

function Navbar() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { firebase } = useContext(FirebaseContext);
  const auth = getAuth(firebase);
  const db = getFirestore(firebase);
  const { main, setMain, email, setEmail } = useContext(AuthContext);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchResults = async (field, value) => {
    try {
      const q = query(collection(db, "products"), where(field, "==", value));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    } catch (error) {
      console.error(`Error fetching results for ${field}:`, error);
    }
  };

  const handleCategorySearch = async (e) => {
    const value = e.target.value;
    setSearchCategory(value);
  }

  const handleLocationSearch = async (e) => {
    const { value } = e.target;
    setSearchLocation(value);
  }

  useEffect(() => {
    if (searchLocation) {
      fetchResults("location", searchLocation);
    } else if (searchCategory) {
      fetchResults("brand", searchCategory);
    } else {
      setSearchResults([]);
    }
  }, [searchLocation, searchCategory]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docref = await getDoc(doc(db, "users", uid));
        const name = docref.data().username;
        const e = docref.data().email;
        setEmail(e);
        setName(name);
        setMain(user);
      } else {
        console.log("no user");
      }
    });

    return () => unsubscribe();
  }, [auth, db, setEmail, setMain]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      signOut(auth)
        .then(() => {
          console.log("User logged out successfully");
          setName("");
          setEmail("");
          setMain(null);
        })
        .catch((error) => {
          console.error("Error logging out:", error.message);
        });
    }
  };

  return (
    <>
      <div className="w-full h-[75px] bg-white shadow-md fixed">
        <div className="w-full h-[70px] flex align-middle justify-center items-center bg-gray-100">
          <div></div>
          <img
            className="ml-5 2xl:left-32 left-2 fixed w-[50px] h-[37px]"
            src={logo}
            alt=""
          />
          <div className="flex 2xl:left-44 md:left-14 fixed">
            <div className="ml-7 inputborder max-md:hidden w-full md:w-[300px] 2xl:w-[250px] bg-white h-[50px] border-2 flex items-center justify-between p-1">
              <CiSearch size={25} className="" />
              <input
                placeholder="Search city, area or loca..."
                className="p-2 w-full md:w-[240px] 2xl:w-[180px] 2xl:p-1"
                value={searchLocation}
                onChange={handleLocationSearch}
              />
            </div>
            <div className="inputborder ml-3 w-full max-lg:hidden lg:w-[250px] xl:w-[450px] 2xl:w-[650px] bg-white h-[50px] border-2 flex items-center justify-between">
              <input
                placeholder="Find Cars, Mobile Phones and more..."
                className="p-2 w-full md:w-[340px]"
                value={searchCategory}
                onChange={handleCategorySearch}
              />
              <div className="backgoundgreen p-2 text-white">
                <IoSearch size={30} className="" />
              </div>
            </div>
          </div>

          <div className="flex greenycolor items-center fixed right-4 md:right-0 lg:right-0 xl:right-14 2xl:right-36">
            <div className="flex max-md:hidden text-sm font-bold cursor-pointer" onClick={() => navigate(email === "venkat123@gmail.com" ? "/verify" : "/display_items")}>
              {email === "venkat123@gmail.com" ? "Verify" : "Display"}
            </div>

            <div>
              {name ? (
                <div className="flex align-middle items-center">
                  <p className="font-bold mx-6">{name}</p>
                  <button onClick={() => handleLogout()}>
                    <HiOutlineLogout size={30} />
                  </button>
                </div>
              ) : (
                <div className="flex font-bold underline ml-4 cursor-pointer" onClick={() => navigate("/login")}>
                  Login
                </div>
              )}
            </div>
            <div className="sell-button flex items-center shadow-sm font-bold px-3 cursor-pointer bg-white ml-3" onClick={() => navigate("/sell")}>
              <FaPlus size={19} />
              &nbsp;AUCTION & SELL
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[80px]"></div>

      <div className="container max-sm:grid-cols-1 max-sm:mx-auto mx-auto md:grid-cols-2 2xl:mx-auto xl:mx-auto md:gap-0 2xl:grid-cols-4 md:mx-auto lg:mx-auto mt-6 grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 2xl:gap-0 xl:gap-0">
        {searchResults.map((item, index) => (
          <Searchbar key={index} data={item} />
        ))}
      </div>
    </>
  );
}

export default Navbar;
