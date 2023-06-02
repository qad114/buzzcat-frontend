import css from './WeeklySchedule.module.css';

export default function WeeklySchedule({ className, meeting }) {
  const dayBools = {};
  for (const day of meeting.days) {
    dayBools[day] = true;
  }
  const [startHrs, startMins] = meeting.time_start === null ? [null, null] : [parseInt(meeting.time_start.substring(0, 2)), meeting.time_start.substring(2, 4)];
  const [endHrs, endMins] = meeting.time_end === null ? [null, null] : [parseInt(meeting.time_end.substring(0, 2)), meeting.time_end.substring(2, 4)];
  return (
    <div className={[css.WeeklySchedule, className].join(' ')}>
      {
        [['sunday', 'S'], ['monday', 'M'], ['tuesday', 'T'], ['wednesday', 'W'], ['thursday', 'T'], ['friday', 'F'], ['saturday', 'S']]
        .map(([day, letter]) =>
          <div className={[css.dayBox, dayBools[day] ? css.active : css.inactive].join(' ')}>
            <div className={css.dayText}>{letter}</div>
          </div>
        )
      }
      <div className={css.details}>
        {startHrs === null ? 'Asynchronous' : `${startHrs > 12 ? startHrs - 12 : startHrs}:${startMins} ${startHrs < 12 ? 'am' : 'pm'} - ${endHrs > 12 ? endHrs - 12 : endHrs}:${endMins} ${endHrs < 12 ? 'am' : 'pm'}`}<br/>
        {meeting.location.building === null ? 'Unknown or no physical location' : `${meeting.location.building} ${meeting.location.room}`}
      </div>
    </div>
  )
}