import PropTypes from 'prop-types';
import { useEffect } from 'react';
import s from './Modal.module.css';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ image, toggleModal }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(e) {
      if (e.code === 'Escape') {
        toggleModal();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleBackdropClick}>
      <div className={s.Modal}>
        <img src={image.largeImageURL} alt={image.tags} />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
};
