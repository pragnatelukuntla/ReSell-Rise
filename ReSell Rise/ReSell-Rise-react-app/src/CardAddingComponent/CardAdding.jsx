import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import banner from "../assets/under_banner.png";
import "./CardAdding.css";
import Layout from "../Layout";
import { collection, doc, getDoc, getDocs,where,query } from "firebase/firestore";
import { db } from "../Firebase/config";

function CardAdding() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = collection(db, "products");
      const q = query(docRef, where("status", "==", "Approved")); // Query to get only approved products
      const docSnap = await getDocs(q);
      const arr = docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(arr);
    };
    fetchData();
  }, []);
  return (
    <>
      <Layout>
        <div className="2xl:mx-36">
          <div className="2xl:ml-[5px] xl:ml-[90px] lg:ml-[80px] md:ml-[70px] text-2xl mt-4">
            {" "}
            Fresh recommendations
          </div>
          <div className=" container max-sm:grid-cols-1 max-sm:mx-auto mx-auto md:grid-cols-2 2xl:mx-auto xl:mx-auto md:gap-0 2xl:grid-cols-4 md:mx-auto  lg:mx-auto mt-6 grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0  2xl:gap-0  xl:gap-0">
            {products.map((item, index) => (
              <Card key={index} data={item} />
            ))}
          </div>
        </div>
        
        <img className="mt-2 w-full banner" src={banner} alt="" />
      </Layout>
    </>
  );
}

export default CardAdding;
