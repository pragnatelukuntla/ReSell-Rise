import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function SellerItems({ data }) {
  const navigate = useNavigate();
  
  const [productId, setProductId] = useState('');
    const [duration, setDuration] = useState('');
    const [auctionId, setAuctionId] = useState(null);
 
  return (
    <>
      <div
        className="max-sm:mx-auto mt-3 xl:mx-auto w-[300px] h-[350px] border border-gray-400 rounded-sm p-2"
        
      >
        <div
          key={data}
          className="bg-white h-[160px] p-1"
          style={{
            backgroundImage: `url(${data.url})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="overflow-hidden">
          <div className="font-bold w-full text-2xl">{data.price}</div>
          <div className="text-base">{data.name}</div>
          <div className="mt-1 text-gray-500 text-sm">{data.brand}</div>
          <div className="mt-1 text-gray-500 text-sm">{data.productid}</div>
          <div className="mt-1 text-red-800 text-sm">{data.status}</div>
          <div className="mt-1 text-black-500 text-sm">{data.rejectComment}</div>

        </div>
      </div>
      
    </>
  );
}

export default SellerItems;
