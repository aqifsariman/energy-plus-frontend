/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
  InfoWindow,
} from '@react-google-maps/api';

import styles from './Map.module.css';
import { useState, Fragment, useRef, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faLocationCrosshairs,
  faFilter,
  faSearchLocation,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddQRCode from '../Popups/AddQRCode';

const Map = (props) => {
  // STATE MANAGEMENT
  const [initialPosition, setInitialPosition] = useState({});
  const [marker, setMarker] = useState({});
  const [searchLocation, setSearchLocation] = useState('');
  const [defaultLocation, setDefaultLocation] = useState(false);
  const [directionResults, setDirectionResults] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [libraries] = useState(['places']);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [chargingPorts, setChargingPorts] = useState([]);
  const [activeWindow, setActiveWindow] = useState('');
  const [distDuration, setDistDuration] = useState(false);
  const [scanner, setScanner] = useState(false);

  const originRef = useRef();
  const destinationRef = useRef();
  const mapRef = useRef();

  // RENDERS INITIAL USER LOCATION ON PAGE RENDER
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      originRef.current = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    axios.get('/get-charging-ports').then((response) => {
      console.log(response.data);
      setChargingPorts(response.data);
    });
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // ENSURE WHEREVER THE USER CLICKS, IT WILL SET A MARKER THERE
  const mapHandler = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const closeHandler = () => {
    setScanner(false);
  };

  const scanQRCode = () => {
    setScanner(true);
    console.log('Scan QR Code');
  };

  const searchChangeHandler = (event) => {
    setSearchLocation(event.target.value);
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchHandler = async (event) => {
    event.preventDefault();
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      )
      .then((response) => {
        const { location } = response.data.results[0].geometry;
        setMarker(location);
        setDefaultLocation(false);
        destinationRef.current = location;
      });
    if (originRef.current === '' || destinationRef.current === '') {
      console.log('Empty');
      return;
    }
    console.log('origin', originRef.current);
    console.log('destination', destinationRef.current);

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current,
      destination: destinationRef.current,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResults(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };
  console.log('Results', directionResults);
  console.log('Distance', distance);
  console.log('Duration', duration);

  const defaultLocationHandler = () => {
    setDefaultLocation(true);
    map.panTo(initialPosition);
  };
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const markerHandler = (marker) => {
    if (marker === activeWindow) {
      return;
    }
    setActiveWindow(marker);
  };

  const dblMarkerHandeler = async (lat, lng) => {
    destinationRef.current = { lat, lng };
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current,
      destination: destinationRef.current,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResults(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  return (
    <Fragment>
      <form className={styles.search} onSubmit={searchHandler}>
        <Autocomplete>
          <input
            className={styles.inputPlaces}
            type="text"
            name="search"
            placeholder="Search Location"
            onBlur={searchChangeHandler}
          />
        </Autocomplete>
        <button title="Search Location" type="submit">
          <FontAwesomeIcon icon={faSearchLocation} size="2x" />
        </button>
      </form>
      {directionResults && (
        <div className={styles.information}>
          <h3>Distance: {distance}</h3>
          <h3>Duration: {duration}</h3>
        </div>
      )}
      {scanner === true && <AddQRCode onClose={closeHandler} />}
      <GoogleMap
        zoom={13}
        center={defaultLocation ? initialPosition : marker}
        mapContainerClassName={styles['map-container']}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onClick={mapHandler}
        onLoad={onMapLoad}
      >
        <Marker position={defaultLocation ? initialPosition : marker} />
        {directionResults !== null && (
          <DirectionsRenderer directions={directionResults} />
        )}
        {chargingPorts.map((marker) => (
          <>
            <Marker
              key={marker.name}
              position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
              icon={{
                url: '/EV.svg',
                scaledSize: new window.google.maps.Size(80, 80),
              }}
              onClick={() => markerHandler(marker.name)}
            />
            {activeWindow === marker.name && (
              <InfoWindow
                key={Math.random()}
                position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
              >
                <div className={styles.infoWindow}>
                  <p>Name: {marker.name}</p>
                  <p>Connector: {marker.connector}</p>
                  <button
                    type="button"
                    onClick={() =>
                      dblMarkerHandeler(Number(marker.lat), Number(marker.lng))
                    }
                    className={styles['info-button']}
                  >
                    Navigate
                  </button>
                </div>
              </InfoWindow>
            )}
          </>
        ))}
      </GoogleMap>
      <div className={styles['button-group']}>
        <button title="QR Code" onClick={scanQRCode}>
          <FontAwesomeIcon icon={faQrcode} size="2x" />
        </button>
        <button title="Current Location" onClick={defaultLocationHandler}>
          <FontAwesomeIcon icon={faLocationCrosshairs} size="2x" />
        </button>
        <button title="Filter">
          <FontAwesomeIcon icon={faFilter} size="2x" />
        </button>
      </div>
    </Fragment>
  );
};

export default Map;
