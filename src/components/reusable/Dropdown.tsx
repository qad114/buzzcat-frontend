import css from '#src/styles/Dropdown.module.scss';
import { ReactNode } from 'react';

export default function Dropdown({ className = '', title, children }: {className?: string, title: string, children?: ReactNode}) {
  return (
    <div className={[Dropdown.name, css.root, className].join(' ')}>
      <button className={css.btn}>{title}</button>
      <div className={css.items}>
        {children}
      </div>
    </div>
  )
}