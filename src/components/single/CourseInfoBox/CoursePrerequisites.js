import css from './CoursePrerequisites.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CoursePrerequisites({ className, prereqTree }) {
  function getPrereqs(subject, number, callback) {
    fetch(`${BACKEND_URL}/get_course?term=202308&subject=${subject}&number=${number}`)
      .then((res) => res.json())
      .then((res) => callback(res.result === null ? {} : res.result.prerequisites));
  }

  function getTarget(tree, key) {
    let newTree = tree;
    for (let i = 0; i < key.length; i++) {
      const index = parseInt(key.charAt(i));
      newTree = newTree.children[index];
    }
    return newTree;
  }

  function onCourseNodeClick(subject, number, key) {
    console.log(`clicked ${subject} ${number}`);
    const copyTree = structuredClone(prereqTree);
    const target = getTarget(copyTree, key);
    getPrereqs(target.subject, target.number, (res) => {
      target.children = [res];
      //setPrereqTree(copyTree);
    });
  }

  function prereqsToHTML(root, key = '') {
    console.log(root);
    if (root.type === 'operator') {
      const text = root.value === 'or' ? 'One or more of:' : 'All of:';
      return (
        <li><span className={[css.prereqNode, css.operator].join(' ')}>{text}</span>
          <ul className={css.prereqListNested}>
            {root.children.map((node, index) => prereqsToHTML(node, key + index))}
          </ul>
        </li>
      )
    } else if (root.type === 'course') {
      return (
        <li><button className={[css.prereqNode, css.course].join(' ')} onClick={() => onCourseNodeClick(root.subject, root.number, key)}>{root.subject + ' ' + root.number}</button>
          <ul className={css.prereqListNested}>
            {root.children === undefined ? null : root.children.map((node, index) => prereqsToHTML(node, key + index))}
          </ul>
        </li>
      )
    } else if (root.type === 'test_score') {
      return (
        <li><span className={css.prereqNode}>{root.test + ' ' + root.score}</span></li>
      )
    }
  }

  return (
    <div className={[CoursePrerequisites.name, css.root, className].join(' ')}>
      <ul>
        {prereqsToHTML(prereqTree)}
      </ul>
    </div>
  )
}