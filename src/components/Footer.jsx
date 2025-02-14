import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <footer className="h-[7vh] w-full fixed bottom-0 right-0 z-20 bg-gray-800 text-gray-500 text-center shadow-lg md:text-base text-sm">
        <div className='py-2'>
          <p>&copy; {new Date().getFullYear()} ChatMate. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
            <Link to="/">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
