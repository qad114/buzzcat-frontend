import { Meeting } from '../../../types';
import css from './WeeklySchedule.module.css';

export default function WeeklySchedule({ className, meeting }: {className: string, meeting: Meeting}) {
  const dayBools: {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean
  } = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };

  for (const day of meeting.days) {
    dayBools[day] = true;
  }
  const [startHrs, startMins] = meeting.time_start === null ? [null, null] : [parseInt(meeting.time_start.substring(0, 2)), meeting.time_start.substring(2, 4)];
  const [endHrs, endMins] = [parseInt(meeting.time_end.substring(0, 2)), meeting.time_end.substring(2, 4)];
  const daysAndLetters:
    (['sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', 'S' | 'M' | 'T' | 'W' | 'F'])[]
    = [['sunday', 'S'], ['monday', 'M'], ['tuesday', 'T'], ['wednesday', 'W'], ['thursday', 'T'], ['friday', 'F'], ['saturday', 'S']];
  return (
    <div className={[WeeklySchedule.name, css.root, className].join(' ')}>
      {
        //[['sunday', 'S'], ['monday', 'M'], ['tuesday', 'T'], ['wednesday', 'W'], ['thursday', 'T'], ['friday', 'F'], ['saturday', 'S']]
        daysAndLetters.map(([day, letter]) =>
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