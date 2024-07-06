import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Boost() {


  return (
    <div className="boost">
      <h2 className="text-xl font-bold mb-4">Boosts</h2>
      <button
        className="mb-2 px-4 py-2 rounded bg-yellow-500 text-white"

      >
        Boost Energy (+50)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-green-500 text-white"

      >
        Boost Coins (+100)
      </button>
      <button
        className="mb-2 px-4 py-2 rounded bg-purple-500 text-white"

      >
        Boost Level (+1)
      </button>
    </div>
  );
}

export default Boost;
