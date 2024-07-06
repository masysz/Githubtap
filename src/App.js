import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import "./App.css";
import coinsmall from "../src/images/coinsmall.webp";
import tapmecoin from "../src/images/tapme1.webp";
import bronze from "../src/images/bronze.webp";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import Animate from "./Components/Animate";
import Spinner from "./Components/Spinner";
import Levels from "./Components/Levels";
import flash from "../src/images/flash.webp";
import { EnergyContext } from "./context/EnergyContext";



function App() {

}

export default App;
