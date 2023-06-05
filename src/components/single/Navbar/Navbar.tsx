import css from './Navbar.module.css';

export default function Navbar({ className, onThemeButtonClick, onLoginButtonClick }: 
    {className: String, onThemeButtonClick: () => void, onLoginButtonClick: () => void}) {
  return (
    <div className={[Navbar.name, css.root, className].join(' ')}>
      <h1 className={css.heading}><span style={{fontWeight: 'bold'}}>BuzzCat</span> Fall 2023</h1>
      <div className={css.items}>
        <button onClick={onThemeButtonClick}>Change Theme</button>
        <button onClick={onLoginButtonClick}>Login</button>
      </div>
    </div>
  )
}