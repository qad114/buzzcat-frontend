import { User } from '../../../types';
import { emailSignOut } from '../../../auth/firebase';
import ListItem from '../../reusable/ListItem/ListItem';
import css from './ProfileBox.module.scss';
import { useContext, useState } from 'react';
import CourseHistory from './CourseHistory';
import { UserContext } from '../../../contexts/UserContext';

export default function ProfileBox({ className = '', active }: {className?: string, active: boolean}) {
  const { user } = useContext(UserContext);
  const [viewIndex, setViewIndex] = useState(0);
  const views: [string, JSX.Element][] = [
    ['Course History', <CourseHistory />]
  ]

  return (
    <div className={[ProfileBox.name, css.root, active ? css.active : css.inactive, className].join(' ')}>
      <div className={css.leftContainer}>
        <div className={[css.pane, css.left].join(' ')}>
          <div className={css.profileIcon}>{user?.displayName?.substring(0, 2).toUpperCase()}</div>
          <div className={css.displayName}>{user?.displayName}</div>
          {views.map(([name, view], index) => 
            <ListItem
              className={[css.tab, index === viewIndex ? css.active : css.inactive].join(' ')}
              mainText={name}
              onClick={() => setViewIndex(index)}
            />
          )}
        </div>
        <button className={css.signOut} onClick={emailSignOut}>Sign out</button>
      </div>
      <div className={[css.pane, css.right].join(' ')}>
        {views[viewIndex][1]}
      </div>
    </div>
  );
}