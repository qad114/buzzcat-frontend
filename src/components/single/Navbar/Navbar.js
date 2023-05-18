import { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar({ className, onThemeButtonClick, onLoginButtonClick }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`${styles.Navbar} ${theme} bg-0 ${className}`}>
      <h1 className={styles.heading}><span style={{fontWeight: 'bold'}}>BuzzCat</span> Fall 2023</h1>
      <div className={styles.items}>
        <button className={`${theme} bg-0 hoverable clickable`} onClick={onThemeButtonClick}>Change Theme</button>
        <button className={`${theme} bg-0 hoverable clickable`} onClick={onLoginButtonClick}>Login</button>
      </div>
    </div>
  )
}