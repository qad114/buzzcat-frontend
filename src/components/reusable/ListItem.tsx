import css from '#src/styles/ListItem.module.scss';
import { CSSProperties, Ref } from 'react';

export default function ListItem({ className = '', style, ref, tags = [], warningTags = [], mainText, subText, onClick }:
    {className?: string, style?: CSSProperties, ref?: Ref<any>, tags?: (string | undefined)[], warningTags?: (string | undefined)[], mainText: string, subText?: string | JSX.Element, onClick?: () => void}) {
  return (
    <button className={[ListItem.name, css.root, className].join(' ')} style={style} ref={ref} onClick={onClick}>
      <div className={css.row}>
        {tags.map(tagText => tagText === undefined ? null : <div className={css.tag}>{tagText}</div>)}
        {warningTags.map(tagText => tagText === undefined ? null : <div className={[css.tag, css.warning].join(' ')}>{tagText}</div>)}
        <div className={css.mainText}>{mainText}</div>
      </div>
      {subText === undefined ? <></> : <div className={css.subText}>{subText}</div>}
    </button>
  )
}