import axios from 'axios';

const storage = window.localStorage;

const getPins = async (setPins) => {
  try {
    const res = await axios.get('api/pins');
    setPins(res.data);
  } catch(e) {
    console.log(e);
  }
};

const handleMarkerClick = (id, latitude, longitude, setCurrentPlace, viewport, setViewport) => {
  setCurrentPlace(id);
  setViewport({
    ...viewport,
    latitude,
    longitude
  });
};

const handleDoubleClick = (click, setNewPlace, viewport, setViewport) => {
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

const handleSubmit = async (click, currentUser, pins, newPlace, setPins, setNewPlace) => {
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
};

const handleLogout = async (setCurrentUser) => {
  storage.removeItem('user');
  setCurrentUser(null);
};

export { getPins, handleMarkerClick, handleDoubleClick, handleSubmit, handleLogout };