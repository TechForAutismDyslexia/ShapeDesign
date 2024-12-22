import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShapeSelectionScreen = ({ onDesignSelection }) => {
  const [shapesData, setShapesData] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/designs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shapes data");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.designs && Array.isArray(data.designs)) {
          const designs = data.designs[0]?.designs || [];
          setShapesData(designs);
        } else {
          console.error("Designs data is missing or malformed", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching shapes data:", error);
      });
  }, []);

  const handleShapeSelect = (designId, shapeId) => {
    setSelectedShapes((prev) => {
      const newSelection = [...prev];
      const selectionExists = newSelection.some(
        (selection) => selection.designId === designId && selection.shapeId === shapeId
      );
      if (selectionExists) {
        return newSelection.filter(
          (selection) => !(selection.designId === designId && selection.shapeId === shapeId)
        );
      } else {
        newSelection.push({ designId, shapeId });
        return newSelection;
      }
    });
  };

  const handleSendToPreview = () => {
    const randomizedShapes = selectedShapes
      .map(({ designId, shapeId }) => {
        const design = shapesData.find((d) => d.id === designId);
        const shape = design?.droppableAreas?.find((area) => area.id === shapeId);

        return { ...design, selectedShape: shape };
      })
      .sort(() => Math.random() - 0.5);

    onDesignSelection(randomizedShapes);
    navigate("/preview");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Select Shapes</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {Array.isArray(shapesData) && shapesData.length > 0 ? (
          shapesData.map((design) => {
            const isDesignSelected = selectedShapes.some(
              (selection) => selection.designId === design.id
            );

            return (
              <div
                key={design.id}
                style={{
                  border: isDesignSelected ? "2px solid green" : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "white",
                  width: "350px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                {isDesignSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    ✔
                  </div>
                )}

                <div style={{ position: "relative", width: "100%", height: "400px" }}>
                  {design.droppableAreas?.map((area) => (
                    <div
                      key={area.id}
                      style={{
                        position: "absolute",
                        left: `${area.shape?.position?.x}px`,
                        top: `${area.shape?.position?.y}px`,
                        border: selectedShapes.some(
                          (selection) =>
                            selection.designId === design.id && selection.shapeId === area.id
                        )
                          ? "2px solid green"
                          : "none",
                        borderRadius: "8px",
                        padding: "0",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        width: `${area.shape?.dimensions?.width}px`,
                        height: `${area.shape?.dimensions?.height}px`,
                      }}
                      onClick={() => handleShapeSelect(design.id, area.id)}
                    >
                      {area.shape?.svg && (
                        <div
                          dangerouslySetInnerHTML={{ __html: area.shape.svg }}
                          style={{
                            marginBottom: "0",
                            width: "100%",
                            height: "100%",
                            display: "block",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading shapes...</p>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleSendToPreview}
          style={{
            padding: "12px 25px",
            background: "linear-gradient(to right, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#45a049";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "linear-gradient(to right, #4CAF50, #45a049)";
            e.target.style.transform = "scale(1)";
          }}
        >
          Start Game with Selected Designs
        </button>
      </div>
    </div>
  );
};

export default ShapeSelectionScreen;
