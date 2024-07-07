import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import "../App.css";
import coinsmall from "../images/coinsmall.webp";
import tapmecoin from "../images/tapme1.webp";
import bronze from "../images/bronze.webp";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import Animate from "../Components/Animate";
import Spinner from "../Components/Spinner";
import Levels from "../Components/Levels";
import flash from "../images/flash.webp";
import { EnergyContext } from "../context/EnergyContext";

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const EnergyFill = styled.div`
  background-color: #e39725;
  height: 12px;
  border-radius: 6px;
  width: ${({ percentage }) => percentage}%;
`;

const TapHome = () => {
  const { energy, setEnergy, displayEnergy, setDisplayEnergy, idme, setIdme, count, setCount } = useContext(EnergyContext);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLevels, setShowLevels] = useState(false);

  const levelsAction = useCallback(() => {
    setShowLevels(true);
    document.getElementById("footermain").style.zIndex = "50";
  }, []);

  const handleClick = (e) => {
    if (energy > 0) {
      const { offsetX, offsetY, target } = e.nativeEvent;
      const { clientWidth, clientHeight } = target;

      const horizontalMidpoint = clientWidth / 2;
      const verticalMidpoint = clientHeight / 2;

      const animationClass =
        offsetX < horizontalMidpoint
          ? "wobble-left"
          : offsetX > horizontalMidpoint
          ? "wobble-right"
          : offsetY < verticalMidpoint
          ? "wobble-top"
          : "wobble-bottom";

      imageRef.current.classList.remove(
        "wobble-top",
        "wobble-bottom",
        "wobble-left",
        "wobble-right"
      );

      imageRef.current.classList.add(animationClass);

      setTimeout(() => {
        imageRef.current.classList.remove(animationClass);
      }, 500);

      const rect = e.target.getBoundingClientRect();
      const newClick = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const updatedCount = count + 2;
      const updatedEnergy = energy - 2;

      setClicks((prevClicks) => [...prevClicks, newClick]);
      setCount(updatedCount);
      setEnergy(updatedEnergy);
      setDisplayEnergy(updatedEnergy);

      updateUserStatsInFirestore(idme, updatedCount, updatedEnergy);

      setTimeout(() => {
        setClicks((prevClicks) =>
          prevClicks.filter((click) => click.id !== newClick.id)
        );
      }, 1000);
    }
  };

  useEffect(() => {
    const telegramName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
    const telegramLastName = window.Telegram.WebApp.initDataUnsafe?.user?.last_name;
    const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (telegramName) {
      setName(telegramName + " " + telegramLastName);
    }

    if (telegramUsername) {
      setUsername(telegramUsername);
    }
    if (telegramUserid) {
      setIdme(telegramUserid);
    }

    if (telegramUsername && telegramUserid) {
      saveRefereeIdToFirestore();
    }

    if (telegramUserid) {
      fetchUserStatsFromFirestore(telegramUserid)
        .then((userStats) => {
          if (isNaN(userStats.count)) {
            setCount(0);
            updateUserStatsInFirestore(telegramUserid, 0, 500);
          } else {
            setCount(userStats.count);
            setEnergy(userStats.energy);
            setDisplayEnergy(userStats.energy);
          }
          setLoading(false);
        })
        .catch(() => {
          setCount(0);
          setEnergy(500);
          setLoading(false);
        });
    }
  }, []);

  const saveRefereeIdToFirestore = async () => {
    const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    const telegramName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
    const telegramLastName = window.Telegram.WebApp.initDataUnsafe?.user?.last_name;

    const fullName = telegramName + " " + telegramLastName;

    const queryParams = new URLSearchParams(window.location.search);
    let refereeId = queryParams.get("ref");
    if (refereeId) {
      refereeId = refereeId.replace(/\D/g, "");
    }

    if (telegramUsername && telegramUserid) {
      await storeUserData(fullName, telegramUsername, telegramUserid, refereeId);
    }
  };

  const storeUserData = async (name, username, idme, refereeId) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userExists = false;

      querySnapshot.forEach((doc) => {
        if (doc.data().userId === idme) {
          userExists = true;
        }
      });

      if (!userExists) {
        await addDoc(userRef, {
          name,
          username,
          userId: idme,
          count: 0,
          energy: 500,
          refereeId: refereeId || null,
          timestamp: new Date(),
        });
        console.log("User data stored:", { username, idme, refereeId });
      } else {
        console.log("User already exists:", { username, idme });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateUserStatsInFirestore = async (idme, newCount, newEnergy) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === idme) {
          updateDoc(doc.ref, { count: newCount, energy: newEnergy });
        }
      });
      console.log("User stats updated:", { newCount, newEnergy });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const fetchUserStatsFromFirestore = async (idme) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userStats = { count: 0, energy: 500 };
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === idme) {
          userStats = { count: doc.data().count, energy: doc.data().energy };
        }
      });
      return userStats;
    } catch (e) {
      console.error("Error fetching document: ", e);
      return { count: 0, energy: 500 };
    }
  };

  const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className="flex space-x-[2px] justify-center items-center">
            <div className="w-[50px] h-[50px]">
              <img src={coinsmall} className="w-full" alt="coin" />
            </div>
            <h1 className="text-[#fff] text-[42px] font-extrabold">
              {formattedCount}
            </h1>
          </div>
          <div className="w-full ml-[6px] flex space-x-1 items-center justify-center">
            <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze" />
            <h2 onClick={levelsAction} className="text-[18px] select-none text-[#efb810] cursor-pointer font-[600] flex items-center">
              Bronze <MdOutlineKeyboardArrowRight className="ml-1 text-[20px]" />
            </h2>
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="w-[65%] border-[#d1a01f] h-[12px] relative border-[3px] rounded-[20px]">
              <EnergyFill percentage={(displayEnergy / 500) * 100} />
              <div className="flex items-center justify-center absolute top-[0px] left-0 w-full h-full">
                <img src={flash} className="w-[14px] mb-[1px]" alt="energy" />
                <h2 className="text-[#fff] select-none text-[12px] font-extrabold">
                  {displayEnergy} / 500
                </h2>
              </div>
            </div>
          </div>
          <Container>
            <img
              ref={imageRef}
              src={tapmecoin}
              alt="Tap Me"
              onClick={handleClick}
              className="w-[270px] h-[270px] md:w-[320px] md:h-[320px] select-none"
            />
            {clicks.map((click) => (
              <SlideUpText key={click.id} x={click.x} y={click.y}>
                +2
              </SlideUpText>
            ))}
          </Container>
          {showLevels && <Levels setShowLevels={setShowLevels} />}
        </Animate>
      )}
    </>
  );
};

export default TapHome;
