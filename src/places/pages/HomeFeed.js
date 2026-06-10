import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import API_URL from '../../shared/util/api';
import './HomeFeed.css';

const HomeFeed = () => {
  const auth = useContext(AuthContext);
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
            <p className="feed-hero__eyebrow">Live feed</p>
            <h2>See where people are posting from right now.</h2>
            <p>
              A social-style timeline of shared places, ordered by recency and
              built for quick scanning on desktop and mobile.
            </p>
            {auth.isLoggedIn && (
              <div className="feed-hero__actions">
                <Button to="/places/new">Share a place</Button>
                <Link className="feed-hero__link" to={`/${auth.userId}/places`}>
                  My places
                </Link>
              </div>
            )}
          </div>
          <div className="feed-hero__stat">
            <span>Posts</span>
            <strong>{loadedPlaces ? loadedPlaces.length : '...'}</strong>
            <small>recent shares</small>
          </div>
        </header>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedPlaces && (
          <PlaceList items={loadedPlaces} isLoggedIn={auth.isLoggedIn} />
        )}
      </section>
    </React.Fragment>
  );
};

export default HomeFeed;
