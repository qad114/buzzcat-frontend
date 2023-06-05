export type Course = {
  subject: string,
  number: string,
  title: string,
  description: string,
  credits: CourseCredits,
  sections: Section[],
  prerequisites: PrereqNode | null
};

export type CourseCredits = {
  low: number,
  operator: string,
  high: number
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
  time_start: string,
  time_end: string
  location: MeetingLocation
};

export type MeetingLocation = {
  building: string,
  room: string
};