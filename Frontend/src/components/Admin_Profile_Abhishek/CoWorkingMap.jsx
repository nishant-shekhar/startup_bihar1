// CoWorkingMap.jsx
import React, { useState, useRef } from 'react';
import { FaChair } from 'react-icons/fa6';
import { MdChair } from "react-icons/md";
import { MdAssignmentInd } from "react-icons/md";
import { IoCloseCircleSharp } from "react-icons/io5";


const ROWS = 5;
const COLS = 10;

const generateSeats = (startIndex) => {
    const startups = ['TechNova', 'InnoHive', 'CodeNest', 'StartSpark', 'BuildVerse'];
    const seats = [];
  
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
        const seatId = startIndex + i * COLS + j;
        const rand = Math.random();
  
        let status = 'available';
        let startupName = '';
  
        if (rand < 0.15) {
          status = 'unavailable'; // 15% seats hidden
        } else if (rand < 0.35) {
          status = 'booked'; // 20% seats pre-assigned
          startupName = startups[Math.floor(Math.random() * startups.length)];
        }
  
        row.push({
          id: seatId,
          status,
          startupName,
        });
      }
      seats.push(row);
    }
    return seats;
  };
  
const Seat = ({ seat, onClick }) => {
  if (seat.status === 'unavailable') return null;

  const seatColor =
    seat.status === 'available' ? 'text-green-500 hover:text-green-700' : 'text-gray-400 cursor-not-allowed';

  return (
    <button
      onClick={() => onClick(seat)}
      className={`text-2xl m-1 transition duration-200 ${seatColor}`}
      title={`Seat ${seat.id} (${seat.status})`}
    >
      <MdChair />

    </button>
  );
};

const CoWorkingMap = () => {
  const [topSeats, setTopSeats] = useState(generateSeats(0));
  const [bottomSeats, setBottomSeats] = useState(generateSeats(50));
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [section, setSection] = useState('');
  const dialogRef = useRef(null);
  const [startupInput, setStartupInput] = useState('');

  const handleSeatClick = (seat, sectionName) => {
    setSelectedSeat(seat);
    setSection(sectionName);
    setStartupInput(seat.startupName || '');
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const updateSeat = (updatedSeat) => {
    const update = (seats, setSeats) => {
      const updated = seats.map((row) =>
        row.map((s) => (s.id === updatedSeat.id ? updatedSeat : s))
      );
      setSeats(updated);
    };

    if (section === 'top') update(topSeats, setTopSeats);
    else update(bottomSeats, setBottomSeats);
  };

  const handleAssign = () => {
    if (startupInput.trim() === '') return;
    const updatedSeat = { ...selectedSeat, status: 'booked', startupName: startupInput.trim() };
    updateSeat(updatedSeat);
    dialogRef.current.close();
  };

  const handleUnassign = () => {
    const updatedSeat = { ...selectedSeat, status: 'available', startupName: '' };
    updateSeat(updatedSeat);
    dialogRef.current.close();
  };

  return (
    <div className='h-screen overflow-y-auto'>
      {/* Top Bar */}
      <div className="relative bg-indigo-100 py-6 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-indigo-800">Co-Working Map</h1>
        <p className="mt-2 text-indigo-700 text-sm">Assign, remove, or update the coworking seats.</p>

        <div className="p-6 text-left">
        <h2 className="font-semibold text-indigo-700 mb-2">Legend:</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <MdChair
            className="text-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <MdChair className="text-gray-400" />
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-transparent border border-gray-300" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
      </div>

      {/* Top Seats */}
      <div className="p-6 flex flex-col items-center space-y-2">
        {topSeats.map((row, i) => (
          <div key={i} className="flex">
            {row.map((seat) => (
              <Seat key={seat.id} seat={seat} onClick={(s) => handleSeatClick(s, 'top')} />
            ))}
          </div>
        ))}
      </div>

      {/* Lobby and Lift */}
      <div className="flex flex-col items-center justify-center py-4 border">
        <div className=" px-8 py-2 rounded-lg  mb-2 text-sm font-medium rotate-90"></div>
        <div className=" px-8 py-2 rounded-lg  text-sm font-medium"></div>
      </div>

      {/* Bottom Seats */}
      <div className="p-6 flex flex-col items-center space-y-2">
        {bottomSeats.map((row, i) => (
          <div key={i} className="flex">
            {row.map((seat) => (
              <Seat key={seat.id} seat={seat} onClick={(s) => handleSeatClick(s, 'bottom')} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      

      {/* Modal Dialog */}
      <dialog ref={dialogRef} className="rounded-3xl p-6 shadow-lg w-96">
  {selectedSeat && (
    <div>
      <h3 className="text-xl text-center border-b font-semibold mb-4">Seat Details</h3>
      <div className='flex gap-2 justify-center items-center'>
      <p>
        <strong>Serial Number:</strong> {selectedSeat.id}
      </p>
      <p>
        <strong>Seat Number:</strong> {selectedSeat.id + 1}
      </p>
      </div>

      {selectedSeat.status === 'booked' ? (
        <div className="mt-4">
          <p>
            <strong>Assigned to:</strong> {selectedSeat.startupName}
          </p>
          <div className="flex gap-2 mt-4 ">
            <button
              onClick={handleUnassign}
              className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600"
            >
              Unassign
            </button>
            <button
              onClick={() => dialogRef.current.close()}
              className="bg-gray-300 text-black px-4 py-2 rounded-3xl hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Startup Name"
            value={startupInput}
            onChange={(e) => setStartupInput(e.target.value)}
            className="w-full border border-gray-300 rounded-3xl px-3 py-2 mb-4 "
          />
          <div className="flex gap-2 w-full">
  <button
    onClick={handleAssign}
    className="bg-indigo-600 flex w-full justify-center items-center gap-x-2 text-white px-4 py-2 rounded-3xl hover:bg-indigo-700"
  >
    <MdAssignmentInd />
    Assign
  </button>
  <button
    onClick={() => dialogRef.current.close()}
    className="bg-gray-300 flex w-full justify-center items-center gap-x-2 text-black px-4 py-2 rounded-3xl hover:bg-gray-400"
  >
    <IoCloseCircleSharp />
    Close
  </button>
</div>


        </div>
      )}
    </div>
  )}
</dialog>

    </div>
  );
};

export default CoWorkingMap;
