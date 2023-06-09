import { Meeting } from '../../../types';
import css from './WeeklySchedule.module.scss';

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
  
  let startHrs = 0;
  let startMins = '';
  let endHrs = 0;
  let endMins = '';
  let asyncSection = false;

  if (meeting.time_start === null || meeting.time_end === null) {
    asyncSection = true;
  } else {
    startHrs = parseInt(meeting.time_start.substring(0, 2));
    startMins = meeting.time_start.substring(2, 4);
    endHrs = parseInt(meeting.time_end.substring(0, 2));
    endMins = meeting.time_end.substring(2, 4);
  }

  const daysAndLetters:
    (['sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', 'S' | 'M' | 'T' | 'W' | 'F'])[]
    = [['sunday', 'S'], ['monday', 'M'], ['tuesday', 'T'], ['wednesday', 'W'], ['thursday', 'T'], ['friday', 'F'], ['saturday', 'S']];
  return (
    <div className={[WeeklySchedule.name, css.root, className].join(' ')}>
      {
        daysAndLetters.map(([day, letter]) =>
          <div className={[css.dayBox, dayBools[day] ? css.active : css.inactive].join(' ')}>
            <div className={css.dayText}>{letter}</div>
          </div>
        )
      }
      <div className={css.details}>
        {asyncSection ? 'Asynchronous' : `${startHrs > 12 ? startHrs - 12 : startHrs}:${startMins} ${startHrs < 12 ? 'am' : 'pm'} - ${endHrs > 12 ? endHrs - 12 : endHrs}:${endMins} ${endHrs < 12 ? 'am' : 'pm'}`}<br/>
        {meeting.location.building === null ? 'Unknown or no physical location' : `${meeting.location.building} ${meeting.location.room}`}
      </div>
    </div>
  )
}