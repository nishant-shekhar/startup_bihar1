import React from 'react';

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 sm:gap-16">
        <div className="flex justify-center gap-3 sm:gap-8">
          <TimeUnit value={days} label={parseInt(days) === 1 ? "Day" : "Days"} />
          <TimeUnit value={hours} label={parseInt(hours) === 1 ? "Hour" : "Hours"} />
          <TimeUnit value={minutes} label={parseInt(minutes) === 1 ? "Minute" : "Minutes"} />
          <TimeUnit value={seconds} label={parseInt(seconds) === 1 ? "Second" : "Seconds"} />
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }) => {
  return (
			<div className="flex flex-col gap-5 relative">
				<div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-20 lg:h-20 flex justify-between items-center bg-[#303462] rounded-lg">
					<div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
					<span className="lg:text-5xl sm:text-6xl text-xl font-semibold text-[#a5b4fc]">
						{value}
					</span>
					<div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
				</div>
				<span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
					{label}
				</span>
			</div>
		);
};

export default CountdownTimer;