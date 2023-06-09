export type Course = {
  subject: string,
  number: string,
  title: string,
  description: string,
  credits: CourseCredits,
  sections: Section[] | undefined,
  prerequisites: PrereqNode | null
};

export type CourseCredits = {
  low: number,
  operator: string | null,
  high: number | null
};

export type PrereqOperatorNode = {
  type: 'operator',
  value: 'or' | 'and',
  children: PrereqNode[]
};

export type PrereqCourseNode = {
  type: 'course',
  subject: string,
  number: string,
  children: PrereqNode[]
};

export type PrereqTestScoreNode = {
  type: 'test_score',
  test: string,
  score: string,
  children: PrereqNode[]
};

export type PrereqNode = PrereqOperatorNode | PrereqCourseNode | PrereqTestScoreNode;

export type Section = {
  id: string,
  subject: string,
  number: string,
  crn: number,
  campus: string,
  schedule_type: string,
  faculty: Professor[],
  meetings: Meeting[]
};

export type Professor = {
  name: string,
  email: string
};

export type Meeting = {
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  time_start: string | null,
  time_end: string | null,
  location: MeetingLocation
};

export type MeetingLocation = {
  building: string | null,
  room: string | null
};

export type User = {
  uid: string,
  displayName: string,
  courseHistory: HistoricCourse[]
}

export type HistoricCourse = {
  subject: string,
  number: string,
  level: string,
  grade: string
};