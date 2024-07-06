import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure firebase is correctly imported

function TapHome() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userRef = collection(db, 'telegramUsers');
      await addDoc(userRef, {
        fullname,
        username,
        userId,
        count: 0,
        energy: 500,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setLogMessage('Document successfully added!');
    } catch (error) {
      setLogMessage('Error adding document: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={addUser}>
        <div>
          <label>Full Name:</label>
          <input 
            type="text" 
            value={fullname} 
            onChange={(e) => setFullname(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>User ID:</label>
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {logMessage && <p>{logMessage}</p>}
    </div>
  );
}

export default TapHome;
