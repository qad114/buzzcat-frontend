import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import ListItem from '../../reusable/ListItem/ListItem'
import css from './CourseInfoBox.module.css';
import CourseOverview from './CourseOverview';
import CourseSections from './CourseSections';
import CoursePrerequisites from './CoursePrerequisites';
import { Course, PrereqNode, Section } from '../../../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CourseInfoBox({ className = '', course, onCrossButtonClick }:
    {className?: string, course: Course, onCrossButtonClick: () => void}) {
  const [prereqTree, setPrereqTree] = useState<PrereqNode | null>(null);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [viewIndex, setViewIndex] = useState(0);

  // Triggers when current course has changed
  useEffect(() => {
    if (course !== null) {
      setSectionList(course.sections === undefined ? [] : course.sections);
      setPrereqTree(course.prerequisites);
    }
  }, [course]);

  if (course === null) return <></>;

  const views: [string, JSX.Element][] = [
    ["Overview", <CourseOverview course={course} />],
    ["Sections/Professors", <CourseSections sections={sectionList} />],
    ["Prerequisites", <CoursePrerequisites prereqTree={prereqTree} />]
  ]

  return (
    <div className={[CourseInfoBox.name, css.root, course === null ? css.inactive : css.active, className].join(' ')}>
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