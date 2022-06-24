import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './App.module.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import ErrorMarkUp from 'components/ErrorMarkUp/ErrorMarkUp';

export default function App() {
  const [query, setQuery] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [currentImage, setCurrentImage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (query === '') {
      return;
    }
    setStatus('pending');

    fetch(
      `https://pixabay.com/api/?q=${query}&page=${page}&key=19102910-cffe66986be4c018bfebf7445&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(
          new Error(`По запросу '${query}' ничего не найдено`)
        );
      })
      .then(images => {
        if (images.hits.length === 0) {
          return Promise.reject(
            new Error(`По запросу '${query}' ничего не найдено`)
          );
        }
        setGallery(gallery => {
          return [...gallery, ...images.hits];
        });
        setStatus('resolved');
        setTotalImages(images.totalHits);
      })
      .catch(error => {
        setError(error);
        setStatus('error');
      });
  }, [query, page]);

  const handleSubmit = newQuery => {
    if (newQuery !== query) {
      setGallery([]);
      setPage(1);
    }
    setQuery(newQuery);
  };

  const handleButtonClick = () => {
    setPage(page => {
      return page + 1;
    });
  };

  const handleImageClick = image => {
    toggleModal();
    setCurrentImage(image);
  };

  const toggleModal = () => {
    setShowModal(showModal => {
      return !showModal;
    });
  };

  return (
    <>
      <div className={s.App}>
        <Searchbar onSubmit={handleSubmit} />
        {status === 'error' && <ErrorMarkUp error={error} />}

        {gallery.length !== 0 && (
          <ImageGallery images={gallery} onClick={handleImageClick} />
        )}

        {status === 'resolved' && gallery.length !== totalImages && (
          <Button onClick={handleButtonClick} />
        )}
        {showModal && <Modal image={currentImage} toggleModal={toggleModal} />}
        {status === 'pending' && <Loader />}
      </div>
      <ToastContainer />
    </>
  );
}
