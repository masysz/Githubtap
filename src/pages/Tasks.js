import React, { useState } from 'react';
import DailyRewardModal from '../Components/DailyRewardModal';

const Tasks = () => {
    const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  
    return (
      <div>
        <button onClick={openModal}>Open Daily Reward</button>
        {showModal && <DailyRewardModal onClose={closeModal} />}
      </div>
    );
  };

export default Tasks;