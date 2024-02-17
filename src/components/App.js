import { Route, Switch, Redirect } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
//  variables
import { getNews } from '../utils/NewsApi';
import { getItems, postItem, deleteItem } from '../utils/serverApi';
import { signup, signin } from '../utils/auth';
//  components

import Header from './Header';
import Footer from './Footer';
import AboutAuthor from './AboutAuthor';
import PopupRegister from './PopupRegister';
import PopupSuccess from './PopupSuccess';
import Navbar from './Navbar';
import SavedNews from './SavedNews';
import SearchResults from './SearchResults';
import ProtectedRoute from './ProtectedRoute';

//  context
import { CurrentUserContext } from '../contexts/CurrentUserContext';
//css
import '../blocks/App.css';
import PopupSignIn from './PopupSignIn';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const [savedNews, setSavedNews] = useState([]);
  const [keyWord, setKeyWord] = useState('');

  const getToken = () => localStorage.getItem('jwt');

  useEffect(() => {
    setLoggedIn(localStorage.getItem('isLoggedIn'));

    if (localStorage.getItem('keyword')) {
      setKeyWord(localStorage.getItem('keyword'));
    }
    if (localStorage.getItem('user')) {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    }

    if (localStorage.getItem('articles')) {
      setNews(JSON.parse(localStorage.getItem('articles')));
      setStartSearch(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getItems(getToken())
        .then((items) => {
          setSavedNews(items);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isLoggedIn]);

  const closePopup = () => {
    setActiveModal('');
  };

  const openPopupRegister = () => {
    setActiveModal('register');
  };

  const openPopupSignIn = () => {
    setActiveModal('signin');
  };

  const openPopupSuccess = () => {
    setActiveModal('success');
  };

  const handleSignUp = (data) => {
    signup(data)
      .then((user) => {
        openPopupSuccess();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser({});
    localStorage.removeItem('jwt');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  const handleSignIn = (data) => {
    signin(data)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('isLoggedIn', true);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        setCurrentUser(res.user);
        setLoggedIn(true);
        closePopup();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNewsMark = (article) => {
    const data = {
      keyword: keyWord,
      title: article.title,
      description: article.description,
      publishedAt: article.publishedAt,
      source: article.source.name,
      url: article.url,
      urlToImage: article.urlToImage,
    };

    postItem(data, getToken())
      .then((res) => {
        setSavedNews([res, ...savedNews]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (keyword) => {
    setStartSearch(true);
    setIsLoading(true);
    getNews(keyword)
      .then((res) => {
        setNews(res.articles);
        setKeyWord(keyword);
        localStorage.setItem('keyword', keyword);
        localStorage.setItem('articles', JSON.stringify(res.articles));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleDeleteNews = (article) => {
    deleteItem(article._id, getToken())
      .then(() => {
        const updatedList = savedNews.filter((item) => item._id !== article._id);
        setSavedNews(updatedList);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="app">
      <CurrentUserContext.Provider
        value={{
          currentUser,
          isLoggedIn,
        }}
      >
        {/* <BrowserRouter> */}
        <Navbar openPopupRegister={openPopupRegister} handleLogout={handleLogout} activeModal={activeModal} />

        <Switch>
          <ProtectedRoute path="/saved-news">
            <SavedNews handleNewsMark={handleNewsMark} news={savedNews} handleDeleteNews={handleDeleteNews} />
          </ProtectedRoute>
          <Route exact path="/">
            <Header handleSearch={handleSearch} />

            {startSearch && <SearchResults handleNewsMark={handleNewsMark} news={news} isLoading={isLoading} />}
            <AboutAuthor />
          </Route>

          <Route render={() => <Redirect to="/" />} />
        </Switch>
        <Footer />
        {/* </BrowserRouter> */}
        {activeModal === 'success' && (
          <PopupSuccess handleClosePopup={closePopup} isOpen={activeModal === 'success'} openPopupSignIn={openPopupSignIn} />
        )}
        {activeModal === 'register' && (
          <PopupRegister
            handleClosePopup={closePopup}
            isOpen={activeModal === 'register'}
            onSubmit={handleSignUp}
            openPopupSignIn={openPopupSignIn}
          />
        )}
        {activeModal === 'signin' && (
          <PopupSignIn
            handleClosePopup={closePopup}
            isOpen={activeModal === 'signin'}
            onSubmit={handleSignIn}
            openPopupRegister={openPopupRegister}
          />
        )}
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
