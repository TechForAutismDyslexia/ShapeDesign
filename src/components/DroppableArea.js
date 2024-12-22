import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Confetti from "react-confetti";
import "../styles/DroppableArea.css";

const DroppableArea = ({ designData, onNextDesign }) => {
  const [droppedShapes, setDroppedShapes] = useState([]);
  const [draggableShapes, setDraggableShapes] = useState(designData.droppableAreas);
  const [activeShape, setActiveShape] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const shape = designData.droppableAreas.find(
      (area) => area.id === active.id
    )?.shape;
    setActiveShape(shape);
  };

  const handleDragEnd = ({ over, active }) => {
    setActiveShape(null);

    if (over && over.id === "droppable") {
      const shape = designData.droppableAreas.find(
        (area) => area.id === active.id
      )?.shape;

      if (shape) {
        setDraggableShapes((prev) => prev.filter((s) => s.id !== active.id));

        const newDroppedShape = {
          ...shape,
          id: active.id,
          droppedAt: over.id,
          uniqueKey: `${active.id}-${Date.now()}`,
        };

        setDroppedShapes((prev) => [...prev, newDroppedShape]);
      }
    }
  };

  const evaluateAnswer = async () => {
    const isCorrect = designData.droppableAreas.every((area) =>
      droppedShapes.some(
        (dropped) => dropped.id === area.id && dropped.droppedAt === "droppable"
      )
    );

    const timeSpent = (new Date() - startTime) / 1000;
    const numberOfDesigns = designData.droppableAreas.length;
    const designNames = designData.droppableAreas.map((area) => area.shape.name);

    if (isCorrect) {
      setFeedback("Correct! Well done!");
      setShowConfetti(true);
      speak("Good Job");

      sendDesignCompletionData(timeSpent, numberOfDesigns, designNames);

      setTimeout(() => {
        setShowConfetti(false);
        onNextDesign();
      }, 2000);
    } else {
      setFeedback("Try Again!");
      speak("Please Try Again");
      setDroppedShapes([]);
    }
  };

  const resetDesign = () => {
    setDroppedShapes([]);
    setFeedback(null);
    setStartTime(new Date());
  };

  const sendDesignCompletionData = async (timeSpent, numberOfDesigns, designNames) => {
    try {
      const response = await fetch('http://localhost:5000/api/design-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123',
          timeSpent,
          numberOfDesigns,
          designNames,
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="droppable-area-container">
      {showConfetti && <Confetti />}

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="shapes-container">
          <h3>Draggable Shapes</h3>
          {draggableShapes.map((area) => (
            <Draggable key={area.id} id={area.id} shape={area.shape} />
          ))}
        </div>

        <Droppable>
          <h3>Drop Area</h3>
          {droppedShapes.map((shape) => (
            <div
              key={shape.uniqueKey}
              dangerouslySetInnerHTML={{ __html: shape.svg }}
              className="dropped-shape"
              style={{
                position: "absolute",
                width: `${shape.dimensions.width}px`,
                height: `${shape.dimensions.height}px`,
                left: `${shape.position.x}px`,
                top: `${shape.position.y}px`,
              }}
            />
          ))}
        </Droppable>

        <DragOverlay>
          {activeShape && (
            <div
              dangerouslySetInnerHTML={{ __html: activeShape.svg }}
              style={{
                width: `${activeShape.dimensions.width}px`,
                height: `${activeShape.dimensions.height}px`,
                opacity: 0.5,
              }}
            />
          )}
        </DragOverlay>
      </DndContext>

      <div className="action-buttons">
        <button onClick={evaluateAnswer} className="evaluate-button">
          Evaluate Answer
        </button>
        <button onClick={resetDesign} className="reset-button">
          Reset Design
        </button>
      </div>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

const Draggable = ({ id, shape }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: "grab",
    width: `${shape.dimensions.width}px`,
    height: `${shape.dimensions.height}px`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div dangerouslySetInnerHTML={{ __html: shape.svg }} />
    </div>
  );
};

const Droppable = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "droppable" });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area ${isOver ? "over" : ""}`}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
