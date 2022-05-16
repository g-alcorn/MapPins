import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css'; 
// Without Mapbox CSS, the marker position will change on zoom

function App() {
  // State management
  const [viewState, setViewState] = useState({
    latitude: 48.85,
    longitude: 2.35,
    zoom: 11
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlace] = useState(null);
  const currentUser = 'john-doe'

  // On page load
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('api/pins');
        setPins(res.data);
      } catch(e) {
        console.log(e);
      }
    };

    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlace(id);
  };

  return (   
    <div className="App">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >
        {pins.map((p) => (
          <>
            <Marker latitude={p.lat} longitude={p.long}>
              <Room 
                style={{ 
                  fontSize: viewState.zoom * 6,
                  cursor: 'pointer',
                  color: p.username === currentUser ? 'rgb(255 91 71)' : 'rgb(0 0 0)'
                }} 
                
                onClick={() => handleMarkerClick(p._id)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup 
                latitude={p.lat} 
                longitude={p.long} 
                closeButton={true} 
                closeOnClick={false} 
                anchor="top">
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="description">{p.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <Star className="star"/>
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{p.createdAt}</span>
                </div> 
              </Popup>
              )}
            </>
          )
        )}
      </Map>
    </div>
  );
}

export default App;
