// Program registry. Adding a major = add an entry here + its notes under content/.
// Subjects are shared across programs (e.g. Mathematics is taken by SE, MMIT, ACC, ECON…),
// so a new program usually only needs its own aptitude notes.

export type SubjectId =
  | "admission"
  | "program-se"
  | "mathematics"
  | "english-placement"
  | "se-aptitude"
  | "se-essay";

export interface PracticeTrack {
  id: string;
  label: string;
  subject: SubjectId;
  /** Exam part this track prepares for, shown in the UI. */
  examPart: string;
  topics: string[];
}

export interface Program {
  id: string;
  code: string;
  name: string;
  faculty: string;
  status: "active" | "coming-soon";
  /** Exams on the Regular Track, from the 2027 Annex 3. */
  regularTrackExams: string[];
  specialTrack: string;
  /** Subjects the RAG retriever may search for this program. */
  subjects: SubjectId[];
  practice: PracticeTrack[];
  hasEssay: boolean;
}

const MATH_TOPICS = [
  "Logical statements and truth values",
  "Functions: one-to-one and onto",
  "Domain and range of functions",
  "Graphs of functions",
  "Polynomial functions",
  "Exponential and logarithmic functions",
  "Trigonometric functions",
  "Inverse trigonometric functions",
  "2×2 matrices: operations and determinant",
  "Solving 2×2 linear systems",
];

const mathTrack: PracticeTrack = {
  id: "mathematics",
  label: "Mathematics",
  subject: "mathematics",
  examPart: "CMU Mathematics exam",
  topics: MATH_TOPICS,
};

const eptTrack: PracticeTrack = {
  id: "english",
  label: "English (EPT)",
  subject: "english-placement",
  examPart: "CMU English Placement Test — structure section",
  topics: [
    "Complete the sentences",
    "Error detection",
    "Cloze passages",
    "Reading comprehension",
  ],
};

function comingSoon(
  code: string,
  name: string,
  faculty: string,
  regularTrackExams: string[],
  specialTrack: string,
): Program {
  return {
    id: code.toLowerCase(),
    code,
    name,
    faculty,
    status: "coming-soon",
    regularTrackExams,
    specialTrack,
    subjects: ["admission", "english-placement"],
    practice: [],
    hasEssay: false,
  };
}

export const PROGRAMS: Program[] = [
  {
    id: "se",
    code: "SE",
    name: "Software Engineering",
    faculty: "College of Arts, Media and Technology (CAMT)",
    status: "active",
    regularTrackExams: [
      "Mathematics",
      "Software Engineering Aptitude Test (30 MCQ + 1 essay)",
      "CMU English Placement Test (if no qualifying English score)",
    ],
    specialTrack: "New SAT (Math + EBRW) total ≥ 800",
    subjects: [
      "admission",
      "program-se",
      "mathematics",
      "english-placement",
      "se-aptitude",
      "se-essay",
    ],
    practice: [
      mathTrack,
      {
        id: "computer-basics",
        label: "Computer basics",
        subject: "se-aptitude",
        examPart: "SE Aptitude Part 1 — computer basics, software and hardware (20 Qs)",
        topics: [
          "Computer hardware: CPU, memory and storage",
          "Software types and operating systems",
          "Compilers and interpreters",
          "Data representation and number systems",
          "Logic gates",
          "Networks and the internet",
          "Security basics",
          "Programming concepts and algorithms",
          "Data structures, searching and sorting",
          "Software development life cycle",
          "Databases and SQL",
        ],
      },
      {
        id: "logical-thinking",
        label: "Logical thinking",
        subject: "se-aptitude",
        examPart: "SE Aptitude Part 1 — logical thinking (10 Qs)",
        topics: [
          "Number sequences",
          "Letter patterns and coding",
          "Syllogisms and deduction",
          "If-then reasoning",
          "Ordering and arrangement puzzles",
          "Truth-teller and liar puzzles",
          "Counting and combinatorics",
          "Tracing algorithms",
        ],
      },
      eptTrack,
    ],
    hasEssay: true,
  },
  comingSoon("MMIT", "Modern Management and Information Technology", "College of Arts, Media and Technology (CAMT)", ["Mathematics", "MMIT Aptitude Test"], "New SAT (Math + EBRW) total ≥ 460"),
  comingSoon("ISCE", "Information Systems and Cybersecurity Engineering", "Faculty of Engineering", ["Mathematics", "Basic Knowledge of Engineering"], "SAT Math ≥ 600, ACT Math ≥ 24, AP Calculus ≥ 4, and others"),
  comingSoon("DIN", "Digital Innovation", "International College of Digital Innovation", ["Statistics"], "SAT Math ≥ 480, A Level Math ≥ C, AP ≥ 3"),
  comingSoon("ECON", "Economics", "Faculty of Economics", ["Mathematics", "Economics"], "SAT Math ≥ 500 or ACT Math ≥ 18"),
  comingSoon("ACC", "Accountancy", "Faculty of Business Administration", ["Mathematics (≥ 40% required)"], "SAT or GSAT total ≥ 1000"),
];

export function getProgram(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getTrack(program: Program, trackId: string): PracticeTrack | undefined {
  return program.practice.find((t) => t.id === trackId);
}
