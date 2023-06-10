import { Dispatch, SetStateAction, useState } from 'react';
import css from '#src/styles/ToggleSwitch.module.scss';

export default function ToggleSwitch({ className = '', value, setter }: {className?: string, value: boolean, setter: Dispatch<SetStateAction<boolean>>}) {
  return (
    <div className={[ToggleSwitch.name, css.root, className].join(' ')} onClick={() => setter(!value)}>
      <div className={css.switch}>
        <div className={[css.handle, value ? css.active : css.inactive].join(' ')}/>
      </div>
      <div className={css.label}>{value ? 'Enabled' : 'Disabled'}</div>
    </div>
  )
}