import type { BadgeDef } from "../types";

/**
 * Badges reward the behaviours that actually produce marks: finishing lessons,
 * solving problems unaided, coming back tomorrow. None of them can be bought
 * with time alone.
 */
export const BADGES: BadgeDef[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "Footprints",
    test: (s) => s.lessonsDone >= 1,
  },
  {
    id: "hello-world",
    name: "Hello, World",
    description: "Solve your first coding lab",
    icon: "Terminal",
    test: (s) => s.exercisesDone >= 1,
  },
  {
    id: "getting-serious",
    name: "Getting Serious",
    description: "Complete 10 lessons",
    icon: "BookOpen",
    test: (s) => s.lessonsDone >= 10,
  },
  {
    id: "problem-solver",
    name: "Problem Solver",
    description: "Solve 5 coding labs",
    icon: "Wrench",
    test: (s) => s.exercisesDone >= 5,
  },
  {
    id: "code-machine",
    name: "Code Machine",
    description: "Solve 15 coding labs",
    icon: "Cpu",
    test: (s) => s.exercisesDone >= 15,
  },
  {
    id: "all-labs",
    name: "Lab Complete",
    description: "Solve every coding lab in the course",
    icon: "FlaskConical",
    test: (s) => s.exercisesDone >= 25,
  },
  {
    id: "quiz-starter",
    name: "Quiz Taker",
    description: "Pass your first module quiz",
    icon: "ListChecks",
    test: (s) => s.quizzesPassed >= 1,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score full marks on a module quiz",
    icon: "Target",
    test: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: "triple-perfect",
    name: "Flawless Three",
    description: "Score full marks on three module quizzes",
    icon: "Crosshair",
    test: (s) => s.perfectQuizzes >= 3,
  },
  {
    id: "streak-3",
    name: "Warming Up",
    description: "Study three days in a row",
    icon: "Flame",
    test: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    name: "Week Strong",
    description: "Study seven days in a row",
    icon: "CalendarCheck",
    test: (s) => s.streak >= 7,
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "Study thirty days in a row",
    icon: "Trophy",
    test: (s) => s.streak >= 30,
  },
  {
    id: "tracer",
    name: "Hand Tracer",
    description: "Step through 10 programs in the tracer",
    icon: "Footprints",
    test: (s) => s.tracesDone >= 10,
  },
  {
    id: "exam-ready",
    name: "Exam Ready",
    description: "Complete a full timed exam",
    icon: "FileCheck",
    test: (s) => s.examsPassed >= 1,
  },
  {
    id: "half-way",
    name: "Half Way",
    description: "Master 7 of the 13 competency levels",
    icon: "Milestone",
    test: (s) => s.modulesMastered >= 7,
  },
  {
    id: "competency-master",
    name: "Competency 9 Master",
    description: "Master all 13 competency levels",
    icon: "Award",
    test: (s) => s.modulesMastered >= 13,
  },
];
