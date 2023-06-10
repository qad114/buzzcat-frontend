import css from '#src/styles/App.module.scss';

import { useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Course, User } from '../../types';

import CourseInfoBox from './App/CourseInfoBox';
import LoginBox from './App/LoginBox';
import Navbar from './App/Navbar';
import TextField from '../reusable/TextField';
import ListItem from '../reusable/ListItem';
import ProfileBox from './App/ProfileBox';

import { getToken, onEmailSignIn, onEmailSignOut } from '../../auth/firebase';
import { getUser } from '../../api/auth';
import { searchCourses } from '../../api/courses';
import { UserContext } from '../../contexts/UserContext';
import { prereqsSatisfied } from '../../misc';

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

  onEmailSignIn(async fbUser => {
    const user = await getUser(await getToken() as string);
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
      <UserContext.Provider value={{ user, setUser }}>
        <div className={[App.name, css.root, theme].join(' ')}> {/* Global 'App' class allows all components to get the current theme using pure CSS */}
          <Navbar onThemeButtonClick={() => {setTheme(theme === 'dark' ? 'light' : 'dark');}} onLoginButtonClick={() => {setLoginMode(!loginMode);}} />
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
              {searchResults.map((entry: Course, index: number) => {
                const satisfied = !user || !user.settings.courseHistoryEnabled || !entry.prerequisites || Object.keys(entry.prerequisites).length === 0 || prereqsSatisfied(entry.prerequisites, user.courseHistory);
                return <ListItem 
                  className={[css.ListItem, currentCourse === entry ? css.active : css.inactive].join(' ')}
                  key={entry.subject + ' ' + entry.number}
                  tags={[
                    entry.subject + ' ' + entry.number,
                    entry.credits.operator === null ? `${entry.credits.low} credit${entry.credits.low === 1 ? '' : 's'}` : `${entry.credits.low} ${entry.credits.operator.toLowerCase()} ${entry.credits.high} credits`
                  ]}
                  warningTags={[satisfied ? undefined : 'Missing prerequisite(s)']}
                  mainText={entry.title}
                  subText={entry.description}
                  onClick={() => onCourseCardClick(index)}
                />;
              })}
            </div>

            {currentCourse !== null && <CourseInfoBox
              course={currentCourse} 
              onCrossButtonClick={() => setCurrentCourse(null)} />}

          </div>

          <div className={[css.bgOverlay, loginMode ? css.active : css.inactive].join(' ')} onClick={() => setLoginMode(false)} />
          {user ? <ProfileBox active={loginMode} /> : <LoginBox active={loginMode} />}
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}