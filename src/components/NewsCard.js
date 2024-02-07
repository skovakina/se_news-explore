import { React, useContext, useState } from 'react';
import '../blocks/NewsCard.css';
import defaultImage from '../images/news-image.jpg';
import { useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function NewsCard({ key, article, handleNewsMark, handleDeleteNews }) {
  const { isLoggedIn } = useContext(CurrentUserContext);
  const [isHovering, setIsHovering] = useState(false);

  const isMarkedClassName = `news-card__icon-image ${
    article.isMarked ? 'news-card__icon-image_type_bookmark-marked' : 'news-card__icon-image_type_bookmark'
  }`;

  const location = useLocation();
  const renderHeader = () => {
    if (location.pathname === '/saved-news') {
      return (
        <div className=" news-card__header   news-card__header_saved">
          <div className="news-card__category">{article.category}</div>
          {isHovering && <div className="news-card__popup">Remove from saved</div>}
          <div className="news-card__icon">
            <div
              className="news-card__icon-image news-card__icon-image_type_delete"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => handleDeleteNews(article)}
            ></div>
          </div>
        </div>
      );
    }
    return (
      <div className="news-card__header">
        {isHovering && !isLoggedIn && <div className="news-card__popup">Sign in to save articles</div>}
        <div className="news-card__icon">
          <div
            className={isMarkedClassName}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => isLoggedIn && handleNewsMark(article)}
          ></div>
        </div>
      </div>
    );
  };

  const formatDate = (publishedAt) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(publishedAt);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <li key={key} className="news-card">
      {renderHeader()}
      <img src={article.urlToImage || defaultImage} alt={article.title} className="news-card__image" />
      <div className="news-card__body">
        <div className="news-card__date">{formatDate(article.publishedAt)}</div>
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__text">{article.content.replace(/\[.*?\]/g, '')}</p>
        <p className="news-card__publisher">{article.source.name}</p>
      </div>
    </li>
  );
}
