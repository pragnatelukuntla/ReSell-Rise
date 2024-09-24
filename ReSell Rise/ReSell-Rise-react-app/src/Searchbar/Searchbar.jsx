import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Searchbar({ data }) {
  const navigate = useNavigate();

  // Calculate end time as current time + duration
  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + (data.duration *60* 60 * 1000)); // Assuming duration is in minutes

  // Format end time as a statement
  const formattedEndTime = `Auction ends at ${endTime.toLocaleTimeString()} on ${endTime.toDateString()}!!`;

  return (
    <>
      <div
        className=" max-sm:mx-auto mt-3   xl:mx-auto w-[300px] h-[350px] border border-gray-400 rounded-sm  p-2 "
        onClick={() => navigate(`/product_details`, { state: { data } })}
      >
        <div
          key={data}
          className="bg-white h-[160px] p-1 "
          style={{
            backgroundImage: `url(${data.url})`, // Correct interpolation syntax
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="overflow-hidden">
          {5 > 6 && <div className="font-bold w-full text-2xl">{data.price}</div>}

          <div className="font-bold w-full text-2xl">{data.name}</div>
          <div className="mt-1 text-gray-500 text-sm">{data.brand}</div>
          <div className="mt-1 text-gray-500 text-xs">
           <strong>click here to bid</strong>
             
            
            <span className="float-end">${data.price}</span>
          </div>
          <p>{formattedEndTime}</p> 
        </div>
      </div>
    
    </>
  );
}

export default Searchbar;
