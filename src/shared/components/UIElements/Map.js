// import React, { useRef, useEffect } from 'react';

// import './Map.css';

// const Map = props => {
//   const mapRef = useRef();
  
//   const { center, zoom } = props;

//   useEffect(() => {
//     const map = new window.google.maps.Map(mapRef.current, {
//       center: center,
//       zoom: zoom
//     });
  
//     new window.google.maps.Marker({ position: center, map: map });
//   }, [center, zoom]);  

//   return (
//     <div
//       ref={mapRef}
//       className={`map ${props.className}`}
//       style={props.style}
//     ></div>
//   );
// };

// export default Map;


import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

// Set your access token here
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const Map = props => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // store map instance to prevent re-initialization

  const { center, zoom } = props;

  useEffect(() => {
    if (mapInstance.current) return; // only initialize once

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat], // Mapbox uses [lng, lat]
      zoom: zoom
    });

    new mapboxgl.Marker().setLngLat([center.lng, center.lat]).addTo(mapInstance.current);

    return () => mapInstance.current.remove(); // cleanup on unmount
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;

