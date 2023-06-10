import { useContext, useState } from 'react';
import { alterSetting } from '../../../../api/auth';
import { addToCourseHistory } from '../../../../api/courseHistory';
import { getToken } from '../../../../auth/firebase';
import { UserContext } from '../../../../contexts/UserContext';
import ToggleSwitch from '../../../reusable/ToggleSwitch';
import css from '#src/styles/CourseHistory.module.scss';

export default function CourseHistory({ className = '' }: {className?: string}) {
  const { user, setUser } = useContext(UserContext);
  if (!user) return null; // this shouldn't happen, just to suppress TS errors

  async function onSwitchClick() {
    const token = await getToken();
    if (user && token) {
      //setCourseHistory(token, user, setUser, !user?.settings.courseHistoryEnabled);
      alterSetting(token, user, setUser, 'courseHistoryEnabled', !user.settings.courseHistoryEnabled);
    }
  }

  return (
    <div className={[CourseHistory.name, css.root, className].join(' ')}>
      <ToggleSwitch className={css.switch} value={user.settings.courseHistoryEnabled} setter={onSwitchClick} />
      {user.settings.courseHistoryEnabled ? <table>
        <thead>
          <tr>{['Subject', 'Number', 'Level', 'Grade'].map(s => <th>{s}</th>)}</tr>
        </thead>
        <tbody>
          {user.courseHistory.map(course => <tr>
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