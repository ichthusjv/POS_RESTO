import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'

function Main({ children }) {
  let location = useLocation()
  const [isCustomerView, setIsCustomerView] = useState(false);

  useEffect(() => {
    // Check if the path is '/customerView'
    if (location.pathname === "/customerView") {
      setIsCustomerView(true);
    } else {
      setIsCustomerView(false);
    }
  }, [location.pathname])

  return (
    <main className={`h-full overflow-y-auto ${isCustomerView && 'flex items-center justify-center'}`}>
      {/* <div className="container grid px-6 mx-auto">{children}</div> */}
      <div className="grid px-6 mx-auto">{children}</div>
    </main>
  )
}

export default Main
