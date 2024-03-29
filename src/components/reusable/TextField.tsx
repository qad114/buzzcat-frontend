import { LegacyRef } from 'react';
import css from '#src/styles/TextField.module.scss';

export default function TextField({ className = '', defaultText, inputRef, onChange, isPassword = false }: 
    {className?: string, defaultText: string, inputRef?: LegacyRef<HTMLInputElement>, onChange?: () => void, isPassword?: boolean}) {
  return (
    <input className={[TextField.name, css.root, className].join(' ')} type={isPassword ? 'password' : 'text'} ref={inputRef} placeholder={defaultText} onChange={onChange}></input>
  )
}