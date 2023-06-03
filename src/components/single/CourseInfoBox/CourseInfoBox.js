import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import ListItem from '../../reusable/ListItem/ListItem';
import css from './CourseInfoBox.module.css';
import CourseOverview from './CourseOverview';
import CourseSections from './CourseSections';
import CoursePrerequisites from './CoursePrerequisites';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CourseInfoBox({ className, course, onCrossButtonClick }) {
  const [prereqTree, setPrereqTree] = useState({});
  const [sectionList, setSectionList] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);

  // Triggers when current course has changed
  useEffect(() => {
    if (course !== null) {
      setSectionList(course.sections === undefined ? [] : course.sections);
      setPrereqTree(course.prerequisites);
    }
  }, [course]);

  if (course === null) return <></>;

  const views = [
    ["Overview", <CourseOverview course={course} />],
    ["Sections/Professors", <CourseSections sections={sectionList} />],
    ["Prerequisites", <CoursePrerequisites prereqTree={prereqTree} />]
  ]

  return (
    <div className={[css.CourseInfoBox, className].join(' ')}>
      <FontAwesomeIcon className={css.cross} onClick={onCrossButtonClick} icon={faXmark}/>
      <div className={[css.pane, css.left].join(' ')}>
        {views.map(([name, view], index) =>
          <ListItem
            key={name}
            className={[css.ListItem, index === viewIndex ? css.active : css.inactive].join(' ')}
            mainText={name}
            onClick={() => setViewIndex(index)}
          />
        )}
      </div>
      <div className={[css.pane, css.right].join(' ')}>
        {views[viewIndex][1]}
      </div>
    </div>
  )
}