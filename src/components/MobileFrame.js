import React from 'react';

const MobileFrame = ({ children }) => {
  return (
    <div className="mobile-frame">
      <div className="power-button"></div>
      <div className="volume-button"></div>
      <div className="mobile-screen">
        {children}
      </div>
    </div>
  );
};

export default MobileFrame;
