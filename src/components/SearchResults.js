import React from 'react';
import '../blocks/SearchResults.css';
import NewsCardList from './NewsCardList';
import data from '../utils/dummydata.js';

export default function SearchResults({ handleNewsMark }) {
  return (
    <section className="search-results">
      <NewsCardList handleNewsMark={handleNewsMark} data={data.articles.slice(0, 3)} />
      <button type="button" className="search-results__button">
        Show more
      </button>
    </section>
  );
}
