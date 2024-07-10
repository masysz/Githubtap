import React, { useState } from 'react';
import DailyRewardModal from '../Components/DailyRewardModal';

const Tasks = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
  
    return (
      <div>
        <button onClick={openModal}>Open Daily Reward</button>
        {showModal && <DailyRewardModal onClose={closeModal} />}
      </div>
    );
  };

export default Tasks;