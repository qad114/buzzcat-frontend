import css from './ListItem.module.css';

export default function ListItem({ className, tags, mainText, subText, onClick }) {
  return (
    <div className={[css.ListItem, className].join(' ')} onClick={onClick}>
      <div className={css.row}>
        {tags.map((tagText) => <div className={css.tag}>{tagText}</div>)}
        <div className={css.mainText}>{mainText}</div>
      </div>
      <div className={css.subText}>{subText}</div>
    </div>
  )
}