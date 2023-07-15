import { getCourse } from '../../../../api/courses';
import { PrereqCourseNode, PrereqNode } from '../../../../types';
import css from '#src/styles/CoursePrerequisites.module.scss';
import ListItem from '../../../reusable/ListItem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CoursePrerequisites({ className = '', prereqTree }: {className?: string, prereqTree: PrereqNode | null}) {
  if (prereqTree === null) return null;

  async function getPrereqs(subject: string, number: string, callback: (root: PrereqNode | {}) => void) {
    const course = await getCourse({
      subject: subject,
      number: number
    });
    const prereqs = course.prerequisites || {};
    callback(prereqs);
  }

  function getTarget(tree: PrereqNode, key: string): PrereqNode {
    let newTree = tree;
    for (let i = 0; i < key.length; i++) {
      const index = parseInt(key.charAt(i));
      if (newTree.children) newTree = newTree.children[index];
    }
    return newTree;
  }

  function onCourseNodeClick(subject: string, number: string, key: string) {
    console.log(`clicked ${subject} ${number}`);
    const copyTree = structuredClone(prereqTree);
    const target: PrereqCourseNode = getTarget(copyTree as PrereqNode, key) as PrereqCourseNode;
    getPrereqs(target.subject, target.number, (res) => {
      target.children = [res as PrereqNode];
      //setPrereqTree(copyTree);
    });
  }

  function prereqsToHTML(root: PrereqNode, key: string = '') {
    console.log(root);
    if (root.type === 'operator') {
      const text = root.value === 'or' ? 'One or more of:' : 'All of:';
      return (
        <>
          <ListItem className={css.ListItem} mainText={text} />
          <div className={css.indentedBlock}>
            {root.children.map((node, index) => prereqsToHTML(node, key + index))}
          </div>
        </>
      );
    } else if (root.type === 'course') {
      return <ListItem className={css.ListItem} tags={[root.subject + ' ' + root.number]} mainText={''} />; // TODO: Populate these with class names dynamically
    } else if (root.type === 'test_score') {
      return <ListItem className={css.ListItem} tags={['Test Score']} mainText={root.test + ' ' + root.score} />;
    }
  }

  return (
    <div className={[CoursePrerequisites.name, css.root, className].join(' ')}>
      {prereqsToHTML(prereqTree)}
    </div>
  )
}