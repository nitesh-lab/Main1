import React, { useState } from 'react';

function Invite({ link,setShowLink }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link); // Copy link to clipboard
    setCopied(true); // Update state to show copied notification
    setTimeout(() => {
      setCopied(false); // Hide notification after 3 seconds
      setShowLink(false);
    }, 2000);
      };

  return (
    <div className="flex items-center bg-gray-700 rounded p-2">
      <p className="flex-1 text-white">{link}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleCopy}>
        Copy
      </button>
      {copied && <span className="text-green-500">Link copied!</span>}
    </div>
  );
}

export default Invite;
