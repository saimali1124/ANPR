// import React, { useState } from 'react';
// import '../App.css';

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResult, setSearchResult] = useState('');

//   const handleSearch = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/search_plate?q=${searchQuery}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setSearchResult(data.results);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };  

//   return (
//     <div className="search-container">
//       <a style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '28px' }}>Search for driver and car details:</a>
//       <div className="input-group">
//         <div className="form-outline" data-mdb-input-init>
//           <input
//             id="search-input"
//             type="search"
//             className="form-control"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Enter number plate"
//           />
//           <label className="form-label" htmlFor="form1">Search</label>
//         </div>
//         <button
//           id="search-button"
//           type="button"
//           className="btn btn-primary"
//           onClick={handleSearch}
//         >
//           <i className="fas fa-search"></i>
//         </button>
//       </div>
//       <div
//         className="search-result"
//         style={{
//           marginTop: '20px',
//           color: searchResult ? 'black' : 'white',
//           border: '1.7px solid #001f3f',
//           padding: '10px',
//           minHeight: '500px',
//           borderRadius: '24px'
//         }}
//       >
//         {searchResult ? <p>{searchResult}</p> : <p style={{ color: '#001f3f' }}>No results found</p>}
//       </div>
//     </div>
//   );
// };

// export default Search;


// import React, { useState } from 'react';
// import '../App.css';

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearch = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/search_plate?q=${searchQuery}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setSearchResults(data.results);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   return (
//     <div className="search-container" style={{ backgroundColor: '#add8e6', padding: '20px' }}>
//       <a style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '28px' }}>
//         Search for driver and car details:
//       </a>
//       <div className="input-group" style={{ width: '100%', marginBottom: '20px' }}>
//         <div className="form-outline" data-mdb-input-init style={{ width: '85%' }}>
//           <input
//             id="search-input"
//             type="search"
//             className="form-control"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Enter number plate"
//             style={{ border: '1px solid #001f3f' }}
//           />
//           <label className="form-label" htmlFor="form1">Search</label>
//         </div>
//         <button
//           id="search-button"
//           type="button"
//           className="btn btn-primary"
//           onClick={handleSearch}
//           style={{ height: '45px' }}
//         >
//           <i className="fas fa-search"></i>
//         </button>
//       </div>
//       <div
//         className="search-result"
//         style={{
//           color: searchResults.length ? 'black' : '#001f3f',
//           border: '1.7px solid #001f3f',
//           padding: '10px',
//           minHeight: '500px',
//           borderRadius: '24px'
//         }}
//       >
//         {searchResults.length ? (
//           searchResults.map((result, index) => (
//             <p key={index}>{result}</p>
//           ))
//         ) : (
//           <p>No results found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Search;

import React, { useState } from 'react';
import '../App.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('No Results Yet');

  const handleSearch = async () => {
    try {
      setSearchResults([]);
      const response = await fetch(`http://localhost:5000/search_plate?q=${searchQuery}`);
      setSearchText('No results found for the number plate');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div
      className="search-container"
      style={{
        backgroundColor: '#add8e6',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <a style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '35px', marginBottom: '20px' }}>
        Search for driver and car details:
      </a>
      <div className="input-group" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <div className="form-outline" data-mdb-input-init style={{ width: '85%' }}>
          <input
            id="search-input"
            type="search"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter number plate"
            style={{ border: '1px solid #001f3f' }}
          />
          {searchQuery.length < 1 && <label className="form-label" htmlFor="form1">Search</label>}
        </div>
        <button
          id="search-button"
          type="button"
          className="btn btn-primary"
          onClick={handleSearch}
          style={{ height: '45px', marginLeft: '10px' }}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div
        className="search-result"
        style={{
          color: searchResults.length ? 'black' : '#001f3f',
          border: '1.7px solid #001f3f',
          padding: '10px',
          minHeight: '200px',
          borderRadius: '7px',
          maxWidth: '560px',
          width: '100%',
          // height: '100%',
          textAlign: 'center',
        }}
      >
        {searchResults.length ? (
          searchResults.map((result, index) => {
            const detectedAt = new Date(result.detected_at).toUTCString().replace(' GMT', ' PST');
            return (
              <div key={index}>
                <p>Camera ID: {result.cameraID}</p>
                <p>Plate Number: {result.plate_number}</p>
                <p>Detected At: {detectedAt}</p>
                <p>------------------------------------------</p>
              </div>
            );
          })
        ) : (
          <p>{searchText}</p>
        )}
      </div>
    </div>
  );
};

export default Search;
