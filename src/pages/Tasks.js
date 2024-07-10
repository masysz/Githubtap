import React, { useState } from 'react';
import Modal from 'react-modal';

const TaskList = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = [
    { id: 1, title: 'Messi and cryptocurrency. New Solana meme coin', reward: 100000 },
    { id: 2, title: 'Da Vinci is BACK!', reward: 100000 },
    { id: 3, title: 'Daily reward', reward: 6649000 },
  ];

  const openModal = (task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="task-list">
      <h2>Hamster Kombat</h2>
      <h3>Earn more coins</h3>
      
      <h4>Hamster Youtube</h4>
      {tasks.slice(0, 2).map(task => (
        <div key={task.id} className="task" onClick={() => openModal(task)}>
          <span>{task.title}</span>
          <span>+{task.reward}</span>
        </div>
      ))}

      <h4>Daily tasks</h4>
      {tasks.slice(2).map(task => (
        <div key={task.id} className="task" onClick={() => openModal(task)}>
          <span>{task.title}</span>
          <span>+{task.reward}</span>
        </div>
      ))}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Task Modal"
      >
        {selectedTask && (
          <div>
            <h2>{selectedTask.title}</h2>
            <p>Reward: {selectedTask.reward} coins</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaskList;