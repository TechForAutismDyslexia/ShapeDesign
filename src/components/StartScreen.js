import { useNavigate } from "react-router-dom";
import { AiOutlineSound } from "react-icons/ai";
import '../styles/start.css'
export default function StartScreen() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/shapeselection");
  };

  const speakInstructions = () => {
    const utterance = new SpeechSynthesisUtterance(
      "The design is shown for 10 seconds only. You have to memorize it and make the exact same design."
    );
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="start-screen-container">
      <h1 className="title">Shape Design</h1>
      <div className="instructions-container">
        <p className="instructions">
          The design is shown for 10 seconds only. You have to memorize it and make the exact same design.
        </p>
        <button className="speak-button " onClick={speakInstructions}>
          <AiOutlineSound size={20} />
          <span>Speak Instructions</span>
        </button>
      </div>
      <div className="play-button-container">
        <button className="play-button" onClick={handleClick}>
          Play
        </button>
      </div>
    </div>
  );
}
