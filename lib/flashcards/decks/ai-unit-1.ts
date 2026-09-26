import type { Flashcard, FlashcardDeck } from "../types";

const cards = [
  {
    "id": "AI-U1-01",
    "front": "Define Artificial Intelligence. Explain its scope, objectives and major areas of application.",
    "back": "Cover: definition → intelligent problem solving (reasoning, learning, perception, language, decision making) → 4-6 real-world applications",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "The syllabus explicitly begins Unit 1 with the definition and scope of AI, while university AI papers repeatedly ask students to define AI and discuss applications.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Do not write only a one-line definition. Give the definition, explain what makes a system intelligent, then give 4-6 applications.",
    "mustInclude": [
      "Definition of AI",
      "AI as a field of intelligent problem solving",
      "Reasoning",
      "Learning",
      "Perception",
      "Language",
      "Decision making",
      "Real-world applications"
    ]
  },
  {
    "id": "AI-U1-02",
    "front": "Explain the major components of Artificial Intelligence and discuss the role of knowledge representation, reasoning, learning, perception and action.",
    "back": "Cover: knowledge representation · reasoning · learning · perception · action: state the function of each",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This is almost directly lifted from IILM Assignment Question 10 and is explicitly included in the Unit 1 syllabus.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Learn the function of every component, not just its definition.",
    "mustInclude": [
      "Knowledge representation",
      "Reasoning",
      "Learning",
      "Perception",
      "Action"
    ],
    "diagramRequired": "Draw a central AI system connected to Perception/Input, Knowledge Representation, Reasoning, Learning and Action/Output."
  },
  {
    "id": "AI-U1-03",
    "front": "Explain the Turing Test. Describe its purpose, working procedure and limitations.",
    "back": "Cover: Alan Turing → purpose → interrogator / human / machine via text → indistinguishability → limitations (e.g. behaviour ≠ understanding)",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "The IILM assignment explicitly asks this, including a limitation. Turing Test questions also recur frequently in university AI papers.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: The limitation is important because IILM explicitly asks for one.",
    "mustInclude": [
      "Alan Turing",
      "Purpose of the test",
      "Human interrogator",
      "Human participant",
      "Machine",
      "Text-based interaction",
      "Indistinguishability criterion",
      "Limitations"
    ],
    "diagramRequired": "Draw the classic Turing Test arrangement: Interrogator → text communication → Human and Machine."
  },
  {
    "id": "AI-U1-04",
    "front": "Discuss the Chinese Room argument. What does it attempt to show about artificial intelligence and understanding?",
    "back": "Cover: Searle → person + rule book → Chinese I/O without understanding → symbol manipulation ≠ understanding → critique of strong AI",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Chinese Room is explicitly listed in the official IILM Unit 1 syllabus, so it should not be skipped merely because it is less common in generic AI question banks.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Know both the argument and what it is arguing against. Do not present it as proof that AI cannot exist.",
    "mustInclude": [
      "John Searle",
      "Basic Chinese Room thought experiment",
      "Person inside the room",
      "Rule book",
      "Input/output behaviour",
      "Difference between symbol manipulation and understanding",
      "Connection with strong AI"
    ],
    "diagramRequired": "Draw: Chinese input → Room/person + rule book → Chinese output."
  },
  {
    "id": "AI-U1-05",
    "front": "Differentiate between Artificial Intelligence and Automation with suitable examples. Is a calculator an AI system? Justify your answer.",
    "back": "AI: reasoning/learning/perception/adaptation · Automation: predefined process execution · Calculator: deterministic rule following → not AI",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This is directly from IILM Assignment Question 3 and is particularly likely to appear because it tests whether you understand the conceptual boundary rather than memorising definitions.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: For the calculator, explain the reasoning rather than simply writing 'No'.",
    "mustInclude": [
      "AI: behaviour requiring reasoning, learning, perception or adaptation",
      "Automation: predefined execution of a process",
      "AI can adapt to varying inputs",
      "Traditional automation generally follows explicitly specified rules",
      "Examples"
    ]
  },
  {
    "id": "AI-U1-06",
    "front": "Differentiate between rational behaviour and intelligent behaviour using the example of a person immediately pulling their hand away after touching a hot stove.",
    "back": "Pulling hand away is rational (goal: avoid injury given sensation) but is a reflex: does not demonstrate complex intelligent reasoning",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "This is directly from IILM Assignment Question 4. It is designed to test the distinction between intelligence and rational action.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: This is an application question. Explain the example instead of giving only definitions.",
    "mustInclude": [
      "Rational action",
      "Goal-directed behaviour",
      "Available information",
      "Intelligence as a broader capability",
      "Why a reflex action can be rational without demonstrating complex intelligence"
    ]
  },
  {
    "id": "AI-U1-07",
    "front": "Classify the following systems as AI, automation, or systems with significant AI characteristics, and justify each classification: (a) supermarket barcode scanner, (b) web search engine, (c) voice-activated telephone menu, (d) internet routing algorithm.",
    "back": "(a) barcode scanner → automation · (b) search engine → significant AI · (c) voice menu → mainly automation / limited AI · (d) routing → algorithmic automation (some adaptive traits): justify each",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "This is directly from IILM Assignment Question 5 and tests whether you can apply the definition of AI to real systems.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: The justification is more important than the label."
  },
  {
    "id": "AI-U1-08",
    "front": "Why would evolution tend to result in systems that act rationally? What goals are such systems designed to achieve?",
    "back": "Selection favours behaviours that achieve survival/reproduction goals given environmental feedback: rational action improves fitness",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Directly from IILM Assignment Question 6 and connects rational behaviour with goal achievement and survival.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "mustInclude": [
      "Survival",
      "Adaptation",
      "Goal achievement",
      "Environmental feedback",
      "Selection for useful behaviour"
    ]
  },
  {
    "id": "AI-U1-09",
    "front": "Define intelligence, Artificial Intelligence, agent, rationality and logical reasoning.",
    "back": "Intelligence · AI · agent · rationality · logical reasoning: one precise 2-3 line definition each",
    "priority": "B",
    "cardType": "short_answer",
    "whyExists": "These five definitions are explicitly grouped together in IILM Assignment Question 1 and are ideal short-answer/exam-opening questions.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Prepare one precise 2-3 line definition for each."
  },
  {
    "id": "AI-U1-10",
    "front": "Differentiate between intelligence and rationality.",
    "back": "Intelligence: broader cognitive capability · Rationality: choosing appropriate action given goals and available information (not omniscience)",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "This distinction appears repeatedly in the IILM assignment's conceptual questions and is foundational to the course's treatment of intelligent behaviour.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Remember: rationality is about selecting an appropriate action given goals and available information; it does not require omniscience."
  },
  {
    "id": "AI-U1-11",
    "front": "What is the difference between rationality and omniscience?",
    "back": "Omniscience = knowing everything (incl. outcomes) · Rationality = best expected action given what is known: a rational agent need not be omniscient",
    "priority": "B",
    "cardType": "short_answer",
    "whyExists": "This distinction is a common AI examination concept and prevents a major conceptual mistake: a rational system does not need to know the future or everything about its environment.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Prepare a one-example explanation."
  },
  {
    "id": "AI-U1-12",
    "front": "What is problem reduction in Artificial Intelligence? Explain how a complex problem can be divided into smaller sub-problems.",
    "back": "Break a complex problem into simpler sub-problems (AND/OR-style decomposition); solving sub-problems solves the original: use a tree example",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Problem reduction is explicitly included in IILM Unit 1 and directly asked in Assignment Question 7.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Be able to draw the decomposition tree.",
    "mustInclude": [
      "Definition",
      "Complex problem",
      "Sub-problems",
      "Reduction of the original problem",
      "AND/OR style decomposition at a conceptual level",
      "Example"
    ],
    "diagramRequired": "Use a tree showing Problem → Sub-problem 1 + Sub-problem 2 → smaller sub-problems."
  },
  {
    "id": "AI-U1-13",
    "front": "Explain State Space Search in Artificial Intelligence. Define state, initial state, goal state and operator, and illustrate the concept with a suitable example.",
    "back": "State · state space · initial state · goal state · operators · path/solution · search: show how they work together with an example",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This is directly from IILM Assignment Question 8 and is one of the most important problem-solving concepts in the unit.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Do not merely define the four terms. Show how they work together.",
    "mustInclude": [
      "State",
      "State space",
      "Initial state",
      "Goal state",
      "Operators/actions",
      "Path/solution",
      "Search process"
    ],
    "diagramRequired": "Draw a state-space tree/graph showing initial state, intermediate states, operators and goal state."
  },
  {
    "id": "AI-U1-14",
    "front": "Represent a simple problem as a state-space search by specifying its state space, initial state, goal state and operators.",
    "back": "Specify state space, initial state, goal state, operators for 8-puzzle / water-jug / tic-tac-toe / route-finding: practise the method",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "This converts the previous theory into the application skill an exam can test with a completely new problem.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Practise the method, not one memorised example.",
    "mustInclude": [
      "State space",
      "Initial state",
      "Goal state",
      "Operators",
      "Worked example"
    ]
  },
  {
    "id": "AI-U1-15",
    "front": "Explain the problem-solving algorithm used in Artificial Intelligence. Describe the major steps involved in solving a problem using search.",
    "back": "Goal formulation → problem formulation (initial, actions, transition, goal test, path cost) → search → solution/action sequence → execution",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Directly from IILM Assignment Question 9 and explicitly named in the official syllabus.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "A+: Must prepare thoroughly. Directly aligned with IILM material and/or strong exam pattern. Exam tip: Memorise the sequence as a flow, not as disconnected definitions.",
    "mustInclude": [
      "Goal formulation",
      "Problem formulation",
      "Initial state",
      "Actions/operators",
      "Transition model",
      "Goal test",
      "Path cost where applicable",
      "Search",
      "Solution/action sequence"
    ],
    "diagramRequired": "Draw: Goal formulation → Problem formulation → State-space representation → Search → Solution → Execution."
  },
  {
    "id": "AI-U1-16",
    "front": "Differentiate between problem formulation and problem solving in AI.",
    "back": "Formulation: specify initial state, actions, goal test, etc. · Solving: search for an action sequence that reaches a goal",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "This is a natural exam variation of the IILM problem-solving question and tests whether you understand where search begins.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "mustInclude": [
      "Problem formulation specifies the problem",
      "Problem solving searches for a sequence of actions",
      "Initial state",
      "Actions",
      "Goal test",
      "Solution"
    ]
  },
  {
    "id": "AI-U1-17",
    "front": "What is a state space? How is it different from a single state?",
    "back": "State = one configuration · State space = set of all possible configurations reachable via operators",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "State-space terminology is explicitly required by the syllabus and assignment and is a common short-answer variation.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: State = one configuration; state space = collection of possible configurations."
  },
  {
    "id": "AI-U1-18",
    "front": "What are operators in state-space search? Explain their role with an example.",
    "back": "Operators = allowed actions transforming one state into another (e.g. slide a tile in 8-puzzle)",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "The assignment explicitly asks for operators as part of state-space formulation.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Think of an operator as an allowed action that transforms one state into another."
  },
  {
    "id": "AI-U1-19",
    "front": "Explain the evolution and historical development of Artificial Intelligence.",
    "back": "Timeline: early foundations → Turing 1950 → Dartmouth 1956 → symbolic AI → expert systems → AI winters → ML → modern AI",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "History/evolution is explicitly included in the official Unit 1 syllabus and is a standard introductory AI examination question.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Learn it as a timeline with 6-8 milestones rather than memorising a paragraph.",
    "mustInclude": [
      "Early foundations",
      "Alan Turing",
      "1950 Turing paper/test",
      "1956 Dartmouth workshop and emergence of AI as a field",
      "Symbolic AI",
      "Expert systems",
      "AI winters",
      "Machine learning",
      "Modern AI"
    ]
  },
  {
    "id": "AI-U1-20",
    "front": "Who coined the term Artificial Intelligence, and in what historical context?",
    "back": "John McCarthy coined \"Artificial Intelligence\" in the Dartmouth proposal/workshop context (1955-56)",
    "priority": "B",
    "cardType": "short_answer",
    "whyExists": "This is a common introductory examination fact and fits the historical context section of the syllabus.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Remember John McCarthy and the Dartmouth proposal/workshop context."
  },
  {
    "id": "AI-U1-21",
    "front": "Explain the difference between the 'acting humanly', 'thinking humanly', 'thinking rationally' and 'acting rationally' approaches to AI.",
    "back": "2×2: thinking/acting humanly (cognitive science / Turing Test) vs thinking/acting rationally (laws of thought / rational agents)",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "This is foundational AIMA material and gives you a way to answer broader 'approaches to AI' questions even though IILM's assignment focuses more heavily on rational behaviour.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Know one sentence and one example for each approach.",
    "diagramRequired": "Make a 2×2 grid: Human-like vs Rational + Thinking vs Acting."
  },
  {
    "id": "AI-U1-22",
    "front": "Explain the difference between AI that simulates human behaviour and AI that seeks rational behaviour.",
    "back": "Human-behaviour AI aims to imitate people (Turing-test style) · Rational AI aims at goal-directed optimal action given information",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "This is a likely conceptual follow-up to the Turing Test and rationality portions of Unit 1.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Connect human imitation with the Turing-test approach and rational action with goal-directed decision making."
  },
  {
    "id": "AI-U1-23",
    "front": "What are the major goals or capabilities of an AI system?",
    "back": "Perception · reasoning · learning · planning/problem solving · language · decision making · action",
    "priority": "B",
    "cardType": "short_answer",
    "whyExists": "Useful for short-answer questions covering the scope of AI.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "mustInclude": [
      "Perception",
      "Reasoning",
      "Learning",
      "Planning/problem solving",
      "Language",
      "Decision making",
      "Action"
    ]
  },
  {
    "id": "AI-U1-24",
    "front": "Differentiate between AI, machine learning and automation.",
    "back": "AI = broad intelligent systems · ML = learning from data (subset of AI) · Automation = predefined process execution (not necessarily AI)",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Although machine learning is developed more deeply later, this comparison is useful for the introductory AI-versus-automation theme of the IILM course.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Do not say all automation is AI or all AI is machine learning."
  },
  {
    "id": "AI-U1-25",
    "front": "Explain how an AI system can use perception, knowledge, reasoning and action to solve a problem.",
    "back": "Environment → perception → knowledge/representation → reasoning/decision → action → environment (e.g. AV or diagnosis)",
    "priority": "B",
    "cardType": "long_answer",
    "whyExists": "This integrates the 'major components of AI' into one system rather than testing isolated definitions.",
    "diagram": true,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Use one real-world example such as an autonomous vehicle or medical diagnosis system.",
    "diagramRequired": "Environment → Perception → Knowledge/Representation → Reasoning/Decision → Action → Environment."
  },
  {
    "id": "AI-U1-26",
    "front": "What is logical reasoning in AI?",
    "back": "Drawing valid conclusions from premises/knowledge using formal rules (e.g. deduction) to support decisions",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Explicitly included in the IILM assignment's definition question.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Keep it to 2-3 precise lines."
  },
  {
    "id": "AI-U1-27",
    "front": "What is an AI problem?",
    "back": "A task with a goal, a set of possible states, and actions that transform states toward a goal",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Common university variation and useful for connecting AI with state-space search.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Mention a goal, possible states and actions that can transform states."
  },
  {
    "id": "AI-U1-28",
    "front": "What is a solution in state-space search?",
    "back": "An action/operator sequence that takes the initial state to a goal state",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Important terminology for problem-solving questions.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: A solution is an action/operator sequence that takes the initial state to a goal state."
  },
  {
    "id": "AI-U1-29",
    "front": "What is a goal state and what is a goal test?",
    "back": "Goal state = desired configuration · Goal test = procedure that checks whether a state satisfies the objective",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Likely short-answer variation from the state-space section.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: Goal state is the desired configuration; goal test determines whether a state satisfies the objective."
  },
  {
    "id": "AI-U1-30",
    "front": "What is a state transition in AI problem solving?",
    "back": "An operator/action transforms one state into another valid state (a transition in the state space)",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Useful terminology for understanding state-space diagrams and operators.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment",
      "IILM Unit 1 notes"
    ],
    "priorityNote": "Exam tip: An operator/action transforms one state into another valid state."
  },
  {
    "id": "AI-U1-D1",
    "front": "Draw and label: Turing Test.",
    "back": "Interrogator → text channels → Human and Machine (no direct sight/voice).",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: Turing Test supports high-value long answers.",
    "mustInclude": [
      "Human interrogator",
      "Text communication",
      "Human",
      "Machine"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Human interrogator · Text communication · Human · Machine",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ],
    "priorityNote": "A+: Core Unit 1 diagram. Practise from memory."
  },
  {
    "id": "AI-U1-D2",
    "front": "Draw and label: Chinese Room.",
    "back": "Chinese input → Room (person + rule book) → Chinese output.",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: Chinese Room supports high-value long answers.",
    "mustInclude": [
      "Chinese input",
      "Person/rule book inside room",
      "Chinese output"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Chinese input · Person/rule book inside room · Chinese output",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ]
  },
  {
    "id": "AI-U1-D3",
    "front": "Draw and label: AI components.",
    "back": "Central AI system linked to Perception, KR, Reasoning, Learning, Action.",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: AI components supports high-value long answers.",
    "mustInclude": [
      "Perception",
      "Knowledge representation",
      "Reasoning",
      "Learning",
      "Action"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Perception · Knowledge representation · Reasoning · Learning · Action",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ],
    "priorityNote": "A+: Core Unit 1 diagram. Practise from memory."
  },
  {
    "id": "AI-U1-D4",
    "front": "Draw and label: State-space search.",
    "back": "Tree/graph: initial → intermediate via operators → goal.",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: State-space search supports high-value long answers.",
    "mustInclude": [
      "Initial state",
      "Operators",
      "Intermediate states",
      "Goal state"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Initial state · Operators · Intermediate states · Goal state",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ],
    "priorityNote": "A+: Core Unit 1 diagram. Practise from memory."
  },
  {
    "id": "AI-U1-D5",
    "front": "Draw and label: Problem reduction.",
    "back": "Problem → Sub-problem 1 + Sub-problem 2 → smaller sub-problems.",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: Problem reduction supports high-value long answers.",
    "mustInclude": [
      "Original problem",
      "Sub-problems",
      "Further decomposition"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Original problem · Sub-problems · Further decomposition",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ],
    "priorityNote": "A+: Core Unit 1 diagram. Practise from memory."
  },
  {
    "id": "AI-U1-D6",
    "front": "Draw and label: Problem-solving flow.",
    "back": "Goal formulation → Problem formulation → Search → Solution → Execution.",
    "priority": "A",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: Problem-solving flow supports high-value long answers.",
    "mustInclude": [
      "Goal formulation",
      "Problem formulation",
      "Search",
      "Solution",
      "Execution"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Goal formulation · Problem formulation · Search · Solution · Execution",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ],
    "priorityNote": "A+: Core Unit 1 diagram. Practise from memory."
  },
  {
    "id": "AI-U1-D7",
    "front": "Draw and label: Four approaches to AI.",
    "back": "2×2 grid: Human-like vs Rational × Thinking vs Acting.",
    "priority": "B",
    "cardType": "exam_method",
    "whyExists": "Diagram practice for Unit 1: Four approaches to AI supports high-value long answers.",
    "mustInclude": [
      "Thinking humanly",
      "Acting humanly",
      "Thinking rationally",
      "Acting rationally"
    ],
    "diagram": true,
    "diagramRequired": "Must show: Thinking humanly · Acting humanly · Thinking rationally · Acting rationally",
    "sources": [
      "IILM Unit 1 syllabus",
      "IILM Unit 1 Assignment"
    ]
  },
  {
    "id": "AI-U1-R1",
    "front": "Last 30-minute revision: what should you recall before the Unit 1 exam?",
    "back": "Definition/scope · Turing Test + limitation · Chinese Room · AI vs automation · rationality vs intelligence · AI components · problem reduction · state-space terms · problem-solving algorithm · history timeline · four approaches · six core diagrams",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Final rapid-recall checklist for Unit 1.",
    "answer": [
      "Definition and scope of AI",
      "Turing Test + limitation",
      "Chinese Room",
      "AI vs automation",
      "Rationality vs intelligence",
      "AI components",
      "Problem reduction",
      "State-space: state, initial state, goal, operator",
      "Problem-solving algorithm",
      "AI history timeline",
      "Four approaches to AI",
      "All six core diagrams"
    ],
    "diagram": false,
    "sources": [
      "IILM Unit 1 exam prep"
    ]
  },
  {
    "id": "AI-U1-B1",
    "front": "Unit 1 boundary: which topics should you NOT overprepare as Unit 1 core?",
    "back": "Leave for Unit 2: BFS, DFS, hill climbing, best-first, A*, AO*, detailed agent types, detailed KR techniques",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "The IILM syllabus places intelligent agents and named search algorithms in Unit 2: protect Unit 1 revision time.",
    "answer": [
      "BFS / DFS",
      "Hill climbing",
      "Best-first / A* / AO*",
      "Detailed intelligent-agent types",
      "Knowledge representation techniques"
    ],
    "priorityNote": "Revision guardrail: study these in Unit 2, not as Unit 1 core.",
    "diagram": false,
    "sources": [
      "IILM Unit 1 syllabus"
    ]
  }
] as Flashcard[];

export const artificialIntelligenceUnit1: FlashcardDeck = {
  courseSlug: "artificial-intelligence",
  courseName: "Artificial Intelligence",
  semesterSlug: "1stsem",
  unitSlug: "unit-1",
  unitLabel: "Unit 1",
  title: "Foundations of AI & Automation: Unit 1",
  courseCode: "Foundations of AI & Automation: B.Tech CSE Sem 1",
  purpose: "Exam preparation + revision: Introduction to Artificial Intelligence",
  focus: ["IILM Unit 1 syllabus & assignment", "Definition, scope & AI components", "Turing Test & Chinese Room", "AI vs automation & rationality", "Problem reduction & state-space search", "AIMA approaches as supporting depth"],
  ready: true,
  minimumExamSet: ["AI-U1-01", "AI-U1-02", "AI-U1-03", "AI-U1-04", "AI-U1-05", "AI-U1-06", "AI-U1-12", "AI-U1-13", "AI-U1-15", "AI-U1-19", "AI-U1-21", "AI-U1-25"],
  diagramSet: ["Turing Test", "Chinese Room", "AI components", "State-space search", "Problem reduction", "Problem-solving flow", "Four approaches to AI"],
  cards,
};
