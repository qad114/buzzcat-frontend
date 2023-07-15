import css from '#src/styles/Navbar.module.scss';
import { User } from '../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrush, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Dropdown from '../../reusable/Dropdown';
import ListItem from '../../reusable/ListItem';

export default function Navbar({ className = '', onThemeButtonClick, onLoginButtonClick, onTermChange }: 
    {className?: String, onThemeButtonClick: () => void, onLoginButtonClick: () => void, onTermChange?: (termId: number) => void}) {
  const { user } = useContext(UserContext);

  // TODO: Don't hardcode these
  const terms: [number, string][] = [
    [202308, 'Fall 2023'],
    [202303, 'Spring 2023'],
    [202208, 'Fall 2022'],
    [202203, 'Spring 2022'],
    [202108, 'Fall 2021'],
    [202103, 'Spring 2021']
  ]
  const [termIndex, setTermIndex] = useState(0);

  function onTermItemClick(index: number) {
    setTermIndex(index);
  }
  
  return (
    <div className={[Navbar.name, css.root, className].join(' ')}>
      <div className={css.left}>
        <h1 className={css.heading}>BuzzCat</h1>
        <Dropdown title={terms[termIndex][1]}>
          {terms.map(([id, name], index) => <ListItem className={css.dropdownItem} mainText={name} onClick={() => onTermItemClick(index)} />)}
        </Dropdown>
      </div>
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