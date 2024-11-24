import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const EmployeeItem = (props) => {
  return (
    <div className={`flex flex-col items-center mr-2 ${props.rootClassName}`}>
      <img
        alt={props.imageAlt}
        src={props.imageSrc}
        className="w-14 object-cover rounded-full" // Tailwind class for small size and cover fit
      />
      <span>
        {props.text ?? (
          <Fragment>
            <span className="text-gray-900 text-xs mt-1 font-medium">Abhishek</span>
          </Fragment>
        )}
      </span>
    </div>
  )
}

EmployeeItem.defaultProps = {
  text: undefined,
  imageSrc: '/Images/untitled%20design-200h.png',
  imageAlt: 'image',
  rootClassName: '',
}

EmployeeItem.propTypes = {
  text: PropTypes.element,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default EmployeeItem
