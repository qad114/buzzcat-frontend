import { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import css from './Tabs.module.css';

export default function Tabs({ className, state }) {
  const { theme } = useContext(ThemeContext);
  const [tabs, setTabs] = state;

  function onTabClick(clickedName) {
    setTabs(tabs.map(([tabName, isActive]) => [tabName, tabName === clickedName]));
  }

  console.log(tabs);
  return (
    <div className={[css.Tabs, className].join(' ')}>
      {tabs.map(([tabName, isActive]) => <button key={tabName} className={[theme, isActive ? css.active : css.inactive].join(' ')} onClick={() => {onTabClick(tabName);}}>{tabName}</button>)}
    </div>
  )
}