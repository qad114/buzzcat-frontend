import css from './CourseSections.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faSchool, faUserTie } from '@fortawesome/free-solid-svg-icons'
import ListItem from '../../reusable/ListItem/ListItem';
import WeeklySchedule from "../../reusable/WeeklySchedule/WeeklySchedule";
import { Section } from '../../../types';

export default function CourseSections({ className = '', sections }: {className?: string, sections: Section[]}) {
  return (
    <div className={[CourseSections.name, css.root, className].join(' ')}>
      {sections.map((section) => 
        <ListItem
          className={[css.ListItem, css.section].join(' ')}
          tags={[
            //`CRN: ${section.crn}`,
            //section.credits.operator === null ? `${section.credits.low} credit${section.credits.low === 1 ? '' : 's'}` : `${section.credits.low} ${section.credits.operator.toLowerCase()} ${section.credits.high} credits`,
            section.schedule_type.substring(0, section.schedule_type.length - 1)
          ]}
          mainText={section.id}
          subText={
            <div className={css.details}>
              <div className={[css.detailsContainer, css.left].join(' ')}>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faHashtag} />
                  {section.crn}
                </div>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faSchool} />
                  {section.campus}
                </div>
                <div>
                  <FontAwesomeIcon className={css.icon} icon={faUserTie} />
                  {
                    section.faculty.length === 0 ? 'Unknown' : section.faculty.map(prof => {
                      const [first, last] = prof.name.split(', ');
                      return `${last} ${first}`;
                    }).join(', ')
                  }
                </div>
              </div>
              <div className={[css.detailsContainer, css.right].join(' ')}>
                {section.meetings.map(meeting => <WeeklySchedule className={css.WeeklySchedule} meeting={meeting} />)}
              </div>
            </div>
          }
        />
      )}
    </div>
  )
}