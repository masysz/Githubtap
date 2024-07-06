import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // Sesuaikan dengan lokasi file firebase Anda

function TapHome() {
  const [logMessage, setLogMessage] = useState('');

  const addUser = async () => {
    try {
      const userRef = collection(db, 'telegramUsers');
      await addDoc(userRef, {
        fullname: 'John Doe',
        username: 'johndoe',
        userId: '123456789',
        count: 0,
        energy: 500,
        timestamp: new Date()
      });
      setLogMessage('Document successfully added!');
    } catch (error) {
      setLogMessage('Error adding document: ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={addUser}>Add User</button>
      {logMessage && <p>{logMessage}</p>}
    </div>
  );
}

export default TapHome;
