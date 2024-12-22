import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import ShapeSelectionScreen from "./components/ShapeSelectionScreen";
import PreviewDesign from "./components/DesignPreview";
import DroppableArea from "./components/DroppableArea";
import StartScreen from "./components/StartScreen";  

function App() {
  const [designs, setDesigns] = useState([]); 
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const navigate = useNavigate(); 

  const handleDesignSelection = (selectedDesigns) => {
    const randomizedDesigns = [...selectedDesigns].sort(() => Math.random() - 0.5); 
    setDesigns(randomizedDesigns);
    setCurrentDesignIndex(0);
    navigate("/preview"); 
  };

  const handleNextDesign = () => {
    if (currentDesignIndex + 1 < designs.length) {
      setCurrentDesignIndex((prev) => prev + 1); 
      navigate("/preview"); 
    } else {
      console.log("All designs completed.");
      navigate("/"); 
    }
  };

  const handleRecreate = (design) => {
    console.log("Recreating design:", design);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<StartScreen />} />

        <Route
          path="/shapeselection"
          element={<ShapeSelectionScreen onDesignSelection={handleDesignSelection} />}
        />

        <Route
          path="/preview"
          element={
            <PreviewDesign
              designs={designs}
              currentDesignIndex={currentDesignIndex}
              onRecreate={handleRecreate}
            />
          }
        />

        <Route
          path="/droppable"
          element={
            <DroppableArea
              designData={designs[currentDesignIndex]}
              onNextDesign={handleNextDesign}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
