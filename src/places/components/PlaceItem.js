import React, { useState, useContext } from 'react';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import API_URL from '../../shared/util/api';
import './PlaceItem.css';

const formatRelativeTime = value => {
  if (!value) {
    return 'recently';
  }

  const diffInMs = Date.now() - new Date(value).getTime();

  if (Number.isNaN(diffInMs) || diffInMs < 0) {
    return 'recently';
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffInMs < minute) {
    return 'just now';
  }

  if (diffInMs < hour) {
    return `${Math.floor(diffInMs / minute)}m ago`;
  }

  if (diffInMs < day) {
    return `${Math.floor(diffInMs / hour)}h ago`;
  }

  return `${Math.floor(diffInMs / day)}d ago`;
};

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const creator = props.creator && props.creator.name ? props.creator : null;
  const creatorId =
    props.creatorId && props.creatorId.id ? props.creatorId.id : props.creatorId;

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${API_URL}/api/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {creator && (
            <div className="place-item__meta">
              <div className="place-item__author">
                <Avatar
                  image={creator.image}
                  alt={creator.name}
                  width="2.75rem"
                />
                <div className="place-item__author-info">
                  <strong>{creator.name}</strong>
                  <span>{formatRelativeTime(props.createdAt)}</span>
                </div>
              </div>
              <span className="place-item__badge">Place post</span>
            </div>
          )}
          <div className="place-item__image">
            <img src={`${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__body">
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <p className="place-item__address">{props.address}</p>
              <p className="place-item__description">{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={openMapHandler}>
                Open map
              </Button>
              {auth.userId === creatorId && (
                <Button to={`/places/${props.id}`}>Edit</Button>
              )}
              {auth.userId === creatorId && (
                <Button danger onClick={showDeleteWarningHandler}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
