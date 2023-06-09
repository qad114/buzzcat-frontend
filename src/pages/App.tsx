import css from './App.module.scss';

import { useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Course, User } from '../types';

import CourseInfoBox from '../components/single/CourseInfoBox/CourseInfoBox';
import LoginBox from '../components/single/LoginBox/LoginBox';
import Navbar from '../components/single/Navbar/Navbar';
import TextField from '../components/reusable/TextField/TextField';
import ListItem from '../components/reusable/ListItem/ListItem';
import ProfileBox from '../components/single/ProfileBox/ProfileBox';

import { onEmailSignIn, onEmailSignOut } from '../auth/firebase';
import { getUser } from '../api/auth';
import { searchCourses } from '../api/courses';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const INPUT_TIMEOUT = 200;
const PAGE_SIZE = 50;

export default function App() {
  const [theme, setTheme] = useState('dark');

  const [loginMode, setLoginMode] = useState(false);

  const searchInput = useRef<HTMLInputElement>(null);
  const creditsMinInput = useRef<HTMLInputElement>(null);
  const creditsMaxInput = useRef<HTMLInputElement>(null);
  const rightPane = useRef<HTMLDivElement>(null);

  let textFieldTimer: ReturnType<typeof setTimeout>;

  const [user, setUser] = useState<User | null>(null);
  const [searchOffset, setSearchOffset] = useState(0);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  onEmailSignIn(async token => {
    const user = await getUser(token);
    setUser(user);
  })

  onEmailSignOut(() => setUser(null));

  async function search(offset = 0, limit = 50, append = false) {
    console.log(`searching from ${offset} to ${offset + limit}`)
    const res = await searchCourses({
      term: '202308',
      query: searchInput.current?.value || '',
      creditsLow: creditsMinInput.current?.value,
      creditsHigh: creditsMaxInput.current?.value,
      offset: offset,
      limit: limit
    });
    setSearchResults(append ? searchResults.concat(res) : res);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {search();}, []) // populate results in the beginning
 
  function onTextFieldChange() {
    clearTimeout(textFieldTimer);
    textFieldTimer = setTimeout(() => {
      setSearchOffset(0);
      search(0, PAGE_SIZE);
    }, INPUT_TIMEOUT);
  }

  function onCourseCardClick(index: number) {
    const course = searchResults[index];
    setCurrentCourse(currentCourse === course ? null : course);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={[App.name, css.root, theme].join(' ')}> {/* Global 'App' class allows all components to get the current theme using pure CSS */}
        <Navbar user={user} onThemeButtonClick={() => {setTheme(theme === 'dark' ? 'light' : 'dark');}} onLoginButtonClick={() => {setLoginMode(!loginMode);}} />
        <div className={css.body}>

          <div className={[css.pane, css.left, currentCourse === null ? css.active : css.inactive].join(' ')}>

            <TextField className={[css.TextField, css.search].join(' ')} defaultText={'Search...'} inputRef={searchInput} onChange={onTextFieldChange} />
            
            <div className={css.subheading}>Credits</div>
            <div className={css.row}>
              <TextField className={[css.TextField, css.credits, css.start].join(' ')} defaultText={'Min'} inputRef={creditsMinInput} onChange={() => {
                if (creditsMinInput.current) creditsMinInput.current.value = creditsMinInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
              <TextField className={[css.TextField, css.credits, css.end].join(' ')} defaultText={'Max'} inputRef={creditsMaxInput} onChange={() => {
                if (creditsMaxInput.current) creditsMaxInput.current.value = creditsMaxInput.current.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                onTextFieldChange();
              }} />
            </div>

          </div>

          <div className={[css.pane, css.right, currentCourse === null ? css.active : css.inactive].join(' ')} ref={rightPane} onScroll={() => {
            // Check if we have scrolled to the bottom
            if (rightPane.current) {
              const scrollOffset = rightPane.current.scrollHeight - rightPane.current.scrollTop - rightPane.current.clientHeight;
              console.log(scrollOffset);
              if (scrollOffset <= 1) {
                console.log('reached bottom');
                search(searchOffset + PAGE_SIZE, PAGE_SIZE, true); // TODO: ugly and potentially a race condition, maybe track offset within search()
                setSearchOffset(searchOffset + PAGE_SIZE);
              }
            }
          }}>
            {/*searchResults.map((entry, index) => <SearchResultCard className={[css.SearchResultCard, currentCourse === entry ? css.active : css.inactive].join(' ')} key={entry.subject + entry.number} result={entry} onClick={() => {onCourseCardClick(index);}} />)*/}
            {searchResults.map((entry: Course, index: number) => 
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

          {currentCourse !== null && <CourseInfoBox
            course={currentCourse} 
            onCrossButtonClick={() => setCurrentCourse(null)} />}

        </div>

        <div className={[css.bgOverlay, loginMode ? css.active : css.inactive].join(' ')} onClick={() => setLoginMode(false)} />
        {user ? <ProfileBox user={user} active={loginMode} /> : <LoginBox active={loginMode} />}
      </div>
    </ThemeContext.Provider>
  );
}