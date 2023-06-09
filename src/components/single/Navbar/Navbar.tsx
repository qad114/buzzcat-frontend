import css from './Navbar.module.scss';
import { User } from '../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrush, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';

export default function Navbar({ className = '', onThemeButtonClick, onLoginButtonClick }: 
    {className?: String, onThemeButtonClick: () => void, onLoginButtonClick: () => void}) {
  const { user } = useContext(UserContext);
  
  return (
    <div className={[Navbar.name, css.root, className].join(' ')}>
      <h1 className={css.heading}><span className={css.name}>BuzzCat</span> <span className={css.term}>Fall 2023</span></h1>
      <div className={css.items}>
        <button onClick={onThemeButtonClick}>
          <FontAwesomeIcon icon={faBrush} />
        </button>
        <button onClick={onLoginButtonClick}>
          <FontAwesomeIcon icon={user ? faUser : faRightToBracket} />
        </button>
      </div>
    </div>
  )
}