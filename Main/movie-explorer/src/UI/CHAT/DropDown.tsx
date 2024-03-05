import  { useState } from 'react';
import { useChat } from '../../Context/Chatcontext';

const DropdownComponent = ({isOpen}) => {
  
  const {dispatch}=useChat();
  
  return (
    
       isOpen && <>
        <div
          className="origin-top-right  mr-[10px] sm:mr-[20px] md:mr-[30px] absolute right-0 mt-2 sm:w-[80px] md:w-[120px]  w-50px rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
           <button className='text-black' onClick={()=>dispatch({"type":"ShowAllUsers"})}> 
            Show Participants 
            </button>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Option 2
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Option 3
            </a>
          </div>
        </div>
    </>
    );
};

export default DropdownComponent;
