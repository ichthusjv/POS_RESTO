import React from 'react'
import loadingSpinner from "../assets/loading.gif";

function ThemedSuspense() {
  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
      <img
        src={loadingSpinner}
        alt="Loading..."
        className="w-24 h-24"
      />
    </div>
  )
}

export default ThemedSuspense
