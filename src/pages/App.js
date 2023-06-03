import css from './App.module.css';

import { useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

import CourseInfoBox from '../components/single/CourseInfoBox/CourseInfoBox';
import LoginBox from '../components/single/LoginBox/LoginBox';
import Navbar from '../components/single/Navbar/Navbar';
import TextField from '../components/reusable/TextField/TextField';
import ListItem from '../components/reusable/ListItem/ListItem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const INPUT_TIMEOUT = 200;
const PAGE_SIZE = 50;

export default function App() {
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
    setCurrentCourse(currentCourse === course ? null : course);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={['App', css.App, theme].join(' ')}> {/* Global 'App' class allows all components to get the current theme using pure CSS */}
        <Navbar className={css.Navbar} onThemeButtonClick={() => {setTheme(theme === 'dark' ? 'light' : 'dark');}} onLoginButtonClick={() => {setLoginMode(!loginMode);}} />
        <div className={css.body}>

          <div className={[css.pane, css.left, currentCourse === null ? css.active : css.inactive].join(' ')}>

            <TextField className={[css.TextField, css.search].join(' ')} defaultText={'Search...'} inputRef={searchInput} onChange={onTextFieldChange} />
            
            <div className={css.subheading}>Credits</div>
            <div className={css.row}>
              <TextField className={[css.TextField, css.credits, css.start].join(' ')} defaultText={'Min'} inputRef={creditsMinInput} onChange={() => {
                creditsMinInput.current.value = creditsMinInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
              <TextField className={[css.TextField, css.credits, css.end].join(' ')} defaultText={'Max'} inputRef={creditsMaxInput} onChange={() => {
                creditsMaxInput.current.value = creditsMaxInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
            </div>

          </div>

          <div className={[css.pane, css.right, currentCourse === null ? css.active : css.inactive].join(' ')} ref={rightPane} onScroll={() => {
            // Check if we have scrolled to the bottom
            const scrollOffset = rightPane.current.scrollHeight - rightPane.current.scrollTop - rightPane.current.clientHeight;
            console.log(scrollOffset);
            if (scrollOffset <= 1) {
              console.log('reached bottom');
              search(searchOffset + PAGE_SIZE, PAGE_SIZE, true); // TODO: ugly and potentially a race condition, maybe track offset within search()
              setSearchOffset(searchOffset + PAGE_SIZE);
            }
          }}>
            {/*searchResults.map((entry, index) => <SearchResultCard className={[css.SearchResultCard, currentCourse === entry ? css.active : css.inactive].join(' ')} key={entry.subject + entry.number} result={entry} onClick={() => {onCourseCardClick(index);}} />)*/}
            {searchResults.map((entry, index) => 
              <ListItem 
                className={[css.ListItem, currentCourse === entry ? css.active : css.inactive].join(' ')}
                key={entry.subject + ' ' + entry.number}
                tags={[
                  entry.subject + ' ' + entry.number,
                  entry.credits.operator === null ? `${entry.credits.low} credit${entry.credits.low === 1 ? '' : 's'}` : `${entry.credits.low} ${entry.credits.operator.toLowerCase()} ${entry.credits.high} credits`
                ]}
                mainText={entry.title}
                subText={entry.description}
                onClick={() => onCourseCardClick(index)}
              />
            )}
          </div>

          <CourseInfoBox
            className={[css.CourseInfoBox, currentCourse === null ? css.inactive : css.active].join(' ')}
            course={currentCourse} 
            onCrossButtonClick={() => setCurrentCourse(null)} />

        </div>

        <div className={[css.bgOverlay, loginMode ? css.active : css.inactive].join(' ')} onClick={() => {setLoginMode(false); setCurrentCourse(null);}} />
        <LoginBox className={[css.LoginBox, loginMode ? css.active : css.inactive].join(' ')} />
      </div>
    </ThemeContext.Provider>
  );
}