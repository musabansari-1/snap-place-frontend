import React, { useEffect, useState } from 'react';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import API_URL from '../../shared/util/api';
import './HomeFeed.css';

const HomeFeed = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${API_URL}/api/places`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <section className="feed-shell">
        <header className="feed-hero">
          <div className="feed-hero__copy">
            <p className="feed-hero__eyebrow">Latest moments</p>
            <h2>Places people are sharing right now.</h2>
            <p>
              A live feed of the newest posts, sorted by recency, so the whole
              app feels more like a social timeline than a directory.
            </p>
          </div>
          <div className="feed-hero__stat">
            <span>Feed</span>
            <strong>{loadedPlaces ? loadedPlaces.length : '...'}</strong>
            <small>recent posts</small>
          </div>
        </header>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
      </section>
    </React.Fragment>
  );
};

export default HomeFeed;
