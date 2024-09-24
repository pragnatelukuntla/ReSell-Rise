import { useState, useContext, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { AuthContext, FirebaseContext } from '../store/FirebaseContext';
import { db, storage } from '../Firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Sell() {
    const [nameChange, setNameChange] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [userUUID, setUserUUID] = useState('');
    const [seller, setSeller] = useState('');
    const [productid, setProductId] = useState('');
    const [duration, setDuration] = useState('');
    const [auctionStartTime, setAuctionStartTime] = useState(null); 

    const { main, setMain } = useContext(AuthContext);
    const [sellerEmail, setSellerEmail] = useState('');
    const [bidderEmail, setbidderEmail] = useState('hey@gmail.com');
    const[status,setStatus]=useState('pending');
    const [comment,setComment]=useState('');
    const navigate = useNavigate();

    useEffect(() => {
        (main) ? setUserUUID(main.uid) : '';
        
        if (main && main.email) {
            setSellerEmail(main.email);
        }
    }, [main]);

    const generateUUID = () => {
        return uuidv4();
    };

    const handleSellButtonClick = async () => {
        if (nameChange.trim() !== '' && category !== '' && price.trim() > 0 && location.trim() !== '') {
            const storageRef = ref(storage, `/images/${image.name}`);
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Image uploaded. Download URL:', downloadURL);

            const newUUID = generateUUID();

            const date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let currentDate = `${day}-${month}-${year}`;

           
            const durationInMs = Number(duration) * 3600000; 
            

            const product = {
                id: newUUID,
                name: nameChange,
                price: Number(price),
                location: location,
                brand: category,
                date: currentDate,
                userid: main.uid,
                url: downloadURL,
                sellerEmail: sellerEmail,
                productid: productid,
                duration: duration,
                bidderEmail:bidderEmail,
                status:status,
                comment
            };

            const refer = doc(db, 'products', newUUID);
            await setDoc(refer, product);
            const currentTime = Math.floor(Date.now() / 1000); 
    localStorage.setItem("auctionStartTime", currentTime);
    
            navigate("/");
        } else {
           
        }
        setNameChange('');
        setCategory('');
        setLocation('');
        setPrice('');
        setProductId('');
        setDuration('');
        setAuctionStartTime(null); 
        setbidderEmail('');
        setStatus('');
    };

    return (
        <>
            <div className='w-full h-lvh bg-gray-200 flex items-center justify-center'>
                
			<div className='lg:w-[35%] drop-shadow-lg w-[100%] h-[670px] rounded-md bg-white border'>
					<div className='w-full cursor-pointer' onClick={() => Cutombackbutton()}>
						<IoMdArrowRoundBack size={25} className='mt-4 ml-4' />
					</div>

					<div className='w-full mt-9 text-2xl mb-10 font-bold flex items-center justify-center'>
						<span>Sell Product</span>
					</div>
					<div className='w-full mt-3 flex items-center justify-center'>
						<input
							className='border-2 backgoundgreenlogin'
							onChange={(e) => setNameChange(e.target.value)}
							value={nameChange}
							placeholder='Product Name'
						></input>
					</div>
					<div className='w-full mt-3 flex items-center justify-center'>
						<input
							className='border-2 backgoundgreenlogin'
							onChange={(e) => setCategory(e.target.value)}
							value={category}
							placeholder='Category'
						></input>
					</div>
					<div className='w-full mt-3 flex items-center justify-center'>
						<input
							className='border-2 backgoundgreenlogin'
							onChange={(e) => setPrice(e.target.value)}
							value={price}
							placeholder='Price'
						></input>
					</div>
					<div className='w-full mt-3 flex items-center justify-center'>
						<input
							className='border-2 backgoundgreenlogin'
							onChange={(e) => setLocation(e.target.value)}
							value={location}
							placeholder='Location'
						></input>
					</div>
					<div className='w-full mt-1 px-14 font-semibold flex justify-start text-xs'>images</div>
					<div className='w-full flex items-center justify-center'>
						<input
							type='file'
							onChange={(e) => setImage(e.target.files[0])}
							className='border-2 py-2 text-sm font-semibold backgoundgreenlogin'
						/>
					</div>
					<div className='w-full mt-3 flex items-center justify-center'>
<input
            className='border-2 backgoundgreenlogin'
            value={sellerEmail} // Set value to sellerEmail
            readOnly // Make the input field read-only
            placeholder='Seller'
        />
</div>
<div className='w-full mt-3 flex items-center justify-center'>
						<input
							className='border-2 backgoundgreenlogin'
							onChange={(e) => setDuration(e.target.value)}
							value={duration}
							placeholder='Enter duration in hours'
						></input>
					</div>

					{image ? (<div className='w-full mt-3 flex items-center justify-center'>
						<img className=' bg-white w-1/2 h-1/2' src={image ? URL.createObjectURL(image) : ''} alt='' />
					</div>) : ''}
					
					<div className='w-full mt-7 font-bold text-white flex items-center justify-center'>
						<button onClick={handleSellButtonClick} className='border-2 backgoundgreenbutton'>
							Sell
						</button>
					</div>
				</div>
            </div>
        </>
    );
}

export default Sell;
