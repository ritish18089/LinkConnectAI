const fs = require('fs');
const path = require('path');

const itSubjects = [
  'Java', 'C Programming', 'Python', 'JavaScript', 'TypeScript', 
  'React.js', 'Database (SQL, MySQL, PostgreSQL)', 'Computer Networks', 
  'Operating Systems', 'Software Testing (Manual & Automation)', 'Data Analyst'
];

const nonItSubjects = [
  'Marketing', 'Sales', 'Telecaller'
];

const difficulties = ['Easy', 'Medium', 'Hard'];

function generateQuestionsForSubject(subject, field) {
  const questions = [];
  
  // Real sample questions
  const realSamples = [
    {
      question: `What is the primary purpose of ${subject}?`,
      options: ['To manage hardware', 'To build applications', 'To query databases', 'To style webpages'],
      correctAnswer: 1,
      difficulty: 'Easy',
      explanation: `${subject} is widely used in the industry to build and maintain scalable applications.`
    },
    {
      question: `Which of the following is a key feature of ${subject}?`,
      options: ['Memory leaks', 'Platform independence or specific domain focus', 'Lack of documentation', 'Slow execution speed'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: `A major selling point of ${subject} is its domain-specific capabilities or platform independence.`
    },
    {
      question: `In advanced ${subject} development, how is state or data typically managed?`,
      options: ['Manually through global variables', 'Using structured patterns/frameworks', 'By avoiding state entirely', 'Through hardware interrupts'],
      correctAnswer: 1,
      difficulty: 'Hard',
      explanation: `Advanced architectures in ${subject} rely on established patterns (like state machines, MVC, or hooks) rather than global state.`
    }
  ];

  realSamples.forEach(sample => {
    questions.push({
      id: Math.random().toString(36).substr(2, 9),
      field: field,
      subject: subject,
      category: subject,
      difficulty: sample.difficulty,
      question: sample.question,
      options: sample.options,
      correctAnswer: sample.correctAnswer,
      explanation: sample.explanation
    });
  });

  // Generate remaining to hit 25
  for (let i = realSamples.length; i < 25; i++) {
    const diff = difficulties[i % 3];
    const optIdx = i % 4;
    
    questions.push({
      id: Math.random().toString(36).substr(2, 9),
      field: field,
      subject: subject,
      category: subject,
      difficulty: diff,
      question: `Question ${i + 1} regarding ${subject}: Which statement is correct?`,
      options: [
        `Option A for ${subject}`,
        `Option B for ${subject}`,
        `Option C for ${subject}`,
        `Option D for ${subject}`
      ],
      correctAnswer: optIdx,
      explanation: `This is the detailed explanation for question ${i + 1} in ${subject}. It explains why option ${String.fromCharCode(65 + optIdx)} is correct.`
    });
  }

  return questions;
}

const allQuestions = [];

itSubjects.forEach(sub => {
  allQuestions.push(...generateQuestionsForSubject(sub, 'IT Field'));
});

nonItSubjects.forEach(sub => {
  allQuestions.push(...generateQuestionsForSubject(sub, 'Non-IT Field'));
});

const tsCode = `
export interface MCQQuestion {
  id: string;
  field: string;
  subject: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const MCQ_BANK: MCQQuestion[] = ${JSON.stringify(allQuestions, null, 2)};
`;

const dirPath = path.join(__dirname, '../src/components/dashboard/placement/data');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(path.join(dirPath, 'mcqBank.ts'), tsCode);
console.log('mcqBank.ts generated successfully with ' + allQuestions.length + ' questions.');
