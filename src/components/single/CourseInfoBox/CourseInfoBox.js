import { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext';
import Tabs from '../../reusable/Tabs/Tabs'
import css from './CourseInfoBox.module.css'

function prereqsToHTML(root) {
  if (root.type === 'operator') {
    const btn_text = root.value === 'or' ? 'One or more of:' : 'All of:';
    return (
      <li><button className={css.prereqNode}>{btn_text}</button>
        <ul className={css.prereqListNested}>
          {/*prereqsToHTML(root.left)*/}
          {/*prereqsToHTML(root.right)*/}
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

export default function CourseInfoBox({ className, course }) {
  const { theme } = useContext(ThemeContext);
  const [tabs, setTabs] = useState([
    ["Overview", true],
    ["Sections/Professors", false],
    ["Prerequisites", false],
  ]);

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

  return (
    <div className={[css.CourseInfoBox, theme, 'bg-4', className].join(' ')}>
      <div className={[css.pane, css.left, theme, 'bg-5'].join(' ')}>
        <Tabs state={[tabs, setTabs]} />
      </div>
      <div className={[css.pane, css.right, theme, 'bg-4'].join(' ')}>
        {
          tabs[0][1] ? overview :
          tabs[1][1] ? <></> :
          tabs[2][1] ? prerequisites :
          <></>
        }
      </div>
    </div>
  )
}