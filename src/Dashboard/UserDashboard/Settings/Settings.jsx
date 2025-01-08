import React, { useState } from 'react'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile') // Default section is profile

  // Function to switch between sections
  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div>
      {/* Header section */}
      <div className="header">
        <button onClick={() => handleSectionChange('profile')}>Profile</button>
        <button onClick={() => handleSectionChange('notifications')}>Notifications</button>
        <button onClick={() => handleSectionChange('credits')}>Credits</button>
      </div>

      {/* Content section based on the active section */}
      <div className="content">
        {activeSection === 'profile' && (
          <div>
            <h2>Profile Section</h2>
            {/* Add Profile Content Here */}
          </div>
        )}
        {activeSection === 'notifications' && (
          <div>
            <h2>Notifications Section</h2>
            {/* Add Notifications Content Here */}
          </div>
        )}
        {activeSection === 'credits' && (
          <div>
            <h2>Credits Section</h2>
            {/* Add Credits Content Here */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
