import React, { useCallback, useRef, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import '../App.css';
import Webcam from "react-webcam";

const Home = () => {
  const webcamRef = useRef(null);
  const [detectedTextHistory, setDetectedTextHistory] = useState([]);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      try {
        const response = await fetch('http://localhost:5000/process_frame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ frame: imageSrc.split(',')[1] })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const newDetectedText = data.text;

        // Update history with new detected text, keeping up to 16 latest entries
        if (newDetectedText.length > 0) {
          setDetectedTextHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newDetectedText];
            if (updatedHistory.length > 16) {
              updatedHistory.shift(); // Remove oldest entry if more than 16
            }
            return updatedHistory;
          });

          await fetch('http://localhost:5000/save_plate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plateNumber: newDetectedText.join(', ') })
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      console.error('Webcam not initialized');
    }
  }, [webcamRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 1000); // Adjust the interval as needed (e.g., every second)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [capture]);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="left-column">
          <h1 style={{ color: 'white', fontSize: 25 }}>Number Plates Detected:</h1>
          <ul style={{ color: 'white', fontSize: 20, listStyleType: 'none' }} >
            {detectedTextHistory.map((detectedText, index) => (
              <li key={index}>{detectedText.join(', ')}</li>
            ))}
          </ul>
        </div>
        <div className="right-column">
           <Webcam
            audio={false}
            height={700}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={700} 
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user"
            }}
            />
        </div>
      </div>
      <Search />
    </>
  );
};

export default Home;




// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import Search from './Search';
// import '../App.css';

// const Home = () => {
//   const webcamRef = useRef(null);
//   const [detectedTextHistory, setDetectedTextHistory] = useState([]);
//   const videoRef = useRef(null);

//   const handlePlay = useCallback(() => {
//     if (videoRef.current) {
//       videoRef.current.src = 'http://192.168.100.156:4747/video';
//       videoRef.current.play().catch(error => {
//         console.error("Error attempting to play video:", error);
//       });
//     }
//   }, []);

//   const capture = useCallback(async () => {
//     if (videoRef.current) {
//       // Capture the frame from the video element
//       const canvas = document.createElement('canvas');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const context = canvas.getContext('2d');
//       context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//       const imageSrc = canvas.toDataURL('image/jpeg');

//       try {
//         const response = await fetch('http://localhost:5000/process_frame', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ frame: imageSrc.split(',')[1] })
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         const newDetectedText = data.text;

//         // Update history with new detected text, keeping up to 16 latest entries
//         if (newDetectedText.length > 0) {
//           setDetectedTextHistory(prevHistory => {
//             const updatedHistory = [...prevHistory, newDetectedText];
//             if (updatedHistory.length > 16) {
//               updatedHistory.shift(); // Remove oldest entry if more than 16
//             }
//             return updatedHistory;
//           });

//           await fetch('http://localhost:5000/save_plate', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ plateNumber: newDetectedText.join(', ') })
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     } else {
//       console.error('Video element not initialized');
//     }
//   }, [videoRef]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       capture();
//     }, 1000); // Adjust the interval as needed (e.g., every second)

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [capture]);

//   useEffect(() => {
//     handlePlay(); // Automatically start the camera on mount
//   }, [handlePlay]);

//   return (
//     <>
//       <Navbar />
//       <div className="home-container">
//         <div className="left-column">
//           <h1 style={{ color: 'white', fontSize: 25 }}>Number Plates Detected:</h1>
//           <ul style={{ color: 'white', fontSize: 20, listStyleType: 'none' }}>
//             {detectedTextHistory.map((detectedText, index) => (
//               <li key={index}>{detectedText.join(', ')}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="right-column">
//           <video
//             ref={videoRef}
//             width={700}
//             height={700}
//             controls
//           />
//           <button onClick={handlePlay}>Start Camera</button>
//         </div>
//       </div>
//       <Search />
//     </>
//   );
// };

// export default Home;
