import { User } from '../../../types';
import { emailSignOut } from '../../../auth/firebase';
import ListItem from '../../reusable/ListItem/ListItem';
import css from './ProfileBox.module.css';

export default function ProfileBox({ className = '', user, active }: {className?: string, user: User, active: boolean}) {
  return (
    <div className={[ProfileBox.name, css.root, active ? css.active : css.inactive, className].join(' ')}>
      <div className={css.leftContainer}>
        <div className={[css.pane, css.left].join(' ')}>
          <div className={css.profileIcon}>{user.displayName?.substring(0, 2).toUpperCase()}</div>
          <div className={css.displayName}>{user.displayName}</div>
          <ListItem className={css.tab} mainText={'General info'} />
          <ListItem className={css.tab} mainText={'Course history'} />
          <ListItem className={css.tab} mainText={'Sync'} />
          <ListItem className={css.tab} mainText={'About'} />
        </div>
        <button className={css.signOut} onClick={emailSignOut}>Sign out</button>
      </div>
      <div className={[css.pane, css.right].join(' ')}></div>
    </div>
  );
}