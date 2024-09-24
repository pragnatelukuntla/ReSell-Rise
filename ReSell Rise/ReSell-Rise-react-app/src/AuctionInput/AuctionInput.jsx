import { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase/config";

function AuctionInput() {
  const [duration, setDuration] = useState("");
  const [productid, setProductId] = useState("");
  const [auctionId, setAuctionId] = useState(null);

  const handleSellButtonClick = async (productid) => {
    
    try {
    
      const productRef = doc(db, "products", productid);
   
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const productData = productDoc.data();

        const auctionItemId = generateUniqueAuctionId();

        const startTime = new Date();
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + parseInt(duration));

        const updatedProductData = {
          ...productData,
          auctionId: auctionItemId,
          startTime,
          endTime,
          auctionDuration: parseInt(duration), // Add auction duration to the data
        };

        // Update the product document in Firestore with the updated data
        await updateDoc(productRef, updatedProductData);

        // Set the auction ID for display to the user
        setAuctionId(auctionItemId);

        // Reset input fields after successful submission
        setProductId("");
        setDuration("");
        alert("Auction added successfully to the product.");
      } else {
        alert("Product not found");
      }
    } catch (error) {
      console.error("Error adding auction:", error);
      alert("Error adding auction. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full h-lvh bg-gray-200 flex items-center justify-center">
        <div className="lg:w-[35%] drop-shadow-lg w-[100%] h-[670px] rounded-md bg-white border">
          <div
            className="w-full cursor-pointer"
            onClick={() => Cutombackbutton()}
          >
            <IoMdArrowRoundBack size={25} className="mt-4 ml-4" />
          </div>

          <div className="w-full mt-9 text-2xl mb-10 font-bold flex items-center justify-center">
            <span>Set Auction</span>
          </div>

          <div className="w-full mt-3 flex items-center justify-center">
            <input
              className="border-2 backgoundgreenlogin"
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
              placeholder="Item Duration (hours)"
            />
          </div>
          <div className="w-full mt-3 flex items-center justify-center">
            <input
              className="border-2 backgoundgreenlogin"
              onChange={(e) => setProductId(e.target.value)}
              value={productid}
              placeholder="Enter the existing productid"
            />
          </div>

          <div className="w-full mt-7 font-bold text-white flex items-center justify-center">
            <button
              onClick={() => {
                handleSellButtonClick(productid);}}
              className="border-2 backgoundgreenbutton"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuctionInput;
