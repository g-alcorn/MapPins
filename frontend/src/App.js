import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import Register from './components/Register';
import Login from './components/Login';
import { getPins, handleMarkerClick, handleDoubleClick, handleSubmit, handleLogout } from './helpers/helpers';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css'; 
// Without Mapbox CSS, the marker position will change on zoom

function App() {
  // State management
  const storage = window.localStorage;
  const [viewport, setViewport] = useState({
    latitude: 48.85,
    longitude: 2.35,
    zoom: 11
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState(storage.getItem('user'));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // On page load
  useEffect(() => {
    getPins(setPins);
  }, []);

  return (   
    <div className="App">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onDblClick={(click) => handleDoubleClick(click, setNewPlace, viewport, setViewport)}
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
                
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long, setCurrentPlace, viewport, setViewport)}
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
                  onSubmit={(click, pins, currentUser, newPlace) => handleSubmit(click, currentUser, pins, newPlace, setPins, setNewPlace)}
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

        {currentUser ? (
          <button 
            className='button logout'
            onClick={() => handleLogout(setCurrentUser)}
          >
            Logout
          </button>
        ) : (
          <div className='account-buttons'>
            <button 
              className='button login' 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button 
              className='button register' 
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>          
          </div>
        )}

        {showRegister && (
          <Register setShowRegister={setShowRegister} />
        )}

        {showLogin && (
          <Login 
            setShowLogin={setShowLogin} 
            setCurrentUser={setCurrentUser} 
            storage={storage} 
          />
        )}
      </Map>
    </div>
  );
}

export default App;
