import css from './CheckButton.module.css';

export default function CheckButton({ className, text, state }) {
  const [checked, setChecked] = state;
  
  return (
    <button 
      className={[css.CheckButton, checked ? css.checked : css.unchecked, className].join(' ')}
      onClick={() => setChecked(!checked)}
    >
      {text}
    </button>
  )
}