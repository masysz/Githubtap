import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import flash from "../images/flash.webp";
import coinsmall from "../images/coinsmall.webp";
import useSound from 'use-sound';
import boopSfx from '../get.mp3';
import burnSfx from '../burn.wav';

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

const Plutos = () => {
  const imageRef = useRef(null);
  const [play] = useSound(boopSfx);
  const [play2] = useSound(burnSfx);
  const [clicks, setClicks] = useState([]);
  const { name, balance, tapBalance, energy, battery, tapGuru, mainTap, setIsRefilling, refillIntervalRef, refillEnergy, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, loading } = useUser();

  // eslint-disable-next-line
  const [points, setPoints] = useState(0);
  // eslint-disable-next-line
  const [isDisabled, setIsDisabled] = useState(false);
  // eslint-disable-next-line
  const [openClaim, setOpenClaim] = useState(false);
  // eslint-disable-next-line
  const [congrats, setCongrats] = useState(false);
  // eslint-disable-next-line
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const debounceTimerRef = useRef(null);
  // eslint-disable-next-line
  const refillTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(energy);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null);

  const handleClick = (e) => {
    // Handle click functionality
  };

  const handleClickGuru = (e) => {
    // Handle click functionality for guru tap
  };

  const updateFirestore = async () => {
    // Firestore update functionality
  };

  const energyPercentage = (energy / battery.energy) * 100;

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className="w-full flex justify-center flex-col overflow-hidden">
            <h3 className="text-[#fff] text-[18px] font-extrabold text-center mb-2">
              Welcome, {name}
            </h3>
            <div className="flex space-x-[2px] justify-center items-center">
              <div className="w-[50px] h-[50px]">
                <img src={coinsmall} className="w-full" alt="coin" />
              </div>
              <h1 className="text-[#fff] text-[42px] font-extrabold">
                {formatNumber(balance + refBonus)} <br />
              </h1>
            </div>
            <div className="w-full ml-[6px] flex space-x-1 items-center justify-center">
              <img
                src={level.imgUrl}
                className="w-[25px] relative"
                alt="bronze"
              />
              <h2 onClick={() => setShowLevels(true)} className="text-[#9d99a9] text-[20px] font-medium">
                {level.name}
              </h2>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
            </div>
            <div className="w-full flex justify-center items-center pt-7 pb-24 relative">
              <div className="bg-[#efc26999] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] top-10 -left-40 rounded-full"></div>
              <div className={`${tapGuru ? 'block' : 'hidden'} pyro`}>
                <div className="before"></div>
                <div className="after"></div>
              </div>
              <div className="w-[350px] h-[350px] relative flex items-center justify-center">
                <img
                  src="/lihgt.webp"
                  alt="err"
                  className={`absolute w-[330px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`}
                />
                <div className="image-container">
                  {mainTap && (
                    <Container>
                      <img
                        src={level.imgUrl}
                        className="w-[25px] absolute top-0 left-0"
                        alt="bronze"
                      />
                      <img
                        onPointerDown={handleClick}
                        ref={imageRef}
                        src="/coinsmall.webp"
                        alt="Wobble"
                        className="wobble-image !w-[250px] select-none"
                      />
                      {clicks.map((click) => (
                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                          +{tapValue.value}
                        </SlideUpText>
                      ))}
                    </Container>
                  )}
                  {tapGuru && (
                    <Container>
                      <img
                        src={level.imgUrl}
                        className="w-[25px] absolute top-0 left-0"
                        alt="bronze"
                      />
                      <img
                        onPointerDown={handleClickGuru}
                        ref={imageRef}
                        src="/coinsmall.webp"
                        alt="Wobble"
                        className="wobble-image !w-[250px] select-none"
                      />
                      {clicks.map((click) => (
                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                          +{tapValue.value * 5}
                        </SlideUpText>
                      ))}
                    </Container>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
              <div className="flex flex-col w-full items-center justify-center">
                <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
                  <img alt="flash" src={flash} className="w-[20px]" />
                  <div>
                    <span className="text-[18px] font-bold">{energy.toFixed(0)}</span>
                    <span className="text-[14px] font-medium">/ {battery.energy}</span>
                  </div>
                </div>
                <div className="flex w-full p-[4px] h-[20px] items-center bg-energybar rounded-[12px] border-[1px] border-borders2">
                  <div
                    className="bg-[#e39725] h-full rounded-full transition-width duration-100"
                    style={{ width: `${energyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
          </div>
        </Animate>
      )}
    </>
  );
};

export default Plutos;
