import { useContext, useEffect, useMemo, useState } from 'react';
import ListItem from '../../reusable/ListItem/ListItem';
import css from './CourseInfoBox.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CourseInfoBox({ className, course, onCrossButtonClick }) {
  const [prereqTree, setPrereqTree] = useState({});
  const [sectionList, setSectionList] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);

  function getSections(subject, number, callback) {
    fetch(`${BACKEND_URL}/get_sections?term=202308&subject=${subject}&number=${number}`)
      .then((res) => res.json())
      .then((res) => callback(res.result === null ? [] : res.result));
  }

  // Triggers when current course has changed
  useEffect(() => {
    if (course !== null) {
      getSections(course.subject, course.number, (res) => setSectionList(res));
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
          tags={[section.section_name]}
          mainText={section.title}
          subText={`Campus: ${section.campus}`}
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
      <button className={css.cross} onClick={onCrossButtonClick}>X</button>
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