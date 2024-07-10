import coinsmall from "../images/coinsmall.webp";
import claim from "../images/claim.webp";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { EnergyContext } from "../context/EnergyContext";

const TaskOne = ({ showModal, setShowModal }) => {
  const { count, setCount } = useContext(EnergyContext);
  const [idme, setIdme] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [message, setMessage] = useState("");
  const [showTaskButton, setShowTaskButton] = useState(true);
  const [counter, setCounter] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const taskID = "task_3100"; // Assign a unique ID to this task
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  const [isMissionButtonDisabled, setIsMissionButtonDisabled] = useState(true);

  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowModal(false);
      document.getElementById("footermain").style.zIndex = "";
    };

    if (showModal) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    // Cleanup handler when component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showModal, setShowModal]);

  useEffect(() => {
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (telegramUserid) {
      setIdme(telegramUserid);
    }

    if (telegramUserid) {
      fetchCountFromFirestore(telegramUserid).then((userCount) => {
        setCount(userCount);
      });

      checkTaskCompletion(telegramUserid, taskID).then((completed) => {
        setTaskCompleted(completed);
        if (completed) {
          setMessage("");
          setIsMissionButtonDisabled(false);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleTaskLinkClick = () => {
    window.open("https://t.me/teteknibos");

    setTimeout(() => {
      setShowTaskButton(false);
    }, 2000);
    setTimeout(() => {
      setShowCheckButton(true);
    }, 2000);
  };

  const handleVerify = async () => {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    const response = await fetch(
      `https://api.telegram.org/bot7436444125:AAGB8IwBNOvRbpW-AjR0HPvMOC0qGSTnILU/getChatMember?chat_id=-1002244181550&user_id=${idme}`
    );
    const data = await response.json();

    if (data.ok && data.result.status === "member") {
      setIsVerified(true);
      setCounter(15);
      setTimeout(() => {
        setShowDoneButton(true);
      }, 3000);
      setTimeout(() => {
        setShowCheckButton(false);
        setMessage("");
        setIsMissionButtonDisabled(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setMessage(
          "Please join the Telegram channel first before you can claim this task bonus."
        );
      }, 1000);
      setCounter(15);
      const newIntervalId = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter === 1) {
            clearInterval(newIntervalId);
            setShowCheckButton(false);
            setShowTaskButton(true);
            setCounter(null);
          }
          return prevCounter - 1;
        });
      }, 2000);
      setIntervalId(newIntervalId);
    }
  };

  const fetchCountFromFirestore = async (userid) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userCount = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userid) {
          userCount = doc.data().count;
        }
      });
      return userCount;
    } catch (e) {
      console.error("Error fetching document: ", e);
      return 0;
    }
  };

  const updateUserCountInFirestore = async (userid, newCount) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userDocId = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userid) {
          userDocId = doc.id;
        }
      });

      if (userDocId) {
        const userDocRef = doc(db, "telegramUsers", userDocId);
        await updateDoc(userDocRef, { count: newCount });
        // console.log('User count updated in Firestore.');
      } else {
        console.error("User document not found.");
      }
    } catch (e) {
      console.error("Error updating user count in Firestore: ", e);
    }
  };

  const saveTaskCompletionToFirestore = async (userid, taskId, status) => {
    try {
      const taskRef = doc(db, "taskCompletion", `${userid}_${taskId}`);
      await setDoc(taskRef, { completed: status }, { merge: true });
    } catch (e) {
      console.error("Error saving task completion status: ", e);
    }
  };

  const checkTaskCompletion = async (userid, taskId) => {
    try {
      const taskRef = doc(db, "taskCompletion", `${userid}_${taskId}`);
      const taskDoc = await getDoc(taskRef);
      return taskDoc.exists() && taskDoc.data().completed;
    } catch (e) {
      console.error("Error checking task completion status: ", e);
      return false;
    }
  };

  const handleComplete = (status) => {
    setOpenComplete(status);
  };

  const finishMission = async () => {
    setShowModal(false);
    setOpenComplete(false);
    document.getElementById("congrat").style.opacity = "1";
    document.getElementById("congrat").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("congrat").style.opacity = "0";
      document.getElementById("congrat").style.visibility = "invisible";
    }, 2000);

    if (isVerified) {
      const newCount = count + 50000;
      setCount(newCount);
      setMessage("");
      setIsMissionButtonDisabled(true); // Optionally disable the button again after mission completion
      await saveTaskCompletionToFirestore(idme, taskID, true);
      // Update the user's count in Firestore
      await updateUserCountInFirestore(idme, newCount);

      setTaskCompleted(true);
    } else {
      setMessage("Please verify the task first.");
    }
  };

  return (
    <>
      {showModal ? (
        <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
          <div className={`w-full flex flex-col items-center justify-start`}>
            <div className="w-full flex justify-start py-2">
              {/* <button
                                className="text-[#e4e4e4] pb-2 transition-colors duration-300 flex items-center space-x-1"
                                onClick={closeTask}
                            >
                                <IoIosArrowBack size={20} className='' /> <span className='text-[18px] font-medium '>Back</span>
                            </button> */}
            </div>
            <div className="flex w-full flex-col">
              <h1 className="text-[20px] font-semibold">Join Our Socials</h1>
              <p className="text-[#9a96a6] text-[16px] font-medium pt-1 pb-10">
                Join our social page to get regular updates about this airdrop
                bot and its great potentials
              </p>

              <p className="w-full text-center text-[14px] font-semibold text-[#49ee49] pb-4">
                {taskCompleted ? "Task is Completed" : ""}
              </p>
              <button
                className="transition-all duration-300 ease-in-out bg-[#4b64bc] text-[#fff] text-[16px] font-semibold py-3 px-6 rounded-[10px] w-full"
                style={{ display: showTaskButton ? "block" : "none" }}
                onClick={handleTaskLinkClick}
              >
                Join Telegram
              </button>

              <button
                className="transition-all duration-300 ease-in-out bg-[#4b64bc] text-[#fff] text-[16px] font-semibold py-3 px-6 rounded-[10px] w-full"
                style={{ display: showCheckButton ? "block" : "none" }}
                onClick={handleVerify}
              >
                Verify Task
              </button>

              <button
                className="transition-all duration-300 ease-in-out bg-[#4b64bc] text-[#fff] text-[16px] font-semibold py-3 px-6 rounded-[10px] w-full"
                style={{ display: showDoneButton ? "block" : "none" }}
                onClick={() => handleComplete(true)}
              >
                Complete
              </button>

              <p className="w-full text-center text-[14px] font-semibold text-[#e35050] pt-4">
                {message}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {openComplete && (
        <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center px-[16px] h-full completebg">
          <div className="w-full flex flex-col items-center justify-center space-y-10">
            <div className="text-center">
              <img
                src={coinsmall}
                className="w-[150px] mx-auto mb-4 animate-bounce"
                alt="coinsmall"
              />
              <h1 className="text-[26px] font-semibold pb-2 text-[#EAB543]">
                +50,000
              </h1>
              <p className="text-[#9a96a6] text-[16px] font-medium">
                Energy have been added to your balance.
              </p>
            </div>
            <button
              className="transition-all duration-300 ease-in-out bg-[#4b64bc] text-[#fff] text-[16px] font-semibold py-3 px-6 rounded-[10px] w-full"
              onClick={finishMission}
              disabled={isMissionButtonDisabled}
            >
              Finish Mission
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskOne;
