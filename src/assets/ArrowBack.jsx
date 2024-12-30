import React from 'react'

const ArrowBack = ({className, ...props}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} {...props}  viewBox="0 -960 960 960" ><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
  )
}

export default ArrowBack