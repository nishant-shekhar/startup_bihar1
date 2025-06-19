// CoWorkingMap.jsx
import React, { useState, useRef } from 'react';
import { MdChair } from 'react-icons/md';
import { IoCloseCircleSharp } from "react-icons/io5";

export const topSeatsArray = [
  { seatSLNo: 1, seatNo: "1", status: "available", assignedTo: "" },
  { seatSLNo: 2, seatNo: "2", status: "available", assignedTo: "" },
  { seatSLNo: 3, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 4, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 5, seatNo: "3", status: "available", assignedTo: "" },
  { seatSLNo: 6, seatNo: "4", status: "available", assignedTo: "" },
  { seatSLNo: 7, seatNo: "5", status: "available", assignedTo: "" },
  { seatSLNo: 8, seatNo: "6", status: "available", assignedTo: "" },
  { seatSLNo: 9, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 10, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 11, seatNo: "7", status: "available", assignedTo: "" },
  { seatSLNo: 12, seatNo: "8", status: "available", assignedTo: "" },
  { seatSLNo: 13, seatNo: "9", status: "available", assignedTo: "" },
  { seatSLNo: 14, seatNo: "10", status: "available", assignedTo: "" },
  { seatSLNo: 15, seatNo: "11", status: "available", assignedTo: "" },
  { seatSLNo: 16, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 17, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 18, seatNo: "12", status: "available", assignedTo: "" },
  { seatSLNo: 19, seatNo: "13", status: "available", assignedTo: "" },
  { seatSLNo: 20, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 21, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 22, seatNo: "14", status: "available", assignedTo: "" },
  { seatSLNo: 23, seatNo: "15", status: "available", assignedTo: "" },
  { seatSLNo: 24, seatNo: "16", status: "available", assignedTo: "" },
  { seatSLNo: 25, seatNo: "17", status: "available", assignedTo: "" },
  { seatSLNo: 26, seatNo: "18", status: "available", assignedTo: "" },
  { seatSLNo: 27, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 28, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 29, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 30, seatNo: "19", status: "available", assignedTo: "" },
  { seatSLNo: 31, seatNo: "20", status: "available", assignedTo: "" },
  { seatSLNo: 32, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 33, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 34, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 35, seatNo: "21", status: "available", assignedTo: "" },
  { seatSLNo: 36, seatNo: "22", status: "available", assignedTo: "" },
  { seatSLNo: 37, seatNo: "23", status: "available", assignedTo: "" },
  { seatSLNo: 38, seatNo: "24", status: "available", assignedTo: "" },
  { seatSLNo: 39, seatNo: "25", status: "available", assignedTo: "" },
  { seatSLNo: 40, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 41, seatNo: "26", status: "available", assignedTo: "" },
  { seatSLNo: 42, seatNo: "27", status: "available", assignedTo: "" },
  { seatSLNo: 43, seatNo: "28", status: "available", assignedTo: "" },
  { seatSLNo: 44, seatNo: "29", status: "available", assignedTo: "" },
  { seatSLNo: 45, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 46, seatNo: "30", status: "available", assignedTo: "" },
  { seatSLNo: 47, seatNo: "31", status: "available", assignedTo: "" },
  { seatSLNo: 48, seatNo: "32", status: "available", assignedTo: "" },
  { seatSLNo: 49, seatNo: "33", status: "available", assignedTo: "" },
  { seatSLNo: 50, seatNo: "34", status: "available", assignedTo: "" },
  { seatSLNo: 51, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 52, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 53, seatNo: "35", status: "available", assignedTo: "" },
  { seatSLNo: 54, seatNo: "36", status: "available", assignedTo: "" },
  { seatSLNo: 55, seatNo: "37", status: "available", assignedTo: "" },
  { seatSLNo: 56, seatNo: "38", status: "available", assignedTo: "" },
  { seatSLNo: 57, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 58, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 59, seatNo: "39", status: "available", assignedTo: "" },
  { seatSLNo: 60, seatNo: "40", status: "available", assignedTo: "" },
  { seatSLNo: 61, seatNo: "41", status: "available", assignedTo: "" },
  { seatSLNo: 62, seatNo: "42", status: "available", assignedTo: "" },
  { seatSLNo: 63, seatNo: "43", status: "available", assignedTo: "" },
  { seatSLNo: 64, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 65, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 66, seatNo: "44", status: "available", assignedTo: "" },
  { seatSLNo: 67, seatNo: "45", status: "available", assignedTo: "" },
  { seatSLNo: 68, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 69, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 70, seatNo: "46", status: "available", assignedTo: "" },
  { seatSLNo: 71, seatNo: "47", status: "available", assignedTo: "" },
  { seatSLNo: 72, seatNo: "48", status: "available", assignedTo: "" },
  { seatSLNo: 73, seatNo: "49", status: "available", assignedTo: "" },
  { seatSLNo: 74, seatNo: "50", status: "available", assignedTo: "" },
  { seatSLNo: 75, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 76, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 77, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 78, seatNo: "51", status: "available", assignedTo: "" },
  { seatSLNo: 79, seatNo: "52", status: "available", assignedTo: "" },
  { seatSLNo: 80, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 81, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 82, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 83, seatNo: "53", status: "available", assignedTo: "" },
  { seatSLNo: 84, seatNo: "54", status: "available", assignedTo: "" },
  { seatSLNo: 85, seatNo: "55", status: "available", assignedTo: "" },
  { seatSLNo: 86, seatNo: "56", status: "available", assignedTo: "" },
  { seatSLNo: 87, seatNo: "57", status: "available", assignedTo: "" },
  { seatSLNo: 88, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 89, seatNo: "58", status: "available", assignedTo: "" },
  { seatSLNo: 90, seatNo: "59", status: "available", assignedTo: "" },
  { seatSLNo: 91, seatNo: "60", status: "available", assignedTo: "" },
  { seatSLNo: 92, seatNo: "61", status: "available", assignedTo: "" },
  { seatSLNo: 93, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 94, seatNo: "62", status: "available", assignedTo: "" },
  { seatSLNo: 95, seatNo: "63", status: "available", assignedTo: "" },
  { seatSLNo: 96, seatNo: "64", status: "available", assignedTo: "" },
  { seatSLNo: 97, seatNo: "65", status: "available", assignedTo: "" },
  { seatSLNo: 98, seatNo: "66", status: "available", assignedTo: "" },
  { seatSLNo: 99, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 100, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 101, seatNo: "67", status: "available", assignedTo: "" },
  { seatSLNo: 102, seatNo: "68", status: "available", assignedTo: "" },
  { seatSLNo: 103, seatNo: "69", status: "available", assignedTo: "" },
  { seatSLNo: 104, seatNo: "70", status: "available", assignedTo: "" },
  { seatSLNo: 105, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 106, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 107, seatNo: "71", status: "available", assignedTo: "" },
  { seatSLNo: 108, seatNo: "72", status: "available", assignedTo: "" },
  { seatSLNo: 109, seatNo: "73", status: "available", assignedTo: "" },
  { seatSLNo: 110, seatNo: "74", status: "available", assignedTo: "" },
  { seatSLNo: 111, seatNo: "75", status: "available", assignedTo: "" },
  { seatSLNo: 112, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 113, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 114, seatNo: "76", status: "available", assignedTo: "" },
  { seatSLNo: 115, seatNo: "77", status: "available", assignedTo: "" },
  { seatSLNo: 116, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 117, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 118, seatNo: "78", status: "available", assignedTo: "" },
  { seatSLNo: 119, seatNo: "79", status: "available", assignedTo: "" },
  { seatSLNo: 120, seatNo: "80", status: "available", assignedTo: "" },
  { seatSLNo: 121, seatNo: "81", status: "available", assignedTo: "" },
  { seatSLNo: 122, seatNo: "82", status: "available", assignedTo: "" },
  { seatSLNo: 123, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 124, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 125, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 126, seatNo: "83", status: "available", assignedTo: "" },
  { seatSLNo: 127, seatNo: "84", status: "available", assignedTo: "" },
  { seatSLNo: 128, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 129, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 130, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 131, seatNo: "85", status: "available", assignedTo: "" },
  { seatSLNo: 132, seatNo: "86", status: "available", assignedTo: "" },
  { seatSLNo: 133, seatNo: "87", status: "available", assignedTo: "" },
  { seatSLNo: 134, seatNo: "88", status: "available", assignedTo: "" },
  { seatSLNo: 135, seatNo: "89", status: "available", assignedTo: "" },
  { seatSLNo: 136, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 137, seatNo: "90", status: "available", assignedTo: "" },
  { seatSLNo: 138, seatNo: "91", status: "available", assignedTo: "" },
  { seatSLNo: 139, seatNo: "92", status: "available", assignedTo: "" },
  { seatSLNo: 140, seatNo: "93", status: "available", assignedTo: "" },
  { seatSLNo: 141, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 142, seatNo: "94", status: "available", assignedTo: "" },
  { seatSLNo: 143, seatNo: "95", status: "available", assignedTo: "" },
  { seatSLNo: 144, seatNo: "96", status: "available", assignedTo: "" },
  { seatSLNo: 145, seatNo: "97", status: "available", assignedTo: "" },
  { seatSLNo: 146, seatNo: "98", status: "available", assignedTo: "" },
  { seatSLNo: 147, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 148, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 149, seatNo: "99", status: "available", assignedTo: "" },
  { seatSLNo: 150, seatNo: "100", status: "available", assignedTo: "" },
  { seatSLNo: 151, seatNo: "101", status: "available", assignedTo: "" },
  { seatSLNo: 152, seatNo: "102", status: "available", assignedTo: "" },
  { seatSLNo: 153, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 154, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 155, seatNo: "103", status: "available", assignedTo: "" },
  { seatSLNo: 156, seatNo: "104", status: "available", assignedTo: "" },
  { seatSLNo: 157, seatNo: "105", status: "available", assignedTo: "" },
  { seatSLNo: 158, seatNo: "106", status: "available", assignedTo: "" },
  { seatSLNo: 159, seatNo: "107", status: "available", assignedTo: "" },
  { seatSLNo: 160, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 161, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 162, seatNo: "108", status: "available", assignedTo: "" },
  { seatSLNo: 163, seatNo: "109", status: "available", assignedTo: "" },
  { seatSLNo: 164, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 165, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 166, seatNo: "110", status: "available", assignedTo: "" },
  { seatSLNo: 167, seatNo: "111", status: "available", assignedTo: "" },
  { seatSLNo: 168, seatNo: "112", status: "available", assignedTo: "" },
  { seatSLNo: 169, seatNo: "113", status: "available", assignedTo: "" },
  { seatSLNo: 170, seatNo: "114", status: "available", assignedTo: "" },
  { seatSLNo: 171, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 172, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 173, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 174, seatNo: "115", status: "available", assignedTo: "" },
  { seatSLNo: 175, seatNo: "116", status: "available", assignedTo: "" },
  { seatSLNo: 176, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 177, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 178, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 179, seatNo: "117", status: "available", assignedTo: "" },
  { seatSLNo: 180, seatNo: "118", status: "available", assignedTo: "" },
  { seatSLNo: 181, seatNo: "119", status: "available", assignedTo: "" },
  { seatSLNo: 182, seatNo: "120", status: "available", assignedTo: "" },
  { seatSLNo: 183, seatNo: "121", status: "available", assignedTo: "" },
  { seatSLNo: 184, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 185, seatNo: "122", status: "available", assignedTo: "" },
  { seatSLNo: 186, seatNo: "123", status: "available", assignedTo: "" },
  { seatSLNo: 187, seatNo: "124", status: "available", assignedTo: "" },
  { seatSLNo: 188, seatNo: "125", status: "available", assignedTo: "" },
  { seatSLNo: 189, seatNo: "", status: "invalid", assignedTo: null },
  { seatSLNo: 190, seatNo: "126", status: "available", assignedTo: "" },
  { seatSLNo: 191, seatNo: "127", status: "available", assignedTo: "" },
  { seatSLNo: 192, seatNo: "128", status: "available", assignedTo: "" },
];

const chunkSeats = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Seat = ({ seat, onClick }) => {
  if (seat.status === 'invalid') return <button
      className={`text-2xl m-1 transition duration-200 opacity-0 `}
    >
      <MdChair />
    </button>;

  const seatColor =
    seat.status === 'available' ? 'text-green-500 hover:text-green-700' : 'text-gray-400 cursor-not-allowed';

  return (
    <button
      onClick={() => onClick(seat)}
      className={`text-2xl m-1 transition duration-200 ${seatColor}`}
      title={`Seat ${seat.seatNo} (${seat.status})`}
    >
      <MdChair />
    </button>
  );
};

const CoWorkingMap = () => {
  const [topSeats] = useState(chunkSeats(topSeatsArray, 12));
  const [selectedSeat, setSelectedSeat] = useState(null);
  const dialogRef = useRef(null);

  const handleSeatClick = (seat) => {
    if (seat.status === 'invalid') return;
    setSelectedSeat(seat);
    dialogRef.current?.showModal();
  };

  const handleUnassign = () => {
    // You can add API call here if needed
    dialogRef.current.close();
  };

  return (
    <div className='h-screen overflow-y-auto'>
      {/* Top Bar */}
      <div className="relative bg-indigo-100 py-6 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-indigo-800">Co-Working Map</h1>
        <p className="mt-2 text-indigo-700 text-sm">Seat layout and assignment view.</p>

        <div className="p-6 text-left">
          <h2 className="font-semibold text-indigo-700 mb-2">Legend:</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <MdChair className="text-green-500" />
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
              <Seat key={seat.seatSLNo} seat={seat} onClick={handleSeatClick} />
            ))}
          </div>
        ))}
      </div>

      {/* Lobby and Lift */}
      <div className="flex flex-col items-center justify-center py-4 border">
        <div className=" px-8 py-2 rounded-lg  mb-2 text-sm font-medium rotate-90"></div>
        <div className=" px-8 py-2 rounded-lg  text-sm font-medium"></div>
      </div>

      {/* Modal Dialog */}
      <dialog ref={dialogRef} className="rounded-3xl p-6 shadow-lg w-96">
        {selectedSeat && (
          <div>
            <h3 className="text-xl text-center border-b font-semibold mb-4">Seat Details</h3>
            <div className='flex gap-2 justify-center items-center'>
              <p><strong>Serial Number:</strong> {selectedSeat.seatSLNo}</p>
              <p><strong>Seat Number:</strong> {selectedSeat.seatNo}</p>
            </div>
            <p className="text-center mt-2">Status: {selectedSeat.status}</p>
            <div className="flex gap-2 mt-4 justify-center">
              {selectedSeat.status === 'booked' && (
                <button
                  onClick={handleUnassign}
                  className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600"
                >
                  Unassign
                </button>
              )}
              <button
                onClick={() => dialogRef.current.close()}
                className="bg-gray-300 text-black px-4 py-2 rounded-3xl hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default CoWorkingMap;
