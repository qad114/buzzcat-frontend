import { useContext, useEffect, useMemo, useState } from 'react';
import ListItem from '../../reusable/ListItem/ListItem';
import css from './CourseInfoBox.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CourseInfoBox({ className, course, onCrossButtonClick }) {
  const [prereqTree, setPrereqTree] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => setPrereqTree(course === null ? {} : course.prerequisites), [course]);

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
    /*const recurse = (root, callback) => {
      console.log(root.type === 'course' ? root.subject + root.number : root.type);
      if (root.type === 'course' && root.subject === subject && root.number === number) {
        console.log('found');
        root.children = [];
        getPrereqs(root.subject, root.number, root.children, callback);
      }
      if (root.type !== 'operator') return;
      for (const child of root.children) {
        recurse(child, callback);
      }
    }
    recurse(copyTree, (res, target) => {
      target.push(res);
      setPrereqTree(copyTree);
    });*/
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
    ["Sections/Professors", <></>],
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