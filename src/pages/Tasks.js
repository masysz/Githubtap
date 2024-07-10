import React, { useEffect, useState } from 'react';
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import coinsmall from "../images/coinsmall.webp";
import bronze from "../images/bronze.webp";
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Spinner from '../Components/Spinner';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className='w-full justify-center flex-col space-y-3 px-5'>
            <div className="w-full flex flex-col space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
                >
                  <div className="flex flex-1 flex-col space-y-1">
                    <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                      {task.name}
                    </div>
                    <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                      
                      
                      <span className="font-normal text-[#ffffff] text-[15px]">
                        {task.desc}
                      </span>
                    </div>
                  </div>
                  <span className="w-[20px]">
                        <img src={coinsmall} className="w-full" alt="coin" />
                      </span>
                  <div className="text-[#ffce68] font-semibold text-[14px]">
                    +{task.points}
                  </div>
                  <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders">
                    <div className="h-[10px] rounded-[8px] bg-btn w-[.5%]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Outlet />
        </Animate>
      )}
    </>
  );
}

export default Tasks;
