import React, { useEffect, useState, useContext } from 'react';
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import avtar from '../assets/avatar.avif';
import { IoIosArrowForward } from "react-icons/io";
import './ProductContent.css';
import Layout from '../Layout';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { db } from '../Firebase/config';
import { AuthContext, FirebaseContext } from "../store/FirebaseContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function ProductContent() {
  const { state } = useLocation();
  const { data } = state;
  const [sellerData, setSellerData] = useState({});
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(data.price);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [productStatus, setProductStatus] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const { firebase } = useContext(FirebaseContext);
  const auth = getAuth(firebase);
  const db = getFirestore(firebase);

  useEffect(() => {
    const fetchSellerDoc = async () => {
      const sellerInfo = await getDoc(doc(db, 'users', data.userid));
      setSellerData(sellerInfo.data());
    };
    fetchSellerDoc();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = await getDoc(doc(db, 'users', uid));
        const userEmail = docRef.data().email;
        const userName = docRef.data().username;
        setCurrentUserEmail(userEmail);
        setCurrentUserName(userName);
      } else {
        setCurrentUserEmail(null);
        setCurrentUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + (data.duration * 60 * 60 * 1000));

  const handleBidSubmit = async () => {
    if (parseFloat(bidPrice) > parseFloat(data.price) && currentTime <= endTime) {
      const productRef = doc(db, 'products', data.id);
      await updateDoc(productRef, {
        price: parseFloat(bidPrice),
        bidderEmail: currentUserEmail
      });
      setCurrentPrice(parseFloat(bidPrice));
      alert('Bid submitted');
      setBidPrice('');
      setShowBidForm(false);
    } else {
      alert('Bid price must be greater than the current price!');
    }
  };

  const handleProductStatusUpdate = async (status) => {
    const productRef = doc(db, 'products', data.id);
    const updateData = {
      status: status
    };
    if (status === 'Rejected') {
      updateData.rejectComment = rejectComment;
    }
    await updateDoc(productRef, updateData);
    setProductStatus(status);
    alert(`Product ${status}`);
    if (status === 'Rejected') {
      setRejectComment('');
    }
  };


  const isAuthorizedUser = currentUserEmail === 'venkat123@gmail.com' && currentUserName === 'venkat';

  return (
    <>
      <Layout>
        <div className='w-full py-4 xl:h-[750px] h-[1300px] grid xl:flex md:justify-center  bg-gray-200'>
          <div className=' lg:w-[830px]    h-[670px] rounded-md'>
            <div className='h-[450px]  max-lg:w-full rounded-md bg-black' style={{ backgroundImage: `url(${data.url})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} ></div>
            <div className='description rounded-md   mt-1 p-4 h-[180px] bg-white xl:h-[130px] border'>
              <div className='text-xl font-bold'>Details</div>
              <div className='text-md py-3 lg:w-[50%] w-[100%]'><span className='text-gray-500'>Brand</span><span className='float-right'>{data.brand}</span></div>
              <hr className='text-gray-500 mt-2' />
            </div>
          </div>
          <div className=' xl:ml-4 xl:w-[400px]  h-[400px] rounded-md max-sm:w-full'>
            <div className=' h-[160px] border bg-white  rounded-md p-3'>
              <div className='font-bold text-3xl'>
                <span>{currentPrice}</span>
                <span className='float-end flex'>
                  <AiOutlineShareAlt size={24} />
                  <IoMdHeartEmpty size={24} className='ml-2' />
                </span>
              </div>
              <div className='text-gray-600 mt-4'>{data.name}</div>
              <div className='text-xs mt-8'><span>{data.location}, India</span> <span className='float-right ml-1'>{data.date}</span></div>
            </div>
            <div className='h-[160px]  border bg-white   rounded-md mt-4  flex flex-col justify-between p-4'>
              <div className='flex items-center'>
                <img className='w-[60px] rounded-[100px]' src={avtar} alt="" />
                <span className='ml-2 font-bold'>{sellerData.username}</span>
                <span className='text-black ml-[305px] lg:ml-[650px] xl:ml-[230px]'><IoIosArrowForward /></span>
              </div>
              <span className='ml-2 font-bold'>If you have any queries:</span>
              <div className='px-2 py-2 border border-black cursor-pointer flex justify-center font-bold mt-1 rounded-md'>{sellerData.email}</div>
            </div>
            <div className=' h-[100px] border bg-white   rounded-md mt-4  p-4'>
              <div className='font-bold text-2xl'>
                <span>Posted In</span>
              </div>
              <div className='text-xs mt-4'><span>{data.location}, India</span> <span className='float-right'>{data.date}</span></div>
            </div>

            {showBidForm && (
              <div className='mt-3'>
                <input
                  type='number'
                  placeholder='Enter your bid price'
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                />
                <button onClick={handleBidSubmit}>Submit Bid</button>
              </div>
            )}
            {!showBidForm && (
              <div className=' h-[150px] border bg-white   rounded-md mt-4  p-4'>
                <div className='font-bold text-2xl'>
                  <button onClick={() => setShowBidForm(true)}>Click me to bid!!</button>
                </div>
                <div className='text-xs mt-4 ' style={{ fontSize: '14px' }}><strong>Current Price: ${currentPrice}</strong></div>
              </div>
            )}
            {isAuthorizedUser && (
              <div className=' h-[150px] border bg-white   rounded-md mt-4  p-4'>
                <div className='font-bold text-2xl'>
                  <span>Update Product Status</span>
                </div>
                <div className='mt-4'>
                  <input
                    type='radio'
                    id='approve'
                    name='status'
                    value='Approved'
                    onChange={() => handleProductStatusUpdate('Approved')}
                  />
                  <label htmlFor='approve'>Approve</label>
                  <input
                    type='radio'
                    id='reject'
                    name='status'
                    value='Rejected'
                    onChange={() => handleProductStatusUpdate('Rejected')}
                  />
                  <label htmlFor='reject'>Reject</label>
                </div>
				{productStatus === 'Rejected' && (
                  <div className='mt-3'>
                    <textarea
                      placeholder='Enter your comment'
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                    />
                    <button onClick={() => handleProductStatusUpdate('Rejected')}>Submit Comment</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ProductContent;
