import { useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faSchool, faUserTie, faXmark } from '@fortawesome/free-solid-svg-icons'

import ListItem from '../../reusable/ListItem/ListItem';
import css from './CourseInfoBox.module.css';
import WeeklySchedule from '../../reusable/WeeklySchedule/WeeklySchedule';

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

  const overview = (
    <div className={css.overview}>
      <div className={css.containerTitleDesc}>
        <div className={css.title}>{`${course.subject} ${course.number}: ${course.title}`}</div>
        <div className={css.description}>{course.description}</div>
      </div>

      <div className={css.containerGeneralInfo}>
        <div style={{fontWeight: 'bold'}}>General information</div>
        <div>{`Credits: ${course.credits_max == null ? course.credits_min : course.credits_min + '-' + course.credits_max}`}</div>
      </div>
    </div>
  )

  const sections = (
    <div className={css.sections}>
      {console.log(sectionList)}
      {sectionList.map((section) => 
        <ListItem
          className={[css.ListItem, css.section].join(' ')}
          tags={[
            //`CRN: ${section.crn}`,
            //section.credits.operator === null ? `${section.credits.low} credit${section.credits.low === 1 ? '' : 's'}` : `${section.credits.low} ${section.credits.operator.toLowerCase()} ${section.credits.high} credits`,
            section.schedule_type.substring(0, section.schedule_type.length - 1)
          ]}
          mainText={section.id}
          subText={
            <div className={css.details}>
              <div className={[css.detailsContainer, css.left].join(' ')}>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faHashtag} />
                  {section.crn}
                </div>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faSchool} />
                  {section.campus}
                </div>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faUserTie} />
                  {
                    section.faculty.length === 0 ? 'Unknown' : section.faculty.map(prof => {
                      const [first, last] = prof.name.split(', ');
                      return `${last} ${first}`;
                    }).join(', ')
                  }
                </div>
              </div>
              <div className={[css.detailsContainer, css.right].join(' ')}>
                {section.meetings.map(meeting => <WeeklySchedule className={css.WeeklySchedule} meeting={meeting} />)}
              </div>
            </div>
          }
        />
      )}
    </div>
  )

  function getPrereqs(subject, number, callback) {
    fetch(`${BACKEND_URL}/get_course?term=202308&subject=${subject}&number=${number}`)
      .then((res) => res.json())
      .then((res) => callback(res.result === null ? {} : res.result.prerequisites));
  }

  function getTarget(tree, key) {
    let newTree = tree;
    for (let i = 0; i < key.length; i++) {
      const index = parseInt(key.charAt(i));
      newTree = newTree.children[index];
    }
    return newTree;
  }

  function onCourseNodeClick(subject, number, key) {
    console.log(`clicked ${subject} ${number}`);
    const copyTree = structuredClone(prereqTree);
    const target = getTarget(copyTree, key);
    getPrereqs(target.subject, target.number, (res) => {
      target.children = [res];
      setPrereqTree(copyTree);
    });
  }

  function prereqsToHTML(root, key = '') {
    console.log(root);
    if (root.type === 'operator') {
      const text = root.value === 'or' ? 'One or more of:' : 'All of:';
      return (
        <li><span className={[css.prereqNode, css.operator].join(' ')}>{text}</span>
          <ul className={css.prereqListNested}>
            {root.children.map((node, index) => prereqsToHTML(node, key + index))}
          </ul>
        </li>
      )
    } else if (root.type === 'course') {
      return (
        <li><button className={[css.prereqNode, css.course].join(' ')} onClick={() => onCourseNodeClick(root.subject, root.number, key)}>{root.subject + ' ' + root.number}</button>
          <ul className={css.prereqListNested}>
            {root.children === undefined ? null : root.children.map((node, index) => prereqsToHTML(node, key + index))}
          </ul>
        </li>
      )
    } else if (root.type === 'test_score') {
      return (
        <li><span className={css.prereqNode}>{root.test + ' ' + root.score}</span></li>
      )
    }
  }

  const prerequisites = (
    <div className={css.prerequisites}>
      <ul>
        {prereqsToHTML(prereqTree)}
      </ul>
    </div>
  )

  const views = [
    ["Overview", overview],
    ["Sections/Professors", sections],
    ["Prerequisites", prerequisites]
  ]

  return (
    <div className={[css.CourseInfoBox, className].join(' ')}>
      <button className={css.cross} onClick={onCrossButtonClick}>
        <FontAwesomeIcon icon={faXmark}/>
      </button>
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