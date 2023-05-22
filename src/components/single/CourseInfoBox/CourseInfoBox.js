import { useContext, useState } from 'react';
import ListItem from '../../reusable/ListItem/ListItem';
import Tabs from '../../reusable/Tabs/Tabs';
import css from './CourseInfoBox.module.css';

function prereqsToHTML(root) {
  if (root.type === 'operator') {
    const btn_text = root.value === 'or' ? 'One or more of:' : 'All of:';
    return (
      <li><button className={css.prereqNode}>{btn_text}</button>
        <ul className={css.prereqListNested}>
          {root.children.map((node) => prereqsToHTML(node))}
        </ul>
      </li>
    )
  } else if (root.type === 'course') {
    const btn_text = root.subject + ' ' + root.number;
    return (
      <li><button className={css.prereqNode}>{btn_text}</button></li>
    )
  } else if (root.type === 'test_score') {
    return (
      <li><button className={css.prereqNode}>{root.test + ' ' + root.score}</button></li>
    )
  }
}

export default function CourseInfoBox({ className, course, onCrossButtonClick }) {
  /*const [tabs, setTabs] = useState([
    ["Overview", true],
    ["Sections/Professors", false],
    ["Prerequisites", false],
  ]);*/

  const overview = course === null ? <></> : (
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

  const prerequisites = course === null ? <></> : (
    <div className={css.prerequisites}>
      <ul>
        {prereqsToHTML(course.prerequisites)}
      </ul>
    </div>
  )

  const views = [
    ["Overview", overview],
    ["Sections/Professors", <></>],
    ["Prerequisites", prerequisites]
  ]

  const [viewIndex, setViewIndex] = useState(0);

  return (
    <div className={[css.CourseInfoBox, className].join(' ')}>
      <button className={css.cross} onClick={onCrossButtonClick}>X</button>
      {/*<Tabs className={css.Tabs} views={[
        ["Overview", overview],
        ["Sections/Professors", <></>],
        ["Prerequisites", prerequisites]
      ]} />*/}
      <div className={[css.pane, css.left].join(' ')}>
        {views.map(([name, view], index) =>
          <ListItem
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