import React from 'react';
import { motion } from 'framer-motion';
import NavBarNew from './NavBarNew';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import MovingPage from './MovinPage/MovingPage';
import SixthPage from './SixthPage';
import Countdown from 'react-countdown';
import Footer from './Footer';

const HomePage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // coundown code here

  const targetDate = new Date('2025-01-15T00:00:00').getTime();

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <h2>Hello</h2>;
    
    } else {

      return (
        <div className="flex justify-center gap-8 mt-6 scale-50 sm:scale-75 md:scale-100">
          <div className="text-center bg-indigo-600 px-5 py-5 text-white shadow-xl rounded-md">
            <h3 className="text-lg font-semibold">Days</h3>
            <div className="text-2xl font-bold">{days}</div>
          </div>
          <div className="text-center bg-indigo-600 px-5 py-5 text-white shadow-xl rounded-md">
            <h3 className="text-lg font-semibold">Hours</h3>
            <div className="text-2xl font-bold">{hours}</div>
          </div>
          <div className="text-center bg-indigo-600 px-5 py-5 text-white shadow-xl rounded-md">
            <h3 className="text-lg font-semibold">Minutes</h3>
            <div className="text-2xl font-bold">{minutes}</div>
          </div>
          <div className="text-center bg-indigo-600 px-5 py-5 text-white shadow-xl rounded-md">
            <h3 className="text-lg font-semibold">Seconds</h3>
            <div className="text-2xl font-bold">{seconds}</div>
          </div>
        </div>
      );
    }
  };


  

  return (
    <div className="grid grid-cols-1">
      <NavBarNew />

      {/* 1st Page */}
      <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

       <div className="text-center pt-4 sm:pt-24 ">
            <p1 className="text-sm sm:text-l font-bold  text-indigo-600">Launching Startup Bihar Portal in...</p1>
              <Countdown date={targetDate} renderer={renderer} />
          </div>

        <motion.div
          //className="text-center mx-auto max-w-2xl pt-24 mb-10 sm:pt-40 lg:pt-48"
          className="text-center mx-auto max-w-2xl pt-4 mb-12 sm:pt-16 lg:pt-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          
          <h1
            className="text-4xl font-bold tracking-tight text-gray-600 opacity-35 sm:text-5xl"
            style={{ fontFamily: 'Amsterdam' }}
          >
            Startup Bihar
          </h1>

          {/* pasting countdown code here */}

        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl pb-18 pt-10 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-6 flex justify-center sm:mb-8 sm:flex sm:justify-center" variants={fadeIn}>
            <div className="relative rounded-full px-3 py-1 text-xs sm:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing new opportunities for growth.
              <a href="#" className="font-semibold text-indigo-600 ml-2">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </motion.div>

          <motion.div className="text-center" variants={fadeIn}>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Empowering Startups, Shaping Tomorrow Together
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-6 lg:leading-8 text-gray-600 px-6 sm:px-0">
              Driving innovation, growth, and entrepreneurial success by supporting startups across diverse sectors in Bihar.
            </p>
          </motion.div>

          <motion.div className="mt-16 flex items-center justify-center gap-x-6" variants={fadeIn}>
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </motion.div>

        <MovingPage />
      </div>

      <FourthPage />
      <FifthPage />
      <SixthPage />
      <Footer />
    </div>
  );
};

export default HomePage;
