import React, { useState } from 'react';
import CountUp from 'react-countup';
import { Parallax } from 'react-parallax';
import { useInView } from 'react-intersection-observer';

const FifthPage = () => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Start animation only once when in view
        threshold: 0.3, // Trigger when 30% of the section is visible
    });

    return (
        <div ref={ref}>
            <Parallax
                bgImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                strength={500}
            >
<div className="work relative isolate overflow-hidden py-12 sm:py-24 h-auto">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:mx-0 text-left ">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Work with us
          </h2>
          <p className="mt-4 sm:mt-6 text-lg sm:text-2xl leading-7 sm:leading-10 text-gray-300">
            We invite startups and firms from across India and the world to collaborate with Bihar's thriving startup ecosystem, driving innovation, growth, and success together.
          </p>
        </div>
        <div className="mx-auto mt-8 sm:mt-10 max-w-xl sm:max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-2 gap-2 sm:gap-6 text-base font-semibold leading-10 text-white sm:grid-cols-2 md:flex lg:gap-x-10 ">
            <a className=" block text-left">
              Join Us <span aria-hidden="true">&rarr;</span>
            </a>
            <a className="block text-left">
              Innovate Now <span aria-hidden="true">&rarr;</span>
            </a>
            <a className="block text-left">
              Scale Up <span aria-hidden="true">&rarr;</span>
            </a>
            <a className="block text-left">
              Succeed Together <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <dl className="mt-16 sm:mt-24 grid grid-cols-2 gap-8  lg:grid-cols-4">
            <div className="flex flex-col-reverse text-left">
              <dt className="text-lg sm:text-xl leading-7 text-gray-300">
                Startups Funded
              </dt>
              <dd className="text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-white">
                {inView && <CountUp end={1068} duration={5} />}+
              </dd>
            </div>
            <div className="flex flex-col-reverse text-left ">
              <dt className="text-lg sm:text-xl leading-7 text-gray-300">
                Co-working Space
              </dt>
              <dd className="text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-white">
                {inView && <CountUp end={2} duration={3} />}
              </dd>
            </div>
            <div className="flex flex-col-reverse text-left">
              <dt className="text-lg sm:text-xl leading-7 text-gray-300">
                Incubators & Hubs
              </dt>
              <dd className="text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-white">
                {inView && <CountUp end={22} duration={4} />}
              </dd>
            </div>
            <div className="flex flex-col-reverse text-left">
              <dt className="text-lg sm:text-xl leading-7 text-gray-300">
                Startup Cells
              </dt>
              <dd className="text-2xl sm:text-3xl font-bold leading-9 tracking-tight text-white">
                {inView && <CountUp end={46} duration={4} />}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
            </Parallax>
        </div>
    );
};

export default FifthPage;
