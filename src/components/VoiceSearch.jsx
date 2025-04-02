import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
const VoiceSearch = ({ onSearch, onSelectFirstBus }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    // Handle speech result
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript.trim().toLowerCase();
      console.log("Recognized speech:", speechText);

      if (speechText.includes("select bus")) {
        console.log("Voice command detected: Selecting first available bus");
        onSelectFirstBus();  // Automatically selects the first bus
      } else {
        // Extract 'from' and 'to' from speech (e.g., "Broadway to Manali Market")
        const regex = /(.+?)\s+to\s+(.+)/i;
        const match = speechText.match(regex);

        if (match) {
          const from = match[1].trim();
          const to = match[2].trim();
          console.log("Extracted From:", from, "To:", to);

          // Call onSearch to update Home.jsx
          onSearch(from, to);
        } else {
          alert("Please say: 'Boarding Point to Destination'");
        }
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Speech recognition failed. Try again.");
    };
  };

  return (
    <div>
      <button 
        onTouchStart={startListening} 
        onClick={startListening} 
          style={{ 
                position: "fixed", 
                bottom: "20px", left: "20px",
                 backgroundColor: isListening ? "#f54242" : " #091292",
                  color: "#fff",
                   border: "none",
                    borderRadius: "50%",
                     width: "50px", 
                     height: "50px",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      cursor: "pointer",
                       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              {isListening ? <Mic size={24} /> : <MicOff size={24} />}
        
      </button>
    </div>
  );
};

export default VoiceSearch;
