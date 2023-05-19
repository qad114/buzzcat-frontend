import { useState } from 'react';
import css from './Tabs.module.css';

export default function Tabs({ className, views }) {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div className={[css.Tabs, className].join(' ')}>
      <div className={[css.tabContainer, 'Tabs__tabContainer'].join(' ')}>
        {views.map(([tabName, tabView], index) =>
          <button key={index} className={tabIndex === index ? css.active : css.inactive} onClick={() => setTabIndex(index)}>
            {tabName}
          </button>
        )}
      </div>
      <div className={[css.viewContainer, 'Tabs__viewContainer'].join(' ')}>
        {views[tabIndex][1]}
      </div>
    </div>
  )
}

/*
import { useContext, useState } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import css from './Tabs.module.css';

const views = {
  "Overview": <div></div>
}

export default function Tabs({ className, views }) {
  const { theme } = useContext(ThemeContext);
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div className={[css.Tabs, className].join()}>
      <div className={css.tabs}>
        {views.map(([tabIndex, tabView], index) => 
          <button key={index} className={[theme, tabIndex === index ? css.active : css.inactive].join(' ')} onClick={() => setTabIndex(index)}>
            {views[index][0]}
          </button>
        )}
      </div>
      <div className={css.viewContainer}>
        {views[tabIndex][1]}
      </div>
    </div>
  )
}
*/