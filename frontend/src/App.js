import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css'; 
// Without Mapbox CSS, the marker position will change on zoom

function App() {
  // State management
  const [viewport, setViewport] = useState({
    latitude: 48.85,
    longitude: 2.35,
    zoom: 11
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

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

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlace(id);
    setViewport({
      ...viewport,
      latitude,
      longitude
    });
  };

  const handleDoubleClick = (click) => {
    click.preventDefault();

    setNewPlace({
      'latitude': click.lngLat.lat, 
      'longitude': click.lngLat.lng
    });

    setViewport({
      ...viewport,
      latitude: click.lngLat.lat,
      longitude: click.lngLat.lng
    });
  };

  const handleSubmit = async (click) => {
    click.preventDefault();

    const newPin = {
      username: currentUser,
      lat: newPlace.latitude,
      long: newPlace.longitude,
      title: newPlace.title,
      description: newPlace.description,
      rating: newPlace.rating
    };

    try {
      const res = await axios.post('api/pins', newPin)
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch(e) {
      console.log(e);
    }
  }

  return (   
    <div className="App">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onDblClick={handleDoubleClick}
        transitionDuration='1200'
        style={{width: '100vw', height: '100vh'}}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >
        {pins.map((pin) => (
          <>
            <Marker 
              latitude={pin.lat} 
              longitude={pin.long}
              anchor={'bottom'}
            >
              <Room 
                style={{ 
                  fontSize: viewport.zoom * 7,
                  cursor: 'pointer',
                  color: pin.username === currentUser ? 'rgb(255 91 71)' : 'rgb(0 0 0)'
                }} 
                
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup 
                latitude={pin.lat} 
                longitude={pin.long} 
                closeButton={true} 
                closeOnClick={false} 
                anchor="top"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="description">{pin.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<Star className="star"/>)}
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{pin.username}</b></span>
                  <span className="date">{pin.createdAt}</span>
                </div> 
              </Popup>
            )}
            {newPlace && (
                <Popup
                className='new-pin-popup'
                latitude={newPlace.latitude}
                longitude={newPlace.longitude}
                anchor={'top'}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setNewPlace(null)}
              >
                <h4>New Pin</h4>
                <form 
                  className='new-pin-form'
                  onSubmit={handleSubmit}
                >
                  <label>Title</label>
                  <input 
                    placeholder='Enter title' 
                    onChange={(e) => setNewPlace({...newPlace, 'title': e.target.value})}
                  />
                  <label>Review</label>
                  <textarea 
                    placeholder='Write something about this place...' 
                    onChange={(e) => setNewPlace({...newPlace, 'description': e.target.value})}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setNewPlace({...newPlace, 'rating': e.target.value})}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                  <button className='new-pin-submit' type='submit'>
                    Add Pin
                  </button>
                </form>
              </Popup>
            )}
            </>
          )
        )}

        {currentUser ? (<button className='button logout'>Logout</button>) : (
          <div className='account-buttons'>
            <button className='button login'>Login</button>
            <button className='button register'>Register</button>          
          </div>
        )}
      </Map>
    </div>
  );
}

export default App;
