import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import EmployeeItem from './employee-item';

const Startupfinanceandemployee = (props) => {
    return (
        <div className={`mt-1 flex flex-col justify-start items-center p-6 border border-white rounded-lg bg-gray-200 ${props.rootClassName}`}>
            <div className="grid-cols-8 w-full flex items-center justify-start p-3 rounded-lg bg-white">
                <div className="col-span-3 min-w-32 flex flex-col justify-start items-start pt-1 pr-2 pl-2 pb-1  bg-orange-500 rounded-lg">
                    <span>{props.text2 ?? <Fragment><span className="text-white text-xs ">Total</span></Fragment>}</span>
                    <span>{props.text3 ?? <Fragment><span className="text-white text-lg font-bold">₹ 10,00,000</span></Fragment>}</span>
                </div>
                <div className="col-span-5 flex-auto  flex-col justify-start items-start pt-1 pr-2 pl-2 pb-1 ml-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="grid grid-cols-8">


                        <div className="col-span-5 flex flex-col justify-start items-start columns-2">

                            <div className="flex flex-col items-start">
                                <span>{props.text4 ?? <Fragment><span className="text-xs text-gray-900 ">Invested</span></Fragment>}</span>
                                <span>{props.text5 ?? <Fragment><span className="text-lg text-black font-bold">₹ 4,50,000</span></Fragment>}</span>
                            </div>

                        </div>


                        <div className="col-span-3 grid grid-cols-1 items-end ml-1 h-7">

                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                className="w-10 h-6 text-green-500"
                            >
                                <path
                                    d="M20 8v2h6.586L18 18.586l-4.293-4.293a1 1 0 0 0-1.414 0L2 24.586L3.414 26L13 16.414l4.293 4.293a1 1 0 0 0 1.414 0L28 11.414V18h2V8Z"
                                    fill="currentColor"
                                ></path>
                            </svg>

                                <span>{props.text6 ?? <Fragment><span className="text-xs w-12 text-black text-right pl-3 ">45%</span></Fragment>}</span>
                        </div>

                    </div>
                </div>

            </div>
            <div className="w-full flex justify-between items-start m-3">
                <span>{props.text ?? <Fragment><span className="text-sm text-gray-900 tracking-wider">Employee</span></Fragment>}</span>
                <span>{props.text1 ?? <Fragment><span className="text-xs text-gray-500  tracking-wider">See All</span></Fragment>}</span>
            </div>
            <div className="w-full flex justify-between items-center pt-1">
                <EmployeeItem
                    text={<Fragment><span className="text-xs text-gray-900 ">Abhishek</span></Fragment>}
                    imageSrc={"https://randomuser.me/api/portraits/men/32.jpg"}
                    rootClassName="employee-itemroot-class-name5"
                />
                <EmployeeItem
                    text={<Fragment><span className="text-xs text-gray-900 ">Vishal</span></Fragment>}
                    imageSrc={"https://randomuser.me/api/portraits/men/73.jpg"}
                    rootClassName="employee-itemroot-class-name6"
                />
                <EmployeeItem
                    text={<Fragment><span className="text-xs text-gray-900 ">Niraj</span></Fragment>}
                    imageSrc={"https://randomuser.me/api/portraits/men/9.jpg"}
                    rootClassName="employee-itemroot-class-name7"
                />
                <EmployeeItem
                    text={<Fragment><span className="text-xs text-gray-900 ">Shubham</span></Fragment>}
                    imageSrc={"https://randomuser.me/api/portraits/men/65.jpg"}
                    rootClassName="employee-itemroot-class-name8"
                />
                <EmployeeItem
                    text={<Fragment><span className="text-xs text-gray-900 ">Vishakha</span></Fragment>}
                    imageSrc={"https://randomuser.me/api/portraits/women/85.jpg"}
                    rootClassName="employee-itemroot-class-name9"
                />
            </div>
        </div>
    );
};

Startupfinanceandemployee.defaultProps = {
    rootClassName: '',
    text2: undefined,
    text5: undefined,
    text: undefined,
    text4: undefined,
    text3: undefined,
    text6: undefined,
    text1: undefined,
};

Startupfinanceandemployee.propTypes = {
    rootClassName: PropTypes.string,
    text2: PropTypes.element,
    text5: PropTypes.element,
    text: PropTypes.element,
    text4: PropTypes.element,
    text3: PropTypes.element,
    text6: PropTypes.element,
    text1: PropTypes.element,
};

export default Startupfinanceandemployee;
