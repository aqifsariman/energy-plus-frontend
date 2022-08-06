import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'react';

const CloseButton = (props) => {
  return (
    <Fragment>
      <button className={props.className} onClick={props.onClose}>
        <FontAwesomeIcon icon={faXmark} color="black" size="2x" />
      </button>
    </Fragment>
  );
};

export default CloseButton;
