import { useContext, useState } from 'react';
import { addToCourseHistory } from '../../../api/courseHistory';
import { getToken } from '../../../auth/firebase';
import { UserContext } from '../../../contexts/UserContext';
import ToggleSwitch from '../../reusable/ToggleSwitch/ToggleSwitch';
import css from './CourseHistory.module.scss';

export default function CourseHistory({ className = '' }: {className?: string}) {
  const { user } = useContext(UserContext);
  const [enabled, setEnabled] = useState(false);

  return (
    <div className={[CourseHistory.name, css.root, className].join(' ')}>
      <ToggleSwitch className={css.switch} value={enabled} setter={setEnabled} />
      {enabled ? <table>
        <thead>
          <tr>{['Subject', 'Number', 'Level', 'Grade'].map(s => <th>{s}</th>)}</tr>
        </thead>
        <tbody>
          {user?.courseHistory.map(course => <tr>
            <td>{course.subject}</td>
            <td>{course.number}</td>
            <td>{course.level}</td>
            <td>{course.grade}</td>
          </tr>)}
        </tbody>
      </table> : null}
    </div>
  )
}