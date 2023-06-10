import css from './ListItem.module.scss';

export default function ListItem({ className = '', tags = [], warningTags = [], mainText, subText, onClick }:
    {className?: string, tags?: (string | undefined)[], warningTags?: (string | undefined)[], mainText: string, subText?: string | JSX.Element, onClick?: () => void}) {
  return (
    <div className={[ListItem.name, css.root, className].join(' ')} onClick={onClick}>
      <div className={css.row}>
        {tags.map(tagText => tagText === undefined ? null : <div className={css.tag}>{tagText}</div>)}
        {warningTags.map(tagText => tagText === undefined ? null : <div className={[css.tag, css.warning].join(' ')}>{tagText}</div>)}
        <div className={css.mainText}>{mainText}</div>
      </div>
      {subText === undefined ? <></> : <div className={css.subText}>{subText}</div>}
    </div>
  )
}