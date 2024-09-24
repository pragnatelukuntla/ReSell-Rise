import React, { useEffect, useState, useContext } from "react";
import SellerItems from "../SellerItems/SellerItems";
import "./SellerAdding.css";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase/config";
import { AuthContext } from "../store/FirebaseContext";

function CardAdding() {
  const [products, setProducts] = useState([]);
  const { user, set, email, setEmail } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      const docRef = collection(db, "products");
      const docSnap = await getDocs(docRef);
      const arr = docSnap.docs.map((doc) =>
        email == doc.data().sellerEmail ? doc.data() : ""
      );

      setProducts(arr);
    };
    fetchData();                                                                                                    
  }, []);
  return (
    <>
      <div className=" container max-sm:grid-cols-1 max-sm:mx-auto mx-auto md:grid-cols-2 2xl:mx-auto xl:mx-auto md:gap-0 2xl:grid-cols-4 md:mx-auto  lg:mx-auto mt-6 grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0  2xl:gap-0  xl:gap-0">
        {products.map((item, index) => {
          if (item) {
            return <SellerItems key={index} data={item} />;
          }
        })}
      </div>
    </>
  );
}

export default CardAdding;
