import css from './SearchResultCard.module.css';

import { useContext, useState } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';

export default function SearchResultCard({ className, result, onClick }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={[css.SearchResultCard, className].join(' ')} onClick={onClick}>
      <div className={css.row}>
        <div className={[css.tag, css.subjectAndNumber, theme, 'bg-2'].join(' ')}>{`${result.subject} ${result.number}`}</div>
        <div className={[css.tag, css.credits, theme, 'bg-2'].join(' ')}>{result.credits_max ? `${result.credits_min}-${result.credits_max} credits` : `${result.credits_min} ${result.credits_min === 1 ? 'credit' : 'credits'}`}</div>
        <div className={[css.item, css.title].join(' ')}>{result.title}</div>
      </div>
      <div className={css.description}>{result.description}</div>
    </div>
  )
}