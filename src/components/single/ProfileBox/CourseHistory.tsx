import { useState } from 'react';
import ToggleSwitch from '../../reusable/ToggleSwitch/ToggleSwitch';
import css from './CourseHistory.module.scss';

export default function CourseHistory({ className = '' }: {className?: string}) {
  const [enabled, setEnabled] = useState(false);
  const [rows, setRows] = useState<string[][]>([
    ['CS', '1301', 'Undergraduate', 'P'],
    ['CS', '1311', 'Undergraduate', 'A'],
    ['MATH', '1554', 'Undergraduate', 'A']
  ]);

  return (
    <div className={[CourseHistory.name, css.root, className].join(' ')}>
      <ToggleSwitch className={css.switch} value={enabled} setter={setEnabled} />
      {enabled ? <table>
        <thead>
          <tr>{['Subject', 'Number', 'Level', 'Grade'].map(s => <th>{s}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(row => <tr>{row.map(s => <td>{s}</td>)}</tr>)}
        </tbody>
      </table> : null}
    </div>
  )
}