import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate';
import coinsmall from "../images/coinsmall.webp";
import telegramicon from "../images/telegram.png";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import TaskOne from '../Components/TaskOne';
import ClaimLeveler from '../Components/ClaimLeveler';
import Levels from '../Components/Levels';
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCheckmarkCircle } from 'react-icons/io5';
import congrats from "../images/celebrate.gif";
import { useUser } from '../context/userContext';
import MilestoneRewards from '../Components/MilestoneRewards';
import ReferralRewards from '../Components/Rewards';
import YoutubeWatch from '../Components/YoutubeWatch';
import SocmedTasks from '../Components/Socmed';
import JoinTelegram from '../Components/JoinTelegram';


const Tasks = () => {


    

    const {id, balance, refBonus, taskCompleted, level, 
      setTaskCompleted, loading} = useUser();
      // eslint-disable-next-line
    const [showModal, setShowModal] = useState(false);
      // eslint-disable-next-line
    const [claimLevel, setClaimLevel] = useState(false);
    const [showLevels, setShowLevels] = useState(false);
    // eslint-disable-next-line
    const [message, setMessage] = useState("");
    const taskID = "task_3100"; // Assign a unique ID to this task


  const [activeIndex, setActiveIndex] = useState(1);

  

  const handleMenu = (index) => {
    setActiveIndex(index);
  };


const taskOne = () => {
    setShowModal(true)
    document.getElementById("footermain").style.zIndex = "50";
}
  
  useEffect(() => {


  checkTaskCompletion(id, taskID).then((completed) => {
    setTaskCompleted(completed);
    if (completed) {
        setMessage("");
    }
});

console.log('my userid is:', id)

        // eslint-disable-next-line
}, []);

const checkTaskCompletion = async (id, taskId) => {
    try {
        const userTaskDocRef = doc(db, 'userTasks', `${id}_${taskId}`);
        const docSnap = await getDoc(userTaskDocRef);
        if (docSnap.exists()) {
            return docSnap.data().completed;
        } else {
            return false;
        }
    } catch (e) {
        console.error('Error checking task completion: ', e);
        return false;
    }
};


const levelsAction = () => {

    setShowLevels(true);

    document.getElementById("footermain").style.zIndex = "50";

  }

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      // return (num / 1000000).toFixed(3).replace(".", ".") + " M";
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    }
  };


  return (

    <>

    {loading ? (
        <Spinner />
      ) : (
    <Animate>
 <div className='w-full justify-center flex-col space-y-3 px-5'>



<div className='fixed top-0 left-0 right-0 pt-8 px-5'>


    <div className="flex space-x-2 justify-center items-center relative">
    <div id="congrat" className='opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all'>
        <img src={congrats} alt="congrats" className="w-full"/>
        </div>
        
            </div>

            <div className='w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center'>

                
                <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Tasks
                </div>

                <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Level
                </div>

                <div onClick={() => handleMenu(3)} className={`${activeIndex === 3 ? 'bg-cards' : ''}  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                    Referral
                </div>

            </div>

            </div>


            <div className='!mt-[60px] w-full h-[70vh] flex flex-col overflow-y-auto'>

            <div className={`${activeIndex === 1 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
                <YoutubeWatch />
                <JoinTelegram />
                

                <SocmedTasks />

            </div>



{/*  */}


            <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>



<MilestoneRewards/>



</div>


{/*  */}


            <div className={`${activeIndex === 3 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>


<ReferralRewards/>







</div>

</div>




<TaskOne showModal={showModal} setShowModal={setShowModal} />
<ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
<Levels showLevels={showLevels} setShowLevels={setShowLevels} />



    </div>
    </Animate>
      )}
      </>
  )
}

export default Tasks