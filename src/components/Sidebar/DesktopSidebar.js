import React, { useState, useEffect } from 'react'
import SidebarContent from './SidebarContent'
import { Button } from '@windmill/react-ui'
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

function DesktopSidebar({ props, userAccess }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Run on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          z-30 flex-shrink-0 w-64 h-full overflow-y-auto bg-white dark:bg-gray-800 lg:block
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-64 absolute"}
        `}
      >
        <SidebarContent userAccess={userAccess} />
      </aside>

      {/* Toggle Button */}
      <div
        className={`
          absolute
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-64" : "translate-x-0"}
        `}
        style={{ top: "30px", zIndex: "41"}}
      >
        <Button
          layout="default"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={handleToggle}
          className="bg-orange-500 rounded-r shadow p-1 hover:bg-orange-600"
        >
          {isOpen ? (
            <ChevronLeftIcon className="text-white" />
          ) : (
            <ChevronRightIcon className="text-white" />
          )}
        </Button>
      </div>
    </>
  )
}

export default DesktopSidebar
