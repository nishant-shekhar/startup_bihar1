import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const Query1 = ({ text, text1, text2, changePanel }) => {
  const handleClick = () => {
    if (changePanel) {
      changePanel();
    }
  };

  return (
    // Trigger navigation on click
    <div className="w-72 h-30 cursor-pointer max-w-sm flex relative justify-between items-start mt-6 p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-lime-500 transition duration-300 ease-in-out"

    >
      <div className="flex flex-col items-start">
        <span>
          {text ? (
            <Fragment>
              <span className="text-white text-sm font-normal">
                {text}
              </span>
            </Fragment>
          ) : null}
        </span>
        <div className="w-6 h-1 mt-2 mb-2 bg-white rounded"></div>
        <span>
          {text1 ? (
            <Fragment>
              <span className="text-white text-xs font-normal leading-relaxed">
                {text1}
              </span>
            </Fragment>
          ) : null}
        </span>
      </div>
      <div className="ml-3 flex flex-col justify-center items-center self-center border border-white rounded-lg py-1 px-2">
        <span>
          {text2 ? (
            <Fragment>
              <span className="text-white text-sm font-normal">{text2}</span>
            </Fragment>
          ) : (
            'Reply'
          )}
        </span>
      </div>
    </div>
  )
}

Query1.propTypes = {
  text: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string
}

Query1.defaultProps = {
  text2: 'Reply',
}

export default Query1
