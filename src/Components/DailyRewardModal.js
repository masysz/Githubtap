import React from 'react';
import '../App.css';

const DailyRewardModal = ({ onClose }) => {
  const rewardDays = [
    { day: 1, reward: 500 },
    { day: 2, reward: '1K' },
    { day: 3, reward: '2.5K' },
    { day: 4, reward: '5K' },
    { day: 5, reward: '15K' },
    { day: 6, reward: '25K' },
    { day: 7, reward: '100K' },
    { day: 8, reward: '500K' },
    { day: 9, reward: '1M' },
    { day: 10, reward: '3M' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="calendar-icon">
          <span className="dollar-sign">$</span>
        </div>
        <h2>Daily reward</h2>
        <p>Accrue coins for logging into the game daily without skipping</p>
        
        <div className="reward-grid">
          {rewardDays.map((day, index) => (
            <div key={day.day} className={`reward-day ${index < 3 ? 'active' : ''}`}>
              <span className="day">Day {day.day}</span>
              <span className="coin-icon">$</span>
              <span className="reward">{day.reward}</span>
            </div>
          ))}
        </div>
        
        <button className="come-back-button">Come back tomorrow</button>
      </div>
    </div>
  );
};

export default DailyRewardModal;