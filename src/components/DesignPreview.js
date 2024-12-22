import React, { useEffect, useState } from "react";
import "../styles/PreviewDesign.css";
import { useNavigate } from "react-router-dom";

const PreviewDesign = ({ designs, currentDesignIndex, onRecreate }) => {
  const navigate = useNavigate();
  const currentDesign = designs[currentDesignIndex]; 
  const [timer, setTimer] = useState(5); 

  useEffect(() => {
    if (!currentDesign) return; 

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown); 
          navigate("/droppable"); 
          onRecreate(currentDesign); 
        }
        return prevTimer - 1;
      });
    }, 1000); 

    return () => clearInterval(countdown); 
  }, [currentDesign, navigate, onRecreate]);

  if (!currentDesign) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="preview-design text-center d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="preview-title mb-4">Target Design</h2>
      
      <div className="timer mb-4">{timer} seconds</div>

      <div className="preview-container position-relative">
        {currentDesign.droppableAreas.map((area, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: area.shape.svg }}
            style={{
              position: "absolute",
              left: `${area.shape.position?.x || 0}px`,
              top: `${area.shape.position?.y || 0}px`,
              width: `${area.shape.dimensions?.width}px`,
              height: `${area.shape.dimensions?.height}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewDesign;
