import { HistoricCourse, PrereqNode } from "./types";

export function prereqsSatisfied(prereqTree: PrereqNode, courseList: HistoricCourse[]): boolean {
  if (prereqTree.type === 'course') {
    for (const course of courseList) {
      if (course.subject === prereqTree.subject && course.number === prereqTree.number) {
        return true;
      }
    }
    return false;
  } else if (prereqTree.type === 'operator') {
    if (prereqTree.value === 'or') {
      for (const child of prereqTree.children) {
        if (prereqsSatisfied(child, courseList)) {
          return true;
        }
      }
      return false;
    } else {
      for (const child of prereqTree.children) {
        if (!prereqsSatisfied(child, courseList)) {
          return false;
        }
      }
      return true;
    }
  } else {
    return false;
  }
}