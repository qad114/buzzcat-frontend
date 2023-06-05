import { Course } from '../../../types';
import css from './CourseOverview.module.css';

export default function CourseOverview({ className = '', course }: {className?: string, course: Course}) {
  return (
    <div className={[CourseOverview.name, css.root, className].join(' ')}>
      <div className={css.containerTitleDesc}>
        <div className={css.title}>{`${course.subject} ${course.number}: ${course.title}`}</div>
        <div className={css.description}>{course.description}</div>
      </div>

      <div className={css.containerGeneralInfo}>
        <div style={{fontWeight: 'bold'}}>General information</div>
        <div>{`Credits: TODO`}</div>
      </div>
    </div>
  )
}