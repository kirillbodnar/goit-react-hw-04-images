import PropTypes from 'prop-types';
import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { toast } from 'react-toastify';
import s from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (input.trim() === '') {
      toast.error('Введите запрос');
      return;
    }
    onSubmit(input.trim().split(' ').join('+'));
  };

  const handleChange = e => {
    const { value } = e.currentTarget;
    setInput(value);
  };

  return (
    <header className={s.Searchbar}>
      <form onSubmit={handleSubmit} className={s.form}>
        <button type="submit" className={s.button}>
          <ImSearch />
          <span className={s.label}>Search</span>
        </button>

        <input
          className={s.input}
          type="text"
          autoComplete="off"
          value={input}
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
