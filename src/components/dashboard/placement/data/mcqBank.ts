
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

export const MCQ_BANK: MCQQuestion[] = [
  {
    "id": "java001",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which feature of Java allows code to run on different operating systems?",
    "options": [
      "Manual Memory Management",
      "Platform Independence",
      "Function Overloading",
      "Pointers"
    ],
    "correctAnswer": 1,
    "explanation": "Java is platform-independent because Java code runs on the JVM, allowing the same bytecode to execute on different operating systems."
  },
  {
    "id": "java002",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which method is the entry point of every Java application?",
    "options": [
      "run()",
      "execute()",
      "main()",
      "start()"
    ],
    "correctAnswer": 2,
    "explanation": "The JVM starts execution from the main() method."
  },
  {
    "id": "java003",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to create an object in Java?",
    "options": [
      "new",
      "create",
      "make",
      "object"
    ],
    "correctAnswer": 0,
    "explanation": "The new keyword allocates memory and creates an object."
  },
  {
    "id": "java004",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which of the following is NOT a primitive data type in Java?",
    "options": [
      "float",
      "char",
      "boolean",
      "String"
    ],
    "correctAnswer": 3,
    "explanation": "String is a class, not a primitive data type."
  },
  {
    "id": "java005",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to inherit a class in Java?",
    "options": [
      "implements",
      "inherits",
      "extends",
      "super"
    ],
    "correctAnswer": 2,
    "explanation": "The extends keyword is used for class inheritance."
  },
  {
    "id": "java006",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a constant variable?",
    "options": [
      "const",
      "final",
      "static",
      "fixed"
    ],
    "correctAnswer": 1,
    "explanation": "The final keyword makes a variable constant."
  },
  {
    "id": "java007",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which operator is used to compare two values for equality?",
    "options": [
      "=",
      "===",
      "!=",
      "=="
    ],
    "correctAnswer": 3,
    "explanation": "The == operator compares primitive values for equality."
  },
  {
    "id": "java008",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which loop is guaranteed to execute at least once?",
    "options": [
      "do-while",
      "for",
      "while",
      "foreach"
    ],
    "correctAnswer": 0,
    "explanation": "The do-while loop executes its body before checking the condition."
  },
  {
    "id": "java009",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which package is automatically imported into every Java program?",
    "options": [
      "java.io",
      "java.sql",
      "java.lang",
      "java.util"
    ],
    "correctAnswer": 2,
    "explanation": "The java.lang package is imported automatically."
  },
  {
    "id": "java010",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword refers to the current object?",
    "options": [
      "super",
      "this",
      "current",
      "self"
    ],
    "correctAnswer": 1,
    "explanation": "The this keyword refers to the current object."
  },
  {
    "id": "java011",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which collection does NOT allow duplicate elements?",
    "options": [
      "Set",
      "ArrayList",
      "LinkedList",
      "Vector"
    ],
    "correctAnswer": 0,
    "explanation": "A Set stores only unique elements."
  },
  {
    "id": "java012",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which exception occurs when dividing a number by zero using integers?",
    "options": [
      "IOException",
      "NullPointerException",
      "NumberFormatException",
      "ArithmeticException"
    ],
    "correctAnswer": 3,
    "explanation": "Integer division by zero throws ArithmeticException."
  },
  {
    "id": "java013",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to handle exceptions?",
    "options": [
      "throw",
      "catch",
      "handle",
      "error"
    ],
    "correctAnswer": 1,
    "explanation": "The catch block handles exceptions thrown by the try block."
  },
  {
    "id": "java014",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which class is the parent of all Java classes?",
    "options": [
      "Parent",
      "Root",
      "Object",
      "Base"
    ],
    "correctAnswer": 2,
    "explanation": "Every Java class directly or indirectly extends Object."
  },
  {
    "id": "java015",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which access modifier allows access only within the same class?",
    "options": [
      "private",
      "public",
      "protected",
      "default"
    ],
    "correctAnswer": 0,
    "explanation": "Private members are accessible only within their own class."
  },
  {
    "id": "java016",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword prevents a method from being overridden?",
    "options": [
      "sealed",
      "static",
      "const",
      "final"
    ],
    "correctAnswer": 3,
    "explanation": "A final method cannot be overridden."
  },
  {
    "id": "java017",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which statement is used to exit a loop immediately?",
    "options": [
      "continue",
      "break",
      "exit",
      "stop"
    ],
    "correctAnswer": 1,
    "explanation": "The break statement terminates the loop immediately."
  },
  {
    "id": "java018",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to create a subclass constructor call?",
    "options": [
      "base",
      "this",
      "super",
      "parent"
    ],
    "correctAnswer": 2,
    "explanation": "super() calls the constructor of the parent class."
  },
  {
    "id": "java019",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which interface is implemented to create a thread?",
    "options": [
      "Serializable",
      "Comparable",
      "Cloneable",
      "Runnable"
    ],
    "correctAnswer": 3,
    "explanation": "Runnable is commonly implemented to create a thread."
  },
  {
    "id": "java020",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to explicitly throw an exception?",
    "options": [
      "throw",
      "throws",
      "catch",
      "try"
    ],
    "correctAnswer": 0,
    "explanation": "throw is used to explicitly throw an exception object."
  },
  {
    "id": "java021",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which collection stores key-value pairs?",
    "options": [
      "ArrayList",
      "HashSet",
      "HashMap",
      "Queue"
    ],
    "correctAnswer": 2,
    "explanation": "HashMap stores data as key-value pairs."
  },
  {
    "id": "java022",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to inherit an interface?",
    "options": [
      "extends",
      "implements",
      "inherits",
      "uses"
    ],
    "correctAnswer": 1,
    "explanation": "A class implements an interface using the implements keyword."
  },
  {
    "id": "java023",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a class that cannot be instantiated?",
    "options": [
      "virtual",
      "static",
      "sealed",
      "abstract"
    ],
    "correctAnswer": 3,
    "explanation": "Abstract classes cannot be instantiated directly."
  },
  {
    "id": "java024",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which method is called automatically before an object is garbage collected?",
    "options": [
      "finalize()",
      "dispose()",
      "destroy()",
      "close()"
    ],
    "correctAnswer": 0,
    "explanation": "Historically finalize() was called before garbage collection, although it is deprecated in modern Java."
  },
  {
    "id": "java025",
    "field": "IT Field",
    "subject": "Java",
    "category": "Java",
    "difficulty": "Easy",
    "question": "Which Java feature allows multiple methods to have the same name with different parameters?",
    "options": [
      "Method Overriding",
      "Method Overloading",
      "Abstraction",
      "Inheritance"
    ],
    "correctAnswer": 1,
    "explanation": "Method overloading allows methods with the same name but different parameter lists."
  },
  {
    "id": "c001",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Who developed the C programming language?",
    "options": [
      "James Gosling",
      "Dennis Ritchie",
      "Bjarne Stroustrup",
      "Guido van Rossum"
    ],
    "correctAnswer": 1,
    "explanation": "Dennis Ritchie developed the C programming language at Bell Labs."
  },
  {
    "id": "c002",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function is the entry point of every C program?",
    "options": [
      "start()",
      "begin()",
      "main()",
      "init()"
    ],
    "correctAnswer": 2,
    "explanation": "Execution of every C program begins from the main() function."
  },
  {
    "id": "c003",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which header file is required for using printf()?",
    "options": [
      "<stdio.h>",
      "<string.h>",
      "<math.h>",
      "<stdlib.h>"
    ],
    "correctAnswer": 0,
    "explanation": "The printf() function is declared in the stdio.h header file."
  },
  {
    "id": "c004",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which of the following is a valid C identifier?",
    "options": [
      "2value",
      "#count",
      "float",
      "total_marks"
    ],
    "correctAnswer": 3,
    "explanation": "Identifiers can contain letters, digits, and underscores but cannot start with a digit or be a keyword."
  },
  {
    "id": "c005",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which data type is used to store decimal numbers in C?",
    "options": [
      "char",
      "int",
      "float",
      "double"
    ],
    "correctAnswer": 2,
    "explanation": "The float data type stores decimal values."
  },
  {
    "id": "c006",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which operator is used to find the remainder of a division?",
    "options": [
      "/",
      "%",
      "*",
      "//"
    ],
    "correctAnswer": 1,
    "explanation": "The modulus (%) operator returns the remainder after division."
  },
  {
    "id": "c007",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which loop always executes at least once?",
    "options": [
      "for",
      "while",
      "foreach",
      "do-while"
    ],
    "correctAnswer": 3,
    "explanation": "The do-while loop executes the loop body before checking the condition."
  },
  {
    "id": "c008",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to exit a loop immediately?",
    "options": [
      "break",
      "continue",
      "exit",
      "return"
    ],
    "correctAnswer": 0,
    "explanation": "The break statement terminates the loop immediately."
  },
  {
    "id": "c009",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function is used to read formatted input from the keyboard?",
    "options": [
      "gets()",
      "fgets()",
      "scanf()",
      "input()"
    ],
    "correctAnswer": 2,
    "explanation": "scanf() is used to read formatted input from standard input."
  },
  {
    "id": "c010",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which symbol is used to declare a pointer?",
    "options": [
      "&",
      "*",
      "%",
      "#"
    ],
    "correctAnswer": 1,
    "explanation": "The asterisk (*) is used while declaring a pointer."
  },
  {
    "id": "c011",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a constant value?",
    "options": [
      "const",
      "constant",
      "final",
      "fixed"
    ],
    "correctAnswer": 0,
    "explanation": "The const keyword makes a variable read-only."
  },
  {
    "id": "c012",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function is used to compare two strings?",
    "options": [
      "strcpy()",
      "strlen()",
      "strcat()",
      "strcmp()"
    ],
    "correctAnswer": 3,
    "explanation": "strcmp() compares two strings character by character."
  },
  {
    "id": "c013",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to return a value from a function?",
    "options": [
      "break",
      "return",
      "continue",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The return statement sends a value back to the calling function."
  },
  {
    "id": "c014",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function is used to calculate the length of a string?",
    "options": [
      "strcpy()",
      "strcmp()",
      "strlen()",
      "strcat()"
    ],
    "correctAnswer": 2,
    "explanation": "strlen() returns the number of characters in a string excluding the null character."
  },
  {
    "id": "c015",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a user-defined data type in C?",
    "options": [
      "typedef",
      "define",
      "struct",
      "union"
    ],
    "correctAnswer": 0,
    "explanation": "typedef is used to create an alias for an existing data type."
  },
  {
    "id": "c016",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function is used to dynamically allocate memory in C?",
    "options": [
      "calloc()",
      "realloc()",
      "free()",
      "malloc()"
    ],
    "correctAnswer": 3,
    "explanation": "malloc() allocates a block of memory dynamically."
  },
  {
    "id": "c017",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a structure in C?",
    "options": [
      "class",
      "struct",
      "record",
      "object"
    ],
    "correctAnswer": 1,
    "explanation": "The struct keyword is used to define a structure."
  },
  {
    "id": "c018",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function releases dynamically allocated memory?",
    "options": [
      "malloc()",
      "calloc()",
      "free()",
      "delete()"
    ],
    "correctAnswer": 2,
    "explanation": "free() deallocates memory that was allocated using malloc(), calloc(), or realloc()."
  },
  {
    "id": "c019",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which header file is required for malloc() and free()?",
    "options": [
      "<stdio.h>",
      "<string.h>",
      "<math.h>",
      "<stdlib.h>"
    ],
    "correctAnswer": 3,
    "explanation": "Dynamic memory allocation functions are declared in stdlib.h."
  },
  {
    "id": "c020",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which operator is used to access members of a structure variable?",
    "options": [
      ".",
      "->",
      "::",
      ":"
    ],
    "correctAnswer": 0,
    "explanation": "The dot (.) operator accesses members of a structure variable."
  },
  {
    "id": "c021",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function copies one string to another?",
    "options": [
      "strcmp()",
      "strcat()",
      "strcpy()",
      "strlen()"
    ],
    "correctAnswer": 2,
    "explanation": "strcpy() copies the source string to the destination string."
  },
  {
    "id": "c022",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which operator is used to access a structure member through a pointer?",
    "options": [
      ".",
      "->",
      "*",
      "&"
    ],
    "correctAnswer": 1,
    "explanation": "The arrow operator (->) accesses members using a structure pointer."
  },
  {
    "id": "c023",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which function concatenates two strings?",
    "options": [
      "strcmp()",
      "strlen()",
      "strcpy()",
      "strcat()"
    ],
    "correctAnswer": 3,
    "explanation": "strcat() appends one string to another."
  },
  {
    "id": "c024",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which symbol is used for single-line comments in C (C99 and later)?",
    "options": [
      "//",
      "/*",
      "#",
      "--"
    ],
    "correctAnswer": 0,
    "explanation": "The // symbol is used for single-line comments in C99 and later."
  },
  {
    "id": "c025",
    "field": "IT Field",
    "subject": "C Programming",
    "category": "C Programming",
    "difficulty": "Easy",
    "question": "Which keyword is used to skip the current iteration of a loop?",
    "options": [
      "break",
      "continue",
      "return",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The continue statement skips the remaining statements in the current iteration and proceeds to the next iteration."
  },
  {
    "id": "python001",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Who developed the Python programming language?",
    "options": [
      "James Gosling",
      "Guido van Rossum",
      "Dennis Ritchie",
      "Bjarne Stroustrup"
    ],
    "correctAnswer": 1,
    "explanation": "Python was created by Guido van Rossum and first released in 1991."
  },
  {
    "id": "python002",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which symbol is used to write comments in Python?",
    "options": [
      "//",
      "/*",
      "#",
      "--"
    ],
    "correctAnswer": 2,
    "explanation": "The # symbol is used to write single-line comments in Python."
  },
  {
    "id": "python003",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which function is used to display output in Python?",
    "options": [
      "print()",
      "display()",
      "echo()",
      "show()"
    ],
    "correctAnswer": 0,
    "explanation": "The print() function displays output on the console."
  },
  {
    "id": "python004",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which of the following is a mutable data type in Python?",
    "options": [
      "Tuple",
      "String",
      "Integer",
      "List"
    ],
    "correctAnswer": 3,
    "explanation": "Lists are mutable, meaning their elements can be modified."
  },
  {
    "id": "python005",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a function in Python?",
    "options": [
      "func",
      "define",
      "def",
      "function"
    ],
    "correctAnswer": 2,
    "explanation": "The def keyword is used to define a function."
  },
  {
    "id": "python006",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which function returns the length of a list or string?",
    "options": [
      "count()",
      "len()",
      "size()",
      "length()"
    ],
    "correctAnswer": 1,
    "explanation": "The len() function returns the number of items in an object."
  },
  {
    "id": "python007",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to handle exceptions?",
    "options": [
      "catch",
      "throws",
      "error",
      "try"
    ],
    "correctAnswer": 3,
    "explanation": "Exceptions are handled using try and except blocks."
  },
  {
    "id": "python008",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which data type stores True or False values?",
    "options": [
      "bool",
      "int",
      "float",
      "str"
    ],
    "correctAnswer": 0,
    "explanation": "The bool data type stores Boolean values True and False."
  },
  {
    "id": "python009",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which operator is used for exponentiation in Python?",
    "options": [
      "^",
      "*",
      "**",
      "//"
    ],
    "correctAnswer": 2,
    "explanation": "The ** operator is used for exponentiation."
  },
  {
    "id": "python010",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to create a class in Python?",
    "options": [
      "struct",
      "class",
      "object",
      "define"
    ],
    "correctAnswer": 1,
    "explanation": "The class keyword is used to define a class."
  },
  {
    "id": "python011",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which data structure stores unique values only?",
    "options": [
      "Set",
      "List",
      "Tuple",
      "Dictionary"
    ],
    "correctAnswer": 0,
    "explanation": "A set stores only unique elements."
  },
  {
    "id": "python012",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to import a module?",
    "options": [
      "include",
      "using",
      "require",
      "import"
    ],
    "correctAnswer": 3,
    "explanation": "The import keyword is used to include modules in Python."
  },
  {
    "id": "python013",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to create a loop over a sequence?",
    "options": [
      "while",
      "for",
      "loop",
      "iterate"
    ],
    "correctAnswer": 1,
    "explanation": "The for loop is commonly used to iterate over sequences in Python."
  },
  {
    "id": "python014",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which method is used to add an element to the end of a list?",
    "options": [
      "insert()",
      "extend()",
      "append()",
      "add()"
    ],
    "correctAnswer": 2,
    "explanation": "The append() method adds a single element to the end of a list."
  },
  {
    "id": "python015",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which function is used to determine the data type of a variable?",
    "options": [
      "type()",
      "typeof()",
      "datatype()",
      "class()"
    ],
    "correctAnswer": 0,
    "explanation": "The type() function returns the type of an object."
  },
  {
    "id": "python016",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to create an anonymous function?",
    "options": [
      "func",
      "anonymous",
      "inline",
      "lambda"
    ],
    "correctAnswer": 3,
    "explanation": "The lambda keyword is used to create anonymous functions."
  },
  {
    "id": "python017",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to exit a loop immediately?",
    "options": [
      "continue",
      "break",
      "return",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The break statement immediately terminates the loop."
  },
  {
    "id": "python018",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which data structure stores key-value pairs?",
    "options": [
      "List",
      "Tuple",
      "Dictionary",
      "Set"
    ],
    "correctAnswer": 2,
    "explanation": "A dictionary stores data as key-value pairs."
  },
  {
    "id": "python019",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which method removes the last element from a list by default?",
    "options": [
      "remove()",
      "delete()",
      "clear()",
      "pop()"
    ],
    "correctAnswer": 3,
    "explanation": "The pop() method removes and returns the last item if no index is specified."
  },
  {
    "id": "python020",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to define inheritance in Python?",
    "options": [
      "class",
      "extends",
      "implements",
      "No keyword is required"
    ],
    "correctAnswer": 0,
    "explanation": "Inheritance is achieved by specifying the parent class in parentheses while defining the child class."
  },
  {
    "id": "python021",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which method converts a string to lowercase?",
    "options": [
      "capitalize()",
      "upper()",
      "lower()",
      "casefold()"
    ],
    "correctAnswer": 2,
    "explanation": "The lower() method converts all characters in a string to lowercase."
  },
  {
    "id": "python022",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which keyword is used to skip the current iteration of a loop?",
    "options": [
      "break",
      "continue",
      "pass",
      "skip"
    ],
    "correctAnswer": 1,
    "explanation": "The continue statement skips the remaining statements of the current iteration."
  },
  {
    "id": "python023",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which operator is used for floor division in Python?",
    "options": [
      "/",
      "%",
      "**",
      "//"
    ],
    "correctAnswer": 3,
    "explanation": "The // operator performs floor division."
  },
  {
    "id": "python024",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which function converts a string to an integer?",
    "options": [
      "int()",
      "str()",
      "float()",
      "integer()"
    ],
    "correctAnswer": 0,
    "explanation": "The int() function converts a valid numeric string into an integer."
  },
  {
    "id": "python025",
    "field": "IT Field",
    "subject": "Python",
    "category": "Python",
    "difficulty": "Easy",
    "question": "Which method removes all elements from a list?",
    "options": [
      "delete()",
      "clear()",
      "remove()",
      "pop()"
    ],
    "correctAnswer": 1,
    "explanation": "The clear() method removes all elements from a list."
  },
  {
    "id": "javascript001",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which company developed JavaScript?",
    "options": [
      "Microsoft",
      "Netscape",
      "Google",
      "Oracle"
    ],
    "correctAnswer": 1,
    "explanation": "JavaScript was developed by Brendan Eich at Netscape in 1995."
  },
  {
    "id": "javascript002",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to declare a block-scoped variable?",
    "options": [
      "var",
      "const",
      "let",
      "static"
    ],
    "correctAnswer": 2,
    "explanation": "The let keyword declares a block-scoped variable."
  },
  {
    "id": "javascript003",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which function is used to display output in the browser console?",
    "options": [
      "console.log()",
      "print()",
      "display()",
      "echo()"
    ],
    "correctAnswer": 0,
    "explanation": "console.log() prints messages to the browser's developer console."
  },
  {
    "id": "javascript004",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which symbol is used for single-line comments in JavaScript?",
    "options": [
      "#",
      "<!-- -->",
      "/* */",
      "//"
    ],
    "correctAnswer": 3,
    "explanation": "The // symbol is used for single-line comments."
  },
  {
    "id": "javascript005",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method converts a JSON string into a JavaScript object?",
    "options": [
      "JSON.stringify()",
      "JSON.convert()",
      "JSON.parse()",
      "JSON.decode()"
    ],
    "correctAnswer": 2,
    "explanation": "JSON.parse() converts a JSON string into a JavaScript object."
  },
  {
    "id": "javascript006",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword declares a constant variable?",
    "options": [
      "final",
      "const",
      "let",
      "var"
    ],
    "correctAnswer": 1,
    "explanation": "const declares a block-scoped constant."
  },
  {
    "id": "javascript007",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which operator checks both value and data type?",
    "options": [
      "==",
      "=",
      "!=",
      "==="
    ],
    "correctAnswer": 3,
    "explanation": "The === operator performs strict equality comparison."
  },
  {
    "id": "javascript008",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a function?",
    "options": [
      "function",
      "method",
      "func",
      "define"
    ],
    "correctAnswer": 0,
    "explanation": "The function keyword defines a function."
  },
  {
    "id": "javascript009",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method adds an element to the end of an array?",
    "options": [
      "shift()",
      "pop()",
      "push()",
      "unshift()"
    ],
    "correctAnswer": 2,
    "explanation": "push() adds one or more elements to the end of an array."
  },
  {
    "id": "javascript010",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to create a class?",
    "options": [
      "object",
      "class",
      "constructor",
      "prototype"
    ],
    "correctAnswer": 1,
    "explanation": "The class keyword is used to define a class."
  },
  {
    "id": "javascript011",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method removes the last element from an array?",
    "options": [
      "pop()",
      "push()",
      "shift()",
      "slice()"
    ],
    "correctAnswer": 0,
    "explanation": "pop() removes and returns the last element of an array."
  },
  {
    "id": "javascript012",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which object is used to work with JSON data?",
    "options": [
      "Object",
      "Array",
      "String",
      "JSON"
    ],
    "correctAnswer": 3,
    "explanation": "The JSON object provides methods such as parse() and stringify()."
  },
  {
    "id": "javascript013",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which statement is used to stop a loop immediately?",
    "options": [
      "continue",
      "break",
      "return",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The break statement immediately terminates a loop."
  },
  {
    "id": "javascript014",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method converts a JavaScript object into a JSON string?",
    "options": [
      "JSON.parse()",
      "JSON.convert()",
      "JSON.stringify()",
      "JSON.encode()"
    ],
    "correctAnswer": 2,
    "explanation": "JSON.stringify() converts a JavaScript object into a JSON string."
  },
  {
    "id": "javascript015",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to exit a function and optionally return a value?",
    "options": [
      "return",
      "break",
      "continue",
      "exit"
    ],
    "correctAnswer": 0,
    "explanation": "The return statement ends function execution and optionally returns a value."
  },
  {
    "id": "javascript016",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method removes the first element from an array?",
    "options": [
      "pop()",
      "push()",
      "splice()",
      "shift()"
    ],
    "correctAnswer": 3,
    "explanation": "shift() removes and returns the first element of an array."
  },
  {
    "id": "javascript017",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword skips the current iteration of a loop?",
    "options": [
      "return",
      "continue",
      "break",
      "pass"
    ],
    "correctAnswer": 1,
    "explanation": "continue skips the current iteration and proceeds with the next one."
  },
  {
    "id": "javascript018",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method checks whether an array contains a specified element?",
    "options": [
      "find()",
      "indexOf()",
      "includes()",
      "contains()"
    ],
    "correctAnswer": 2,
    "explanation": "includes() returns true if the specified element exists in the array."
  },
  {
    "id": "javascript019",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to handle exceptions?",
    "options": [
      "throw",
      "catch",
      "finally",
      "try"
    ],
    "correctAnswer": 3,
    "explanation": "The try block is used to enclose code that may throw an exception."
  },
  {
    "id": "javascript020",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method joins all array elements into a string?",
    "options": [
      "join()",
      "merge()",
      "concat()",
      "combine()"
    ],
    "correctAnswer": 0,
    "explanation": "join() combines array elements into a string using a separator."
  },
  {
    "id": "javascript021",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method converts all characters of a string to uppercase?",
    "options": [
      "capitalize()",
      "trim()",
      "toUpperCase()",
      "upper()"
    ],
    "correctAnswer": 2,
    "explanation": "toUpperCase() converts every character in a string to uppercase."
  },
  {
    "id": "javascript022",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method removes whitespace from both ends of a string?",
    "options": [
      "strip()",
      "trim()",
      "slice()",
      "remove()"
    ],
    "correctAnswer": 1,
    "explanation": "trim() removes whitespace from both the beginning and end of a string."
  },
  {
    "id": "javascript023",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to create an asynchronous function?",
    "options": [
      "await",
      "promise",
      "defer",
      "async"
    ],
    "correctAnswer": 3,
    "explanation": "The async keyword is used before a function declaration to create an asynchronous function."
  },
  {
    "id": "javascript024",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which method is used to convert a string to an integer?",
    "options": [
      "parseInt()",
      "Number()",
      "parseFloat()",
      "toInteger()"
    ],
    "correctAnswer": 0,
    "explanation": "parseInt() converts a string into an integer."
  },
  {
    "id": "javascript025",
    "field": "IT Field",
    "subject": "JavaScript",
    "category": "JavaScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to throw a custom exception?",
    "options": [
      "raise",
      "throw",
      "catch",
      "error"
    ],
    "correctAnswer": 1,
    "explanation": "The throw keyword is used to throw custom exceptions in JavaScript."
  },
  {
    "id": "typescript001",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Who developed TypeScript?",
    "options": [
      "Google",
      "Microsoft",
      "Oracle",
      "Mozilla"
    ],
    "correctAnswer": 1,
    "explanation": "TypeScript was developed and is maintained by Microsoft."
  },
  {
    "id": "typescript002",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "TypeScript is a superset of which language?",
    "options": [
      "Java",
      "Python",
      "JavaScript",
      "C#"
    ],
    "correctAnswer": 2,
    "explanation": "TypeScript extends JavaScript by adding static typing and other features."
  },
  {
    "id": "typescript003",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which command is used to compile a TypeScript file?",
    "options": [
      "tsc",
      "node",
      "npm",
      "ts-node"
    ],
    "correctAnswer": 0,
    "explanation": "The TypeScript compiler command is tsc."
  },
  {
    "id": "typescript004",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which file extension is used for TypeScript files?",
    "options": [
      ".js",
      ".jsx",
      ".tsx",
      ".ts"
    ],
    "correctAnswer": 3,
    "explanation": "Standard TypeScript files use the .ts extension."
  },
  {
    "id": "typescript005",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to declare a variable with block scope?",
    "options": [
      "var",
      "const",
      "let",
      "static"
    ],
    "correctAnswer": 2,
    "explanation": "The let keyword declares a block-scoped variable."
  },
  {
    "id": "typescript006",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword declares a constant value?",
    "options": [
      "let",
      "const",
      "final",
      "var"
    ],
    "correctAnswer": 1,
    "explanation": "const is used to declare variables whose value cannot be reassigned."
  },
  {
    "id": "typescript007",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which TypeScript type can hold any value without type checking?",
    "options": [
      "unknown",
      "void",
      "never",
      "any"
    ],
    "correctAnswer": 3,
    "explanation": "The any type disables type checking for a variable."
  },
  {
    "id": "typescript008",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a function?",
    "options": [
      "function",
      "func",
      "method",
      "define"
    ],
    "correctAnswer": 0,
    "explanation": "The function keyword defines a function."
  },
  {
    "id": "typescript009",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type represents only true or false values?",
    "options": [
      "string",
      "number",
      "boolean",
      "object"
    ],
    "correctAnswer": 2,
    "explanation": "The boolean type stores either true or false."
  },
  {
    "id": "typescript010",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to define a class?",
    "options": [
      "object",
      "class",
      "interface",
      "type"
    ],
    "correctAnswer": 1,
    "explanation": "The class keyword is used to create classes."
  },
  {
    "id": "typescript011",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type is used to represent textual data?",
    "options": [
      "string",
      "char",
      "text",
      "varchar"
    ],
    "correctAnswer": 0,
    "explanation": "The string type is used for textual values."
  },
  {
    "id": "typescript012",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to import modules?",
    "options": [
      "include",
      "using",
      "require",
      "import"
    ],
    "correctAnswer": 3,
    "explanation": "The import keyword is used to import modules."
  },
  {
    "id": "typescript013",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which statement is used to exit a loop immediately?",
    "options": [
      "continue",
      "break",
      "return",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The break statement immediately terminates a loop."
  },
  {
    "id": "typescript014",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type is used to define the shape of an object in TypeScript?",
    "options": [
      "class",
      "type",
      "interface",
      "object"
    ],
    "correctAnswer": 2,
    "explanation": "Interfaces define the structure or shape of objects in TypeScript."
  },
  {
    "id": "typescript015",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to create a custom type alias?",
    "options": [
      "type",
      "alias",
      "typedef",
      "interface"
    ],
    "correctAnswer": 0,
    "explanation": "The type keyword creates a custom type alias."
  },
  {
    "id": "typescript016",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type represents a function that never returns?",
    "options": [
      "void",
      "null",
      "undefined",
      "never"
    ],
    "correctAnswer": 3,
    "explanation": "The never type represents values that never occur, such as functions that always throw an error."
  },
  {
    "id": "typescript017",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword skips the current iteration of a loop?",
    "options": [
      "break",
      "continue",
      "return",
      "exit"
    ],
    "correctAnswer": 1,
    "explanation": "The continue statement skips the current iteration of a loop."
  },
  {
    "id": "typescript018",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type allows a variable to store values of multiple specified types?",
    "options": [
      "Tuple",
      "Array",
      "Union",
      "Enum"
    ],
    "correctAnswer": 2,
    "explanation": "A union type allows a variable to hold values of multiple specified types."
  },
  {
    "id": "typescript019",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to begin exception handling?",
    "options": [
      "catch",
      "throw",
      "finally",
      "try"
    ],
    "correctAnswer": 3,
    "explanation": "The try block contains code that may throw an exception."
  },
  {
    "id": "typescript020",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to create an enumeration?",
    "options": [
      "enum",
      "type",
      "class",
      "interface"
    ],
    "correctAnswer": 0,
    "explanation": "The enum keyword is used to define enumerations."
  },
  {
    "id": "typescript021",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which utility type makes all properties optional?",
    "options": [
      "Readonly",
      "Required",
      "Partial",
      "Pick"
    ],
    "correctAnswer": 2,
    "explanation": "Partial<T> makes every property of a type optional."
  },
  {
    "id": "typescript022",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to export a module member?",
    "options": [
      "import",
      "export",
      "public",
      "module"
    ],
    "correctAnswer": 1,
    "explanation": "The export keyword makes classes, functions, or variables available outside a module."
  },
  {
    "id": "typescript023",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to create an asynchronous function?",
    "options": [
      "await",
      "promise",
      "defer",
      "async"
    ],
    "correctAnswer": 3,
    "explanation": "The async keyword defines an asynchronous function."
  },
  {
    "id": "typescript024",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which type can hold values of any type but requires type checking before use?",
    "options": [
      "unknown",
      "any",
      "never",
      "void"
    ],
    "correctAnswer": 0,
    "explanation": "The unknown type is type-safe because it requires type checking before operations."
  },
  {
    "id": "typescript025",
    "field": "IT Field",
    "subject": "TypeScript",
    "category": "TypeScript",
    "difficulty": "Easy",
    "question": "Which keyword is used to extend a class?",
    "options": [
      "implements",
      "extends",
      "inherits",
      "super"
    ],
    "correctAnswer": 1,
    "explanation": "The extends keyword is used to create a subclass from an existing class."
  },
  {
    "id": "cn001",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "What is the primary purpose of a computer network?",
    "options": [
      "To increase CPU speed",
      "To share resources and communicate",
      "To install operating systems",
      "To replace memory"
    ],
    "correctAnswer": 1,
    "explanation": "A computer network allows devices to communicate and share resources such as files, printers, and internet access."
  },
  {
    "id": "cn002",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which device forwards data packets between different networks?",
    "options": [
      "Hub",
      "Switch",
      "Router",
      "Repeater"
    ],
    "correctAnswer": 2,
    "explanation": "A router connects multiple networks and forwards packets based on IP addresses."
  },
  {
    "id": "cn003",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is used to browse websites?",
    "options": [
      "HTTP",
      "FTP",
      "SMTP",
      "TCP"
    ],
    "correctAnswer": 0,
    "explanation": "HTTP (HyperText Transfer Protocol) is used for transferring web pages."
  },
  {
    "id": "cn004",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which network covers a large geographical area?",
    "options": [
      "LAN",
      "MAN",
      "PAN",
      "WAN"
    ],
    "correctAnswer": 3,
    "explanation": "A WAN (Wide Area Network) connects devices across cities, countries, or continents."
  },
  {
    "id": "cn005",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which layer of the OSI model is responsible for routing?",
    "options": [
      "Transport Layer",
      "Data Link Layer",
      "Network Layer",
      "Physical Layer"
    ],
    "correctAnswer": 2,
    "explanation": "The Network layer handles routing and logical addressing."
  },
  {
    "id": "cn006",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is responsible for reliable data transmission?",
    "options": [
      "UDP",
      "TCP",
      "IP",
      "ARP"
    ],
    "correctAnswer": 1,
    "explanation": "TCP provides reliable, connection-oriented communication."
  },
  {
    "id": "cn007",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which device operates only at the Physical Layer of the OSI model?",
    "options": [
      "Switch",
      "Router",
      "Bridge",
      "Hub"
    ],
    "correctAnswer": 3,
    "explanation": "A hub simply broadcasts incoming signals to all connected devices."
  },
  {
    "id": "cn008",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "What does IP stand for?",
    "options": [
      "Internet Protocol",
      "Internal Process",
      "Internet Program",
      "Integrated Protocol"
    ],
    "correctAnswer": 0,
    "explanation": "IP stands for Internet Protocol."
  },
  {
    "id": "cn009",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is used to send emails?",
    "options": [
      "HTTP",
      "FTP",
      "SMTP",
      "DNS"
    ],
    "correctAnswer": 2,
    "explanation": "SMTP (Simple Mail Transfer Protocol) is used for sending emails."
  },
  {
    "id": "cn010",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which device connects devices within the same LAN intelligently?",
    "options": [
      "Hub",
      "Switch",
      "Gateway",
      "Modem"
    ],
    "correctAnswer": 1,
    "explanation": "A switch forwards frames based on MAC addresses."
  },
  {
    "id": "cn011",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol translates domain names into IP addresses?",
    "options": [
      "DNS",
      "DHCP",
      "ARP",
      "FTP"
    ],
    "correctAnswer": 0,
    "explanation": "DNS resolves domain names into IP addresses."
  },
  {
    "id": "cn012",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol automatically assigns IP addresses to devices?",
    "options": [
      "DNS",
      "TCP",
      "HTTP",
      "DHCP"
    ],
    "correctAnswer": 3,
    "explanation": "DHCP automatically assigns IP addresses to network devices."
  },
  {
    "id": "cn013",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which topology connects all devices to a central hub or switch?",
    "options": [
      "Bus",
      "Star",
      "Ring",
      "Mesh"
    ],
    "correctAnswer": 1,
    "explanation": "In a star topology, every device connects to a central hub or switch."
  },
  {
    "id": "cn014",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which layer of the OSI model is responsible for error detection using frames?",
    "options": [
      "Physical Layer",
      "Transport Layer",
      "Data Link Layer",
      "Session Layer"
    ],
    "correctAnswer": 2,
    "explanation": "The Data Link layer performs framing, error detection, and MAC addressing."
  },
  {
    "id": "cn015",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "What does LAN stand for?",
    "options": [
      "Local Area Network",
      "Large Area Network",
      "Logical Access Network",
      "Linked Area Network"
    ],
    "correctAnswer": 0,
    "explanation": "LAN stands for Local Area Network, connecting devices within a limited area."
  },
  {
    "id": "cn016",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is used to securely browse websites?",
    "options": [
      "HTTP",
      "FTP",
      "SMTP",
      "HTTPS"
    ],
    "correctAnswer": 3,
    "explanation": "HTTPS is the secure version of HTTP using SSL/TLS encryption."
  },
  {
    "id": "cn017",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which command is commonly used to test network connectivity?",
    "options": [
      "ipconfig",
      "ping",
      "tracert",
      "netstat"
    ],
    "correctAnswer": 1,
    "explanation": "The ping command checks connectivity between two network devices."
  },
  {
    "id": "cn018",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which address uniquely identifies a network interface card?",
    "options": [
      "IP Address",
      "Port Number",
      "MAC Address",
      "URL"
    ],
    "correctAnswer": 2,
    "explanation": "A MAC address uniquely identifies a network interface."
  },
  {
    "id": "cn019",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is used to transfer files over a network?",
    "options": [
      "SMTP",
      "HTTP",
      "DNS",
      "FTP"
    ],
    "correctAnswer": 3,
    "explanation": "FTP (File Transfer Protocol) is designed for transferring files."
  },
  {
    "id": "cn020",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which layer of the TCP/IP model corresponds to the OSI Network layer?",
    "options": [
      "Internet Layer",
      "Application Layer",
      "Transport Layer",
      "Network Access Layer"
    ],
    "correctAnswer": 0,
    "explanation": "The Internet layer in TCP/IP performs routing and logical addressing."
  },
  {
    "id": "cn021",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which topology provides the highest fault tolerance?",
    "options": [
      "Bus",
      "Ring",
      "Mesh",
      "Star"
    ],
    "correctAnswer": 2,
    "explanation": "Mesh topology provides multiple communication paths, making it highly fault tolerant."
  },
  {
    "id": "cn022",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which device converts digital signals into analog signals and vice versa?",
    "options": [
      "Router",
      "Modem",
      "Switch",
      "Hub"
    ],
    "correctAnswer": 1,
    "explanation": "A modem modulates and demodulates signals for communication."
  },
  {
    "id": "cn023",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is connectionless?",
    "options": [
      "TCP",
      "HTTP",
      "FTP",
      "UDP"
    ],
    "correctAnswer": 3,
    "explanation": "UDP is a connectionless protocol with low overhead."
  },
  {
    "id": "cn024",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "What does DNS stand for?",
    "options": [
      "Domain Name System",
      "Data Network Service",
      "Digital Naming Server",
      "Domain Network Setup"
    ],
    "correctAnswer": 0,
    "explanation": "DNS stands for Domain Name System and translates domain names into IP addresses."
  },
  {
    "id": "cn025",
    "field": "IT Field",
    "subject": "Computer Networks",
    "category": "Computer Networks",
    "difficulty": "Easy",
    "question": "Which protocol is primarily used to receive emails?",
    "options": [
      "SMTP",
      "POP3",
      "FTP",
      "ARP"
    ],
    "correctAnswer": 1,
    "explanation": "POP3 (Post Office Protocol version 3) is commonly used to receive emails."
  },
  {
    "id": "os001",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "What is the primary purpose of an operating system?",
    "options": [
      "To create web pages",
      "To manage computer resources",
      "To compile programs",
      "To design databases"
    ],
    "correctAnswer": 1,
    "explanation": "An operating system manages hardware resources and provides services for applications."
  },
  {
    "id": "os002",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which of the following is an example of an operating system?",
    "options": [
      "MySQL",
      "Google Chrome",
      "Linux",
      "MS Word"
    ],
    "correctAnswer": 2,
    "explanation": "Linux is a popular open-source operating system."
  },
  {
    "id": "os003",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which component acts as an interface between the user and the hardware?",
    "options": [
      "Operating System",
      "Compiler",
      "Assembler",
      "Application Software"
    ],
    "correctAnswer": 0,
    "explanation": "The operating system acts as an interface between users and computer hardware."
  },
  {
    "id": "os004",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which scheduling algorithm executes processes in the order they arrive?",
    "options": [
      "Round Robin",
      "Priority Scheduling",
      "Shortest Job First",
      "First Come First Serve (FCFS)"
    ],
    "correctAnswer": 3,
    "explanation": "FCFS schedules processes based on their arrival time."
  },
  {
    "id": "os005",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which memory is volatile?",
    "options": [
      "ROM",
      "Hard Disk",
      "RAM",
      "SSD"
    ],
    "correctAnswer": 2,
    "explanation": "RAM is volatile memory because its contents are lost when power is turned off."
  },
  {
    "id": "os006",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which operating system allows multiple users to access the system simultaneously?",
    "options": [
      "Single-user OS",
      "Multi-user OS",
      "Embedded OS",
      "Batch OS"
    ],
    "correctAnswer": 1,
    "explanation": "A multi-user operating system supports multiple users at the same time."
  },
  {
    "id": "os007",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which scheduling algorithm assigns a fixed time slice to each process?",
    "options": [
      "FCFS",
      "Priority",
      "SJF",
      "Round Robin"
    ],
    "correctAnswer": 3,
    "explanation": "Round Robin scheduling assigns each process a fixed time quantum."
  },
  {
    "id": "os008",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "What is a process?",
    "options": [
      "A program in execution",
      "A file stored on disk",
      "A compiler",
      "A hardware device"
    ],
    "correctAnswer": 0,
    "explanation": "A process is a program that is currently being executed."
  },
  {
    "id": "os009",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which memory management technique divides memory into fixed-size blocks?",
    "options": [
      "Segmentation",
      "Virtual Memory",
      "Paging",
      "Swapping"
    ],
    "correctAnswer": 2,
    "explanation": "Paging divides memory into fixed-size pages and frames."
  },
  {
    "id": "os010",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which OS is commonly used on Apple's Mac computers?",
    "options": [
      "Linux",
      "macOS",
      "Windows",
      "UNIX"
    ],
    "correctAnswer": 1,
    "explanation": "macOS is Apple's operating system for Mac computers."
  },
  {
    "id": "os011",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which of the following is system software?",
    "options": [
      "Operating System",
      "MS Excel",
      "Photoshop",
      "Google Chrome"
    ],
    "correctAnswer": 0,
    "explanation": "An operating system is system software."
  },
  {
    "id": "os012",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which memory stores the BIOS program?",
    "options": [
      "RAM",
      "Cache",
      "Virtual Memory",
      "ROM"
    ],
    "correctAnswer": 3,
    "explanation": "The BIOS firmware is stored in ROM."
  },
  {
    "id": "os013",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which state indicates that a process is currently being executed by the CPU?",
    "options": [
      "Ready",
      "Running",
      "Waiting",
      "Terminated"
    ],
    "correctAnswer": 1,
    "explanation": "A process in the Running state is currently executing on the CPU."
  },
  {
    "id": "os014",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which scheduling algorithm selects the process with the shortest execution time first?",
    "options": [
      "FCFS",
      "Round Robin",
      "Shortest Job First (SJF)",
      "Priority Scheduling"
    ],
    "correctAnswer": 2,
    "explanation": "SJF selects the process with the smallest CPU burst time."
  },
  {
    "id": "os015",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which memory retains data even after the power is turned off?",
    "options": [
      "ROM",
      "RAM",
      "Cache",
      "Registers"
    ],
    "correctAnswer": 0,
    "explanation": "ROM is non-volatile memory that retains data without power."
  },
  {
    "id": "os016",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which process state indicates that a process is waiting for an event or I/O operation?",
    "options": [
      "Running",
      "Ready",
      "Terminated",
      "Waiting"
    ],
    "correctAnswer": 3,
    "explanation": "A process enters the Waiting (Blocked) state while waiting for an event or I/O completion."
  },
  {
    "id": "os017",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which command is commonly used to display the current working directory in Linux?",
    "options": [
      "ls",
      "pwd",
      "cd",
      "dir"
    ],
    "correctAnswer": 1,
    "explanation": "The pwd command prints the current working directory."
  },
  {
    "id": "os018",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which technique allows multiple programs to reside in memory at the same time?",
    "options": [
      "Paging",
      "Swapping",
      "Multiprogramming",
      "Spooling"
    ],
    "correctAnswer": 2,
    "explanation": "Multiprogramming keeps multiple programs in memory to improve CPU utilization."
  },
  {
    "id": "os019",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which type of operating system is commonly used in ATMs and traffic control systems?",
    "options": [
      "Batch Operating System",
      "Distributed Operating System",
      "Network Operating System",
      "Real-Time Operating System (RTOS)"
    ],
    "correctAnswer": 3,
    "explanation": "RTOS provides fast and predictable responses for time-critical applications."
  },
  {
    "id": "os020",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which memory is the fastest in a computer?",
    "options": [
      "CPU Registers",
      "RAM",
      "Hard Disk",
      "SSD"
    ],
    "correctAnswer": 0,
    "explanation": "CPU registers are the fastest storage locations in a computer."
  },
  {
    "id": "os021",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which technique is used to avoid external fragmentation?",
    "options": [
      "Segmentation",
      "Paging",
      "Contiguous Allocation",
      "Static Partitioning"
    ],
    "correctAnswer": 2,
    "explanation": "Paging eliminates external fragmentation by dividing memory into fixed-size pages."
  },
  {
    "id": "os022",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which Linux command is used to list files and directories?",
    "options": [
      "pwd",
      "ls",
      "mkdir",
      "cd"
    ],
    "correctAnswer": 1,
    "explanation": "The ls command lists files and directories."
  },
  {
    "id": "os023",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which problem occurs when two or more processes wait indefinitely for each other?",
    "options": [
      "Starvation",
      "Thrashing",
      "Fragmentation",
      "Deadlock"
    ],
    "correctAnswer": 3,
    "explanation": "Deadlock occurs when processes wait indefinitely for resources held by each other."
  },
  {
    "id": "os024",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which scheduling algorithm is preemptive by default?",
    "options": [
      "Round Robin",
      "FCFS",
      "SJF (Non-preemptive)",
      "Priority (Non-preemptive)"
    ],
    "correctAnswer": 0,
    "explanation": "Round Robin is a preemptive scheduling algorithm that uses time slices."
  },
  {
    "id": "os025",
    "field": "IT Field",
    "subject": "Operating System",
    "category": "Operating System",
    "difficulty": "Easy",
    "question": "Which component of the operating system manages files and directories?",
    "options": [
      "Memory Manager",
      "File System",
      "Process Scheduler",
      "Device Driver"
    ],
    "correctAnswer": 1,
    "explanation": "The file system is responsible for organizing, storing, and managing files and directories."
  },
  {
    "id": "st001",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "What is the primary purpose of software testing?",
    "options": [
      "To write source code",
      "To identify defects in software",
      "To design databases",
      "To increase internet speed"
    ],
    "correctAnswer": 1,
    "explanation": "Software testing is performed to identify defects and ensure the software meets requirements."
  },
  {
    "id": "st002",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing verifies the functionality of individual components?",
    "options": [
      "Integration Testing",
      "System Testing",
      "Unit Testing",
      "Acceptance Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Unit testing checks the correctness of individual functions or modules."
  },
  {
    "id": "st003",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed without executing the code?",
    "options": [
      "Static Testing",
      "Dynamic Testing",
      "Regression Testing",
      "Performance Testing"
    ],
    "correctAnswer": 0,
    "explanation": "Static testing involves reviewing documents and code without execution."
  },
  {
    "id": "st004",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing ensures that a software product meets user requirements?",
    "options": [
      "Smoke Testing",
      "Regression Testing",
      "Integration Testing",
      "Acceptance Testing"
    ],
    "correctAnswer": 3,
    "explanation": "Acceptance testing verifies whether the software satisfies business and user requirements."
  },
  {
    "id": "st005",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing checks the interaction between software modules?",
    "options": [
      "System Testing",
      "Smoke Testing",
      "Integration Testing",
      "Unit Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Integration testing verifies communication between integrated modules."
  },
  {
    "id": "st006",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed after every new build to ensure basic functionality works?",
    "options": [
      "Sanity Testing",
      "Smoke Testing",
      "Regression Testing",
      "Load Testing"
    ],
    "correctAnswer": 1,
    "explanation": "Smoke testing verifies the basic stability of a new software build."
  },
  {
    "id": "st007",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing verifies the complete integrated application?",
    "options": [
      "Unit Testing",
      "Acceptance Testing",
      "Alpha Testing",
      "System Testing"
    ],
    "correctAnswer": 3,
    "explanation": "System testing evaluates the complete integrated application."
  },
  {
    "id": "st008",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which document describes the expected behavior of the software?",
    "options": [
      "Software Requirement Specification (SRS)",
      "Test Case",
      "Bug Report",
      "Test Plan"
    ],
    "correctAnswer": 0,
    "explanation": "The SRS document contains the functional and non-functional requirements."
  },
  {
    "id": "st009",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed to ensure recent code changes have not affected existing functionality?",
    "options": [
      "Smoke Testing",
      "Sanity Testing",
      "Regression Testing",
      "Alpha Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Regression testing ensures existing features continue to work after changes."
  },
  {
    "id": "st010",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed by developers?",
    "options": [
      "Acceptance Testing",
      "Unit Testing",
      "Beta Testing",
      "User Testing"
    ],
    "correctAnswer": 1,
    "explanation": "Developers typically perform unit testing during development."
  },
  {
    "id": "st011",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing technique does NOT require knowledge of the internal code?",
    "options": [
      "Black Box Testing",
      "White Box Testing",
      "Path Testing",
      "Statement Testing"
    ],
    "correctAnswer": 0,
    "explanation": "Black Box Testing focuses only on inputs and outputs."
  },
  {
    "id": "st012",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed by actual users before the final release?",
    "options": [
      "Alpha Testing",
      "Smoke Testing",
      "Regression Testing",
      "Beta Testing"
    ],
    "correctAnswer": 3,
    "explanation": "Beta testing is conducted by real users in a real environment."
  },
  {
    "id": "st013",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which document contains a set of conditions to verify a feature?",
    "options": [
      "Bug Report",
      "Test Case",
      "Test Summary",
      "SRS"
    ],
    "correctAnswer": 1,
    "explanation": "A test case contains inputs, execution steps, and expected results."
  },
  {
    "id": "st014",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed after fixing a defect to verify that the issue has been resolved?",
    "options": [
      "Regression Testing",
      "Smoke Testing",
      "Retesting",
      "System Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Retesting verifies that the reported defect has been fixed successfully."
  },
  {
    "id": "st015",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing technique requires knowledge of the internal code structure?",
    "options": [
      "White Box Testing",
      "Black Box Testing",
      "Acceptance Testing",
      "Functional Testing"
    ],
    "correctAnswer": 0,
    "explanation": "White Box Testing examines the internal logic and code structure."
  },
  {
    "id": "st016",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing evaluates how software performs under heavy user load?",
    "options": [
      "Stress Testing",
      "Security Testing",
      "Compatibility Testing",
      "Load Testing"
    ],
    "correctAnswer": 3,
    "explanation": "Load Testing measures application performance under expected user loads."
  },
  {
    "id": "st017",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which document defines the overall testing strategy and scope?",
    "options": [
      "Test Case",
      "Test Plan",
      "Bug Report",
      "SRS"
    ],
    "correctAnswer": 1,
    "explanation": "A Test Plan describes the testing scope, objectives, resources, and schedule."
  },
  {
    "id": "st018",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing verifies whether all software features work according to requirements?",
    "options": [
      "Performance Testing",
      "Load Testing",
      "Functional Testing",
      "Security Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Functional Testing ensures that every feature behaves according to the specified requirements."
  },
  {
    "id": "st019",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing identifies vulnerabilities in an application?",
    "options": [
      "Performance Testing",
      "Usability Testing",
      "Integration Testing",
      "Security Testing"
    ],
    "correctAnswer": 3,
    "explanation": "Security Testing identifies vulnerabilities and ensures data protection."
  },
  {
    "id": "st020",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing ensures the application works correctly on different browsers?",
    "options": [
      "Compatibility Testing",
      "Smoke Testing",
      "Alpha Testing",
      "Regression Testing"
    ],
    "correctAnswer": 0,
    "explanation": "Compatibility Testing verifies application behavior across browsers, devices, and operating systems."
  },
  {
    "id": "st021",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing checks whether software is easy to use?",
    "options": [
      "Performance Testing",
      "Usability Testing",
      "Stress Testing",
      "Load Testing"
    ],
    "correctAnswer": 2,
    "explanation": "Usability Testing evaluates how easy and user-friendly the application is."
  },
  {
    "id": "st022",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is performed before Beta Testing?",
    "options": [
      "Regression Testing",
      "Alpha Testing",
      "Smoke Testing",
      "Unit Testing"
    ],
    "correctAnswer": 1,
    "explanation": "Alpha Testing is conducted internally before Beta Testing."
  },
  {
    "id": "st023",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing ensures the application responds within acceptable time limits?",
    "options": [
      "Functional Testing",
      "Integration Testing",
      "Acceptance Testing",
      "Performance Testing"
    ],
    "correctAnswer": 3,
    "explanation": "Performance Testing measures response time, throughput, and system stability."
  },
  {
    "id": "st024",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "What is the expected result in a test case?",
    "options": [
      "The outcome that should occur if the software works correctly",
      "The tester's name",
      "The project deadline",
      "The programming language used"
    ],
    "correctAnswer": 0,
    "explanation": "The expected result describes the correct behavior that should occur after executing the test case."
  },
  {
    "id": "st025",
    "field": "IT Field",
    "subject": "Software Testing",
    "category": "Software Testing",
    "difficulty": "Easy",
    "question": "Which testing is usually performed by the customer before accepting the software?",
    "options": [
      "Regression Testing",
      "User Acceptance Testing (UAT)",
      "Smoke Testing",
      "Unit Testing"
    ],
    "correctAnswer": 1,
    "explanation": "User Acceptance Testing (UAT) is performed by the customer or end users to verify that the software meets business requirements."
  },
  {
    "id": "da001",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "What is the primary goal of data analytics?",
    "options": [
      "To develop operating systems",
      "To extract meaningful insights from data",
      "To create websites",
      "To design computer hardware"
    ],
    "correctAnswer": 1,
    "explanation": "Data analytics involves examining data to discover useful information and support decision-making."
  },
  {
    "id": "da002",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which language is most commonly used for data analysis?",
    "options": [
      "HTML",
      "CSS",
      "Python",
      "XML"
    ],
    "correctAnswer": 2,
    "explanation": "Python is widely used for data analysis because of libraries like Pandas, NumPy, and Matplotlib."
  },
  {
    "id": "da003",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which library is primarily used for data manipulation in Python?",
    "options": [
      "Pandas",
      "TensorFlow",
      "OpenCV",
      "Flask"
    ],
    "correctAnswer": 0,
    "explanation": "Pandas provides powerful data structures such as DataFrame for data manipulation."
  },
  {
    "id": "da004",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which chart is best for showing parts of a whole?",
    "options": [
      "Bar Chart",
      "Histogram",
      "Line Chart",
      "Pie Chart"
    ],
    "correctAnswer": 3,
    "explanation": "Pie charts display proportions of a whole."
  },
  {
    "id": "da005",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL command is used to retrieve data from a table?",
    "options": [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE"
    ],
    "correctAnswer": 2,
    "explanation": "SELECT retrieves data from one or more database tables."
  },
  {
    "id": "da006",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which measure represents the average value of a dataset?",
    "options": [
      "Median",
      "Mean",
      "Mode",
      "Range"
    ],
    "correctAnswer": 1,
    "explanation": "The mean is calculated by dividing the sum of all values by the number of values."
  },
  {
    "id": "da007",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which type of analytics predicts future outcomes?",
    "options": [
      "Descriptive Analytics",
      "Diagnostic Analytics",
      "Prescriptive Analytics",
      "Predictive Analytics"
    ],
    "correctAnswer": 3,
    "explanation": "Predictive analytics uses historical data to forecast future events."
  },
  {
    "id": "da008",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "What does CSV stand for?",
    "options": [
      "Comma Separated Values",
      "Character Storage Value",
      "Computer Standard Value",
      "Column Stored Variable"
    ],
    "correctAnswer": 0,
    "explanation": "CSV is a simple file format used to store tabular data."
  },
  {
    "id": "da009",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL clause is used to filter rows?",
    "options": [
      "GROUP BY",
      "ORDER BY",
      "WHERE",
      "HAVING"
    ],
    "correctAnswer": 2,
    "explanation": "The WHERE clause filters records based on specified conditions."
  },
  {
    "id": "da010",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which visualization is best for showing trends over time?",
    "options": [
      "Pie Chart",
      "Line Chart",
      "Scatter Plot",
      "Histogram"
    ],
    "correctAnswer": 1,
    "explanation": "Line charts are commonly used to visualize trends over time."
  },
  {
    "id": "da011",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which Python library is commonly used for numerical computations?",
    "options": [
      "NumPy",
      "Django",
      "BeautifulSoup",
      "Requests"
    ],
    "correctAnswer": 0,
    "explanation": "NumPy provides efficient numerical computing with arrays and mathematical functions."
  },
  {
    "id": "da012",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which type of chart is useful for showing data distribution?",
    "options": [
      "Pie Chart",
      "Line Chart",
      "Bar Chart",
      "Histogram"
    ],
    "correctAnswer": 3,
    "explanation": "Histograms display the distribution of numerical data."
  },
  {
    "id": "da013",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL function counts the number of rows?",
    "options": [
      "SUM()",
      "COUNT()",
      "AVG()",
      "MAX()"
    ],
    "correctAnswer": 1,
    "explanation": "COUNT() returns the number of rows that match a condition."
  },
  {
    "id": "da014",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL clause is used to group rows with the same values?",
    "options": [
      "ORDER BY",
      "WHERE",
      "GROUP BY",
      "HAVING"
    ],
    "correctAnswer": 2,
    "explanation": "GROUP BY groups rows that have the same values into summary rows."
  },
  {
    "id": "da015",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which Excel function is used to calculate the average of a range?",
    "options": [
      "AVERAGE()",
      "COUNT()",
      "SUM()",
      "MAX()"
    ],
    "correctAnswer": 0,
    "explanation": "The AVERAGE() function returns the arithmetic mean of a range of values."
  },
  {
    "id": "da016",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which type of chart is best for comparing values across different categories?",
    "options": [
      "Pie Chart",
      "Line Chart",
      "Scatter Plot",
      "Bar Chart"
    ],
    "correctAnswer": 3,
    "explanation": "Bar charts are ideal for comparing values across different categories."
  },
  {
    "id": "da017",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL clause is used to sort query results?",
    "options": [
      "GROUP BY",
      "ORDER BY",
      "WHERE",
      "HAVING"
    ],
    "correctAnswer": 1,
    "explanation": "ORDER BY sorts query results in ascending or descending order."
  },
  {
    "id": "da018",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which Power BI component is used to connect and transform data?",
    "options": [
      "Power View",
      "Power Pivot",
      "Power Query",
      "Power Map"
    ],
    "correctAnswer": 2,
    "explanation": "Power Query is used to import, clean, and transform data before analysis."
  },
  {
    "id": "da019",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL function returns the highest value in a column?",
    "options": [
      "MIN()",
      "COUNT()",
      "AVG()",
      "MAX()"
    ],
    "correctAnswer": 3,
    "explanation": "MAX() returns the largest value in a specified column."
  },
  {
    "id": "da020",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which type of analytics answers the question 'What happened?'",
    "options": [
      "Descriptive Analytics",
      "Predictive Analytics",
      "Prescriptive Analytics",
      "Diagnostic Analytics"
    ],
    "correctAnswer": 0,
    "explanation": "Descriptive analytics summarizes historical data to explain what happened."
  },
  {
    "id": "da021",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL function calculates the total of numeric values?",
    "options": [
      "COUNT()",
      "AVG()",
      "SUM()",
      "MAX()"
    ],
    "correctAnswer": 2,
    "explanation": "SUM() returns the total of numeric values in a column."
  },
  {
    "id": "da022",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which Excel feature summarizes large datasets quickly?",
    "options": [
      "Conditional Formatting",
      "Pivot Table",
      "Chart",
      "Filter"
    ],
    "correctAnswer": 1,
    "explanation": "Pivot Tables summarize, group, and analyze large amounts of data."
  },
  {
    "id": "da023",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which analytics type recommends actions based on data?",
    "options": [
      "Predictive Analytics",
      "Descriptive Analytics",
      "Diagnostic Analytics",
      "Prescriptive Analytics"
    ],
    "correctAnswer": 3,
    "explanation": "Prescriptive analytics recommends actions to achieve desired outcomes."
  },
  {
    "id": "da024",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which SQL clause is used to filter grouped records?",
    "options": [
      "HAVING",
      "WHERE",
      "ORDER BY",
      "GROUP BY"
    ],
    "correctAnswer": 0,
    "explanation": "HAVING filters grouped records after the GROUP BY clause."
  },
  {
    "id": "da025",
    "field": "IT Field",
    "subject": "Data Analytics",
    "category": "Data Analytics",
    "difficulty": "Easy",
    "question": "Which measure represents the most frequently occurring value in a dataset?",
    "options": [
      "Median",
      "Mode",
      "Mean",
      "Range"
    ],
    "correctAnswer": 1,
    "explanation": "Mode is the value that appears most frequently in a dataset."
  },
  {
    "id": "marketing001",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "What is the primary goal of marketing?",
    "options": [
      "To manufacture products",
      "To promote and sell products or services",
      "To recruit employees",
      "To manage company accounts"
    ],
    "correctAnswer": 1,
    "explanation": "Marketing focuses on promoting and selling products or services while satisfying customer needs."
  },
  {
    "id": "marketing002",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which of the following is one of the 4 Ps of marketing?",
    "options": [
      "Planning",
      "People",
      "Product",
      "Performance"
    ],
    "correctAnswer": 2,
    "explanation": "The 4 Ps of marketing are Product, Price, Place, and Promotion."
  },
  {
    "id": "marketing003",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Who is the target audience in marketing?",
    "options": [
      "The group of customers a business wants to reach",
      "Only company employees",
      "Government officials",
      "Suppliers"
    ],
    "correctAnswer": 0,
    "explanation": "The target audience consists of potential customers likely to purchase the product or service."
  },
  {
    "id": "marketing004",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing channel uses platforms like Facebook and Instagram?",
    "options": [
      "Email Marketing",
      "Print Marketing",
      "Telemarketing",
      "Social Media Marketing"
    ],
    "correctAnswer": 3,
    "explanation": "Social Media Marketing uses platforms such as Facebook, Instagram, LinkedIn, and X."
  },
  {
    "id": "marketing005",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which 'P' of marketing refers to the amount customers pay?",
    "options": [
      "Place",
      "Promotion",
      "Price",
      "Product"
    ],
    "correctAnswer": 2,
    "explanation": "Price refers to the amount a customer pays for a product or service."
  },
  {
    "id": "marketing006",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing strategy focuses on creating valuable content to attract customers?",
    "options": [
      "Affiliate Marketing",
      "Content Marketing",
      "Direct Marketing",
      "Outdoor Marketing"
    ],
    "correctAnswer": 1,
    "explanation": "Content marketing attracts customers by providing useful and relevant content."
  },
  {
    "id": "marketing007",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which metric measures the percentage of visitors who become customers?",
    "options": [
      "Bounce Rate",
      "CTR",
      "Reach",
      "Conversion Rate"
    ],
    "correctAnswer": 3,
    "explanation": "Conversion rate measures how many visitors complete a desired action."
  },
  {
    "id": "marketing008",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "What does SEO stand for?",
    "options": [
      "Search Engine Optimization",
      "Sales Engine Operation",
      "Search Enhancement Option",
      "Service Engine Optimization"
    ],
    "correctAnswer": 0,
    "explanation": "SEO improves a website's visibility in search engine results."
  },
  {
    "id": "marketing009",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing method sends promotional messages through email?",
    "options": [
      "SMS Marketing",
      "Influencer Marketing",
      "Email Marketing",
      "Affiliate Marketing"
    ],
    "correctAnswer": 2,
    "explanation": "Email marketing communicates directly with customers through email."
  },
  {
    "id": "marketing010",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which of the following helps build long-term customer relationships?",
    "options": [
      "Cold Calling",
      "Customer Relationship Management (CRM)",
      "Price Increase",
      "Random Advertising"
    ],
    "correctAnswer": 1,
    "explanation": "CRM helps businesses manage customer interactions and improve relationships."
  },
  {
    "id": "marketing011",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing approach promotes products through well-known individuals?",
    "options": [
      "Influencer Marketing",
      "Print Marketing",
      "Radio Marketing",
      "Banner Marketing"
    ],
    "correctAnswer": 0,
    "explanation": "Influencer marketing uses individuals with a strong audience to promote products."
  },
  {
    "id": "marketing012",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing channel displays paid advertisements on search engines?",
    "options": [
      "Content Marketing",
      "Email Marketing",
      "Affiliate Marketing",
      "Search Engine Marketing (SEM)"
    ],
    "correctAnswer": 3,
    "explanation": "SEM uses paid advertisements to increase visibility in search engine results."
  },
  {
    "id": "marketing013",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which of the following is the process of identifying customer needs and wants?",
    "options": [
      "Branding",
      "Market Research",
      "Promotion",
      "Advertising"
    ],
    "correctAnswer": 1,
    "explanation": "Market research helps businesses understand customer preferences and market trends."
  },
  {
    "id": "marketing014",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing strategy divides customers into groups based on common characteristics?",
    "options": [
      "Brand Positioning",
      "Target Marketing",
      "Market Segmentation",
      "Mass Marketing"
    ],
    "correctAnswer": 2,
    "explanation": "Market segmentation divides customers into groups based on demographics, behavior, or interests."
  },
  {
    "id": "marketing015",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "What does SWOT stand for in marketing?",
    "options": [
      "Strengths, Weaknesses, Opportunities, Threats",
      "Sales, Work, Operations, Technology",
      "Strategy, Website, Objectives, Targets",
      "System, Workflow, Operations, Team"
    ],
    "correctAnswer": 0,
    "explanation": "SWOT analysis evaluates Strengths, Weaknesses, Opportunities, and Threats."
  },
  {
    "id": "marketing016",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which stage of the sales funnel comes after generating leads?",
    "options": [
      "Awareness",
      "Interest",
      "Purchase",
      "Consideration"
    ],
    "correctAnswer": 3,
    "explanation": "After awareness and interest, potential customers move into the consideration stage."
  },
  {
    "id": "marketing017",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "What is the main purpose of branding?",
    "options": [
      "To reduce production costs",
      "To create a unique identity for a product or company",
      "To manage employee salaries",
      "To prepare financial reports"
    ],
    "correctAnswer": 1,
    "explanation": "Branding helps customers recognize and differentiate a company or product."
  },
  {
    "id": "marketing018",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which metric measures how many people click on an online advertisement?",
    "options": [
      "ROI",
      "Reach",
      "Click-Through Rate (CTR)",
      "Bounce Rate"
    ],
    "correctAnswer": 2,
    "explanation": "CTR measures the percentage of users who click on an advertisement."
  },
  {
    "id": "marketing019",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing method pays partners for successful customer referrals?",
    "options": [
      "Email Marketing",
      "Content Marketing",
      "Social Media Marketing",
      "Affiliate Marketing"
    ],
    "correctAnswer": 3,
    "explanation": "Affiliate marketing rewards partners for generating sales or leads."
  },
  {
    "id": "marketing020",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "What is ROI an abbreviation for?",
    "options": [
      "Return on Investment",
      "Rate of Interest",
      "Revenue on Income",
      "Return on Inventory"
    ],
    "correctAnswer": 0,
    "explanation": "ROI measures the profitability of an investment."
  },
  {
    "id": "marketing021",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing technique encourages customers to purchase immediately using limited-time offers?",
    "options": [
      "Relationship Marketing",
      "Mass Marketing",
      "Promotional Marketing",
      "Guerrilla Marketing"
    ],
    "correctAnswer": 2,
    "explanation": "Promotional marketing uses discounts and limited-time offers to increase sales."
  },
  {
    "id": "marketing022",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing concept focuses on keeping existing customers satisfied?",
    "options": [
      "Lead Generation",
      "Relationship Marketing",
      "Cold Calling",
      "Direct Selling"
    ],
    "correctAnswer": 1,
    "explanation": "Relationship marketing emphasizes long-term customer satisfaction and loyalty."
  },
  {
    "id": "marketing023",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which term refers to the public's recognition of a brand?",
    "options": [
      "Customer Retention",
      "Market Share",
      "Sales Volume",
      "Brand Awareness"
    ],
    "correctAnswer": 3,
    "explanation": "Brand awareness measures how familiar customers are with a brand."
  },
  {
    "id": "marketing024",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which of the following is an example of traditional marketing?",
    "options": [
      "Television Advertisement",
      "Instagram Reel",
      "Google Ads",
      "Email Newsletter"
    ],
    "correctAnswer": 0,
    "explanation": "Television advertisements are a form of traditional marketing."
  },
  {
    "id": "marketing025",
    "field": "Non-IT Field",
    "subject": "Marketing",
    "category": "Marketing",
    "difficulty": "Easy",
    "question": "Which marketing activity involves collecting customer information for future campaigns?",
    "options": [
      "Advertising",
      "Lead Generation",
      "Brand Positioning",
      "Public Relations"
    ],
    "correctAnswer": 1,
    "explanation": "Lead generation collects potential customer information for future marketing and sales activities."
  },
  {
    "id": "sales001",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is the primary goal of sales?",
    "options": [
      "To develop software",
      "To sell products or services to customers",
      "To recruit employees",
      "To manufacture products"
    ],
    "correctAnswer": 1,
    "explanation": "The main objective of sales is to generate revenue by selling products or services."
  },
  {
    "id": "sales002",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Who is a potential customer interested in purchasing a product or service?",
    "options": [
      "Vendor",
      "Supplier",
      "Lead",
      "Distributor"
    ],
    "correctAnswer": 2,
    "explanation": "A lead is a potential customer who has shown interest in a product or service."
  },
  {
    "id": "sales003",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What does CRM stand for?",
    "options": [
      "Customer Relationship Management",
      "Customer Revenue Model",
      "Client Resource Management",
      "Consumer Relation Method"
    ],
    "correctAnswer": 0,
    "explanation": "CRM helps businesses manage customer interactions and relationships."
  },
  {
    "id": "sales004",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which stage comes after identifying a sales lead?",
    "options": [
      "Closing the sale",
      "Customer support",
      "Payment collection",
      "Contacting and qualifying the lead"
    ],
    "correctAnswer": 3,
    "explanation": "After identifying a lead, the salesperson contacts and qualifies the prospect."
  },
  {
    "id": "sales005",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which skill is most important for a successful salesperson?",
    "options": [
      "Programming",
      "Graphic Design",
      "Communication",
      "Accounting"
    ],
    "correctAnswer": 2,
    "explanation": "Strong communication skills help salespeople understand customer needs and build trust."
  },
  {
    "id": "sales006",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is the process of convincing a customer to buy called?",
    "options": [
      "Negotiation",
      "Selling",
      "Recruitment",
      "Promotion"
    ],
    "correctAnswer": 1,
    "explanation": "Selling is the process of persuading customers to purchase products or services."
  },
  {
    "id": "sales007",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which term refers to successfully completing a sale?",
    "options": [
      "Prospecting",
      "Follow-up",
      "Lead Generation",
      "Closing"
    ],
    "correctAnswer": 3,
    "explanation": "Closing is the final step where the customer agrees to purchase."
  },
  {
    "id": "sales008",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is upselling?",
    "options": [
      "Encouraging customers to buy a higher-value product",
      "Reducing product prices",
      "Returning products",
      "Advertising on television"
    ],
    "correctAnswer": 0,
    "explanation": "Upselling encourages customers to purchase a premium version or additional features."
  },
  {
    "id": "sales009",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which sales technique recommends related products to customers?",
    "options": [
      "Cold Calling",
      "Prospecting",
      "Cross-selling",
      "Negotiation"
    ],
    "correctAnswer": 2,
    "explanation": "Cross-selling recommends complementary products to increase sales."
  },
  {
    "id": "sales010",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is the purpose of a sales pitch?",
    "options": [
      "To hire employees",
      "To explain and persuade customers to buy",
      "To prepare invoices",
      "To train staff"
    ],
    "correctAnswer": 1,
    "explanation": "A sales pitch presents the product's value and persuades customers to make a purchase."
  },
  {
    "id": "sales011",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which activity involves searching for potential customers?",
    "options": [
      "Prospecting",
      "Negotiation",
      "Closing",
      "Billing"
    ],
    "correctAnswer": 0,
    "explanation": "Prospecting is the process of identifying potential customers."
  },
  {
    "id": "sales012",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which type of sales involves selling directly to consumers online?",
    "options": [
      "Retail Sales",
      "Wholesale Sales",
      "Door-to-Door Sales",
      "E-commerce Sales"
    ],
    "correctAnswer": 3,
    "explanation": "E-commerce sales are conducted through online platforms."
  },
  {
    "id": "sales013",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Why is follow-up important after a sale?",
    "options": [
      "To increase manufacturing",
      "To build customer relationships and encourage repeat business",
      "To reduce product quality",
      "To increase product prices"
    ],
    "correctAnswer": 1,
    "explanation": "Following up improves customer satisfaction and increases repeat sales."
  },
  {
    "id": "sales014",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which stage of the sales process involves understanding a customer's needs?",
    "options": [
      "Closing",
      "Prospecting",
      "Needs Assessment",
      "Follow-up"
    ],
    "correctAnswer": 2,
    "explanation": "Needs assessment helps the salesperson understand customer requirements before offering a solution."
  },
  {
    "id": "sales015",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What does KPI stand for in sales?",
    "options": [
      "Key Performance Indicator",
      "Key Product Information",
      "Knowledge Process Integration",
      "Key Purchase Index"
    ],
    "correctAnswer": 0,
    "explanation": "KPIs are measurable values used to evaluate sales performance."
  },
  {
    "id": "sales016",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which sales model involves selling products directly to businesses?",
    "options": [
      "B2C",
      "C2C",
      "D2C",
      "B2B"
    ],
    "correctAnswer": 3,
    "explanation": "B2B (Business-to-Business) sales involve selling products or services to other businesses."
  },
  {
    "id": "sales017",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is negotiation in sales?",
    "options": [
      "Delivering products",
      "Discussing terms to reach a mutually beneficial agreement",
      "Hiring employees",
      "Creating advertisements"
    ],
    "correctAnswer": 1,
    "explanation": "Negotiation involves discussing pricing, terms, or conditions to satisfy both the buyer and seller."
  },
  {
    "id": "sales018",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which metric measures the percentage of leads converted into customers?",
    "options": [
      "Customer Satisfaction",
      "Revenue Growth",
      "Conversion Rate",
      "Profit Margin"
    ],
    "correctAnswer": 2,
    "explanation": "Conversion rate measures how many leads become paying customers."
  },
  {
    "id": "sales019",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which type of sales involves selling products directly to individual consumers?",
    "options": [
      "B2B Sales",
      "Wholesale Sales",
      "Industrial Sales",
      "B2C Sales"
    ],
    "correctAnswer": 3,
    "explanation": "B2C (Business-to-Consumer) sales involve selling directly to end customers."
  },
  {
    "id": "sales020",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is the main purpose of handling customer objections?",
    "options": [
      "To resolve customer concerns and increase the chance of a sale",
      "To end the conversation",
      "To reject customer requests",
      "To increase product prices"
    ],
    "correctAnswer": 0,
    "explanation": "Addressing objections helps build trust and move the customer closer to purchasing."
  },
  {
    "id": "sales021",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is a sales target?",
    "options": [
      "A customer complaint",
      "A predetermined sales goal",
      "A marketing campaign",
      "A product catalog"
    ],
    "correctAnswer": 2,
    "explanation": "A sales target is a predefined goal that a salesperson or team aims to achieve."
  },
  {
    "id": "sales022",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which sales approach focuses on maintaining long-term customer relationships?",
    "options": [
      "Cold Calling",
      "Relationship Selling",
      "Hard Selling",
      "Door-to-Door Selling"
    ],
    "correctAnswer": 1,
    "explanation": "Relationship selling focuses on customer satisfaction and long-term loyalty."
  },
  {
    "id": "sales023",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "Which document usually contains customer details and sales activities?",
    "options": [
      "Invoice",
      "Purchase Order",
      "Receipt",
      "CRM Record"
    ],
    "correctAnswer": 3,
    "explanation": "A CRM record stores customer information, communication history, and sales activities."
  },
  {
    "id": "sales024",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is customer retention?",
    "options": [
      "Keeping existing customers satisfied and encouraging repeat business",
      "Finding new suppliers",
      "Recruiting employees",
      "Increasing production capacity"
    ],
    "correctAnswer": 0,
    "explanation": "Customer retention focuses on maintaining long-term relationships with existing customers."
  },
  {
    "id": "sales025",
    "field": "Non-IT Field",
    "subject": "Sales",
    "category": "Sales",
    "difficulty": "Easy",
    "question": "What is sales forecasting?",
    "options": [
      "Calculating employee salaries",
      "Estimating future sales based on historical data and trends",
      "Designing products",
      "Managing inventory only"
    ],
    "correctAnswer": 1,
    "explanation": "Sales forecasting predicts future sales using past performance, market trends, and business data."
  },
  {
    "id": "telecaller001",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the primary responsibility of a telecaller?",
    "options": [
      "To develop software",
      "To communicate with customers over the phone",
      "To manage company accounts",
      "To repair computers"
    ],
    "correctAnswer": 1,
    "explanation": "A telecaller's primary role is to communicate with customers for sales, support, or information."
  },
  {
    "id": "telecaller002",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which skill is most important for a telecaller?",
    "options": [
      "Programming",
      "Graphic Design",
      "Communication Skills",
      "Machine Operation"
    ],
    "correctAnswer": 2,
    "explanation": "Good communication skills help telecallers interact effectively with customers."
  },
  {
    "id": "telecaller003",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What should a telecaller do before making a call?",
    "options": [
      "Review customer details",
      "End the call",
      "Ignore customer information",
      "Send an invoice"
    ],
    "correctAnswer": 0,
    "explanation": "Reviewing customer details helps personalize the conversation."
  },
  {
    "id": "telecaller004",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which quality helps build trust with customers?",
    "options": [
      "Speaking rudely",
      "Interrupting frequently",
      "Ignoring questions",
      "Being polite and professional"
    ],
    "correctAnswer": 3,
    "explanation": "Being polite and professional creates a positive customer experience."
  },
  {
    "id": "telecaller005",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which of the following is an example of active listening?",
    "options": [
      "Talking continuously",
      "Ignoring customer concerns",
      "Paying attention and responding appropriately",
      "Ending the call quickly"
    ],
    "correctAnswer": 2,
    "explanation": "Active listening involves understanding customer concerns before responding."
  },
  {
    "id": "telecaller006",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What should a telecaller do if a customer is upset?",
    "options": [
      "Disconnect the call",
      "Stay calm and listen patiently",
      "Argue with the customer",
      "Ignore the complaint"
    ],
    "correctAnswer": 1,
    "explanation": "Remaining calm and listening patiently helps resolve customer issues."
  },
  {
    "id": "telecaller007",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which document usually contains customer information for telecalling?",
    "options": [
      "Invoice",
      "Balance Sheet",
      "Payroll",
      "CRM Database"
    ],
    "correctAnswer": 3,
    "explanation": "A CRM database stores customer information and interaction history."
  },
  {
    "id": "telecaller008",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the purpose of a telecalling script?",
    "options": [
      "To guide the conversation",
      "To design websites",
      "To calculate salaries",
      "To create advertisements"
    ],
    "correctAnswer": 0,
    "explanation": "A telecalling script helps maintain a structured and professional conversation."
  },
  {
    "id": "telecaller009",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which skill helps a telecaller convince a customer?",
    "options": [
      "Drawing",
      "Singing",
      "Persuasion",
      "Typing Speed"
    ],
    "correctAnswer": 2,
    "explanation": "Persuasion helps explain product benefits and encourage customer decisions."
  },
  {
    "id": "telecaller010",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Why is a positive tone of voice important during a call?",
    "options": [
      "To confuse the customer",
      "To create a friendly and professional impression",
      "To make the call longer",
      "To avoid answering questions"
    ],
    "correctAnswer": 1,
    "explanation": "A positive tone improves customer engagement and trust."
  },
  {
    "id": "telecaller011",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What should a telecaller do after completing a customer call?",
    "options": [
      "Update the CRM or call records",
      "Delete customer details",
      "Ignore the outcome",
      "Turn off the computer"
    ],
    "correctAnswer": 0,
    "explanation": "Updating call records ensures accurate customer information for future interactions."
  },
  {
    "id": "telecaller012",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which metric measures the percentage of successful calls leading to a desired outcome?",
    "options": [
      "Attendance Rate",
      "Call Duration",
      "Customer Rating",
      "Conversion Rate"
    ],
    "correctAnswer": 3,
    "explanation": "Conversion rate measures how many calls result in a successful sale or desired action."
  },
  {
    "id": "telecaller013",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the main objective of follow-up calls?",
    "options": [
      "To maintain customer relationships and provide updates",
      "To avoid customer communication",
      "To increase call duration",
      "To collect employee data"
    ],
    "correctAnswer": 1,
    "explanation": "Follow-up calls help maintain customer relationships and improve satisfaction."
  },
  {
    "id": "telecaller014",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the first step when handling a customer call?",
    "options": [
      "Start selling immediately",
      "Ask for payment",
      "Greet the customer professionally",
      "Transfer the call"
    ],
    "correctAnswer": 2,
    "explanation": "A professional greeting creates a positive first impression and builds rapport."
  },
  {
    "id": "telecaller015",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the purpose of verifying customer details during a call?",
    "options": [
      "To ensure the information is accurate",
      "To increase call duration",
      "To avoid answering questions",
      "To delay the conversation"
    ],
    "correctAnswer": 0,
    "explanation": "Verifying customer details ensures accurate records and secure communication."
  },
  {
    "id": "telecaller016",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What should a telecaller do if they do not know the answer to a customer's question?",
    "options": [
      "Guess the answer",
      "End the call",
      "Ignore the question",
      "Inform the customer and seek the correct information"
    ],
    "correctAnswer": 3,
    "explanation": "If unsure, the telecaller should be honest and obtain the correct information."
  },
  {
    "id": "telecaller017",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is objection handling?",
    "options": [
      "Ending the call quickly",
      "Addressing customer concerns professionally",
      "Ignoring customer feedback",
      "Transferring every call"
    ],
    "correctAnswer": 1,
    "explanation": "Objection handling means understanding and resolving customer concerns to move the conversation forward."
  },
  {
    "id": "telecaller018",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is a lead in telecalling?",
    "options": [
      "A completed sale",
      "A company employee",
      "A potential customer",
      "A customer complaint"
    ],
    "correctAnswer": 2,
    "explanation": "A lead is a person who may be interested in the company's products or services."
  },
  {
    "id": "telecaller019",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which type of call is made to customers who have never interacted with the company before?",
    "options": [
      "Follow-up Call",
      "Support Call",
      "Welcome Call",
      "Cold Call"
    ],
    "correctAnswer": 3,
    "explanation": "Cold calling involves contacting potential customers without prior interaction."
  },
  {
    "id": "telecaller020",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Why is maintaining customer confidentiality important?",
    "options": [
      "To protect customer privacy",
      "To increase call time",
      "To avoid documentation",
      "To reduce sales"
    ],
    "correctAnswer": 0,
    "explanation": "Protecting customer information builds trust and complies with privacy regulations."
  },
  {
    "id": "telecaller021",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which quality helps a telecaller understand customer concerns accurately?",
    "options": [
      "Fast speaking",
      "Interrupting",
      "Active Listening",
      "Multitasking"
    ],
    "correctAnswer": 2,
    "explanation": "Active listening helps understand customer needs before responding."
  },
  {
    "id": "telecaller022",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What should a telecaller do if a customer says they are busy?",
    "options": [
      "Continue speaking",
      "Politely ask for a convenient time to call back",
      "Disconnect immediately",
      "Repeat the same script"
    ],
    "correctAnswer": 1,
    "explanation": "Respecting the customer's time creates a better experience and improves the chances of a future conversation."
  },
  {
    "id": "telecaller023",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "What is the purpose of a callback?",
    "options": [
      "To increase call costs",
      "To avoid customer interaction",
      "To ignore customer requests",
      "To continue the conversation at a suitable time"
    ],
    "correctAnswer": 3,
    "explanation": "Callbacks allow telecallers to reconnect with customers when it is convenient."
  },
  {
    "id": "telecaller024",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which behavior creates a positive customer experience?",
    "options": [
      "Speaking politely and respectfully",
      "Interrupting customers",
      "Using rude language",
      "Ignoring questions"
    ],
    "correctAnswer": 0,
    "explanation": "Professional and respectful communication improves customer satisfaction."
  },
  {
    "id": "telecaller025",
    "field": "Non-IT Field",
    "subject": "Telecaller",
    "category": "Telecaller",
    "difficulty": "Easy",
    "question": "Which metric measures the number of calls successfully handled by a telecaller?",
    "options": [
      "Customer Lifetime Value",
      "Call Volume",
      "Market Share",
      "Inventory Turnover"
    ],
    "correctAnswer": 1,
    "explanation": "Call volume measures the number of calls handled by a telecaller within a given period."
  }
];
