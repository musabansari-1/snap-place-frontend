import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card className="place-list__empty">
          <p className="place-list__empty-kicker">Feed is quiet</p>
          <h2>No places posted yet.</h2>
          <p>
            Once people start sharing, this space will fill with image-first
            posts, location details, and quick actions.
          </p>
          <Button to="/places/new">Share a place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          creator={place.creator}
          createdAt={place.createdAt}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
