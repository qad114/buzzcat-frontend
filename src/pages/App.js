import css from './App.module.css';

import { useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

//import CheckButton from '../components/reusable/CheckButton/CheckButton';
import CourseInfoBox from '../components/single/CourseInfoBox/CourseInfoBox';
//import Footer from '../components/single/Footer/Footer';
import LoginBox from '../components/single/LoginBox/LoginBox';
import Navbar from '../components/single/Navbar/Navbar';
import SearchResultCard from '../components/reusable/SearchResultCard/SearchResultCard';
import TextField from '../components/reusable/TextField/TextField';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const INPUT_TIMEOUT = 200;
const PAGE_SIZE = 50;

export default function App() {
  /*const attributes = {
    humanities: useState(false),
    socialSciences: useState(false),
    stem: useState(false),
    lowCost: useState(false),
    free: useState(false),
    honors: useState(false)
  };*/

  const [theme, setTheme] = useState('dark');

  const [loginMode, setLoginMode] = useState(false);

  const searchInput = useRef();
  const creditsMinInput = useRef();
  const creditsMaxInput = useRef();
  let textFieldTimer = null;

  const rightPane = useRef();
  const [searchOffset, setSearchOffset] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  const [currentCourse, setCurrentCourse] = useState(null);

  function search(offset = 0, limit = 50, append = false) {
    console.log(`searching from ${offset} to ${offset + limit}`)
    const url = `${BACKEND_URL}/search?term=202308&query=${searchInput.current.value}&credits_min=${creditsMinInput.current.value}&credits_max=${creditsMaxInput.current.value}&offset=${offset}&limit=${limit}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => setSearchResults(append ? searchResults.concat(res.result) : res.result));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(search, []) // populate results in the beginning
 
  function onTextFieldChange() {
    clearTimeout(textFieldTimer);
    textFieldTimer = setTimeout(() => {
      setSearchOffset(0);
      search(0, PAGE_SIZE);
    }, INPUT_TIMEOUT);
  }

  function onCourseCardClick(index) {
    const course = searchResults[index];
    setCurrentCourse(course);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={[css.App, theme].join(' ')}>
        <Navbar className={[css.Navbar, theme, 'bg-0'].join(' ')} onThemeButtonClick={() => {setTheme(theme === 'dark' ? 'light' : 'dark');}} onLoginButtonClick={() => {setLoginMode(!loginMode);}} />
        <div className={[css.body, theme, 'bg-0'].join(' ')}>

          <div className={[css.pane, css.left, theme, 'bg-5'].join(' ')}>

            <TextField className={[css.TextField, css.search, theme, 'bg-3', 'hoverable'].join(' ')} defaultText={'Search...'} inputRef={searchInput} onChange={onTextFieldChange} />
            
            <div className={[css.subheading, theme].join(' ')}>Credits</div>
            <div className={css.row}>
              <TextField className={[css.TextField, css.credits, css.start, theme, 'bg-3', 'hoverable'].join(' ')} defaultText={'Min'} inputRef={creditsMinInput} onChange={() => {
                creditsMinInput.current.value = creditsMinInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
              <TextField className={[css.TextField, css.credits, css.end, theme, 'bg-3', 'hoverable'].join(' ')} defaultText={'Max'} inputRef={creditsMaxInput} onChange={() => {
                creditsMaxInput.current.value = creditsMaxInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
            </div>

            {/*<div className={`App-pane-left-subheading ${theme}`}>Attributes</div>
            <div className='App-pane-left-row'>
              <CheckButton className={`attrs App-check-button-attrs--0 ${theme} bg-3`} text={'Humanities'} state={attributes.humanities} />
              <CheckButton className={`attrs App-check-button-attrs--1 ${theme} bg-3`} text={'Social Sciences'} state={attributes.socialSciences} />
              <CheckButton className={`attrs App-check-button-attrs--2 ${theme} bg-3`} text={'STEM'} state={attributes.stem} />
            </div>
            <div className='App-pane-left-row'>
              <CheckButton className={`attrs App-check-button-attrs--3 ${theme} bg-3`} text={'Low cost txtbk(s)'} state={attributes.lowCost} />
              <CheckButton className={`attrs App-check-button-attrs--4 ${theme} bg-3`} text={'Free txtbk(s)'} state={attributes.free} />
              <CheckButton className={`attrs App-check-button-attrs--5 ${theme} bg-3`} text={'Honors'} state={attributes.honors} />
            </div>

            <div className='App-pane-left-subheading dark'>Campuses</div>
            <div className='App-pane-left-row'>
              <CheckButton className={`App-check-button App-check-button-campuses App-check-button-campuses--0 ${theme} bg-3`} text={'Atlanta'} state={useState(false)} />
              <CheckButton className={`App-check-button App-check-button-campuses App-check-button-campuses--1 ${theme} bg-3`} text={'Online'} state={useState(false)} />
            </div>*/}

          </div>

          <div className={[css.pane, css.right, theme, 'bg-4'].join(' ')} ref={rightPane} onScroll={() => {
            // Check if we have scrolled to the bottom
            const scrollOffset = rightPane.current.scrollHeight - rightPane.current.scrollTop - rightPane.current.clientHeight;
            console.log(scrollOffset);
            if (scrollOffset <= 1) {
              console.log('reached bottom');
              search(searchOffset + PAGE_SIZE, PAGE_SIZE, true); // TODO: ugly and potentially a race condition, maybe track offset within search()
              setSearchOffset(searchOffset + PAGE_SIZE);
            }
          }}>
            {searchResults.map((entry, index) => <SearchResultCard className={[css.SearchResultCard, theme, 'bg-4', 'hoverable'].join(' ')} key={entry.subject + entry.number} result={entry} onClick={() => {onCourseCardClick(index);}} />)}
          </div>

        </div>
        {/*<Footer />*/}

        <div className={[css.bgOverlay, loginMode || (currentCourse !== null) ? css.active : css.inactive, theme].join(' ')} onClick={() => {setLoginMode(false); setCurrentCourse(null);}} />
        <LoginBox className={[css.LoginBox, loginMode ? css.active : css.inactive].join(' ')} />
        <CourseInfoBox className={[css.CourseInfoBox, currentCourse === null ? css.inactive : css.active, theme].join(' ')} course={currentCourse} />
      </div>
    </ThemeContext.Provider>
  );
}