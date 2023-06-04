import css from './TextField.module.css';

export default function TextField({ className, defaultText, inputRef, onChange, isPassword=false }) {
  return (
    <input className={[TextField.name, css.root, className].join(' ')} type={isPassword ? 'password' : 'text'} ref={inputRef} placeholder={defaultText} onChange={onChange}></input>
  )
}