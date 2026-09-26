import type { Flashcard, FlashcardDeck } from "../types";

const cards = [
  {
    "id": "AC1-01",
    "front": "Evaluate an algebraic limit producing the indeterminate form 0/0 by factorisation and cancellation.",
    "back": "Factor numerator/denominator, cancel common factors, then substitute. Practice: (x^2-a^2)/(x-a), (x^3-a^3)/(x-a), other 0/0 rationals.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Tests the fundamental computational skill required for the limits portion of the IILM syllabus.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "(x^2-a^2)/(x-a)",
      "(x^3-a^3)/(x-a)",
      "rational expressions producing 0/0"
    ]
  },
  {
    "id": "AC1-02",
    "front": "Evaluate limits involving standard trigonometric limits.",
    "back": "lim x->0 sin x/x = 1 · lim x->0 tan x/x = 1 · lim x->0 (1-cos x)/x^2 = 1/2",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Standard limits are the basic tools behind continuity and differentiation.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "mustInclude": [
      "lim x->0 sin x/x = 1",
      "lim x->0 tan x/x = 1",
      "lim x->0 (1-cos x)/x^2 = 1/2"
    ]
  },
  {
    "id": "AC1-03",
    "front": "Define the left-hand limit and right-hand limit and state the condition for the existence of a limit.",
    "back": "LHL = lim x->a- f(x), RHL = lim x->a+ f(x). Limit exists iff LHL = RHL (finite).",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Short-answer theory directly supporting the limits topic.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-04",
    "front": "Define continuity of f(x) at x=a and state all three conditions for continuity.",
    "back": "f continuous at a iff: (1) f(a) exists, (2) lim x->a f(x) exists, (3) lim x->a f(x) = f(a)",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Continuity is explicitly listed in the IILM Unit 1 syllabus and is a required hypothesis for the mean-value theorems.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "f(a) exists",
      "lim x->a f(x) exists",
      "lim x->a f(x) = f(a)"
    ]
  },
  {
    "id": "AC1-05",
    "front": "Test the continuity of a piecewise-defined function at a specified point.",
    "back": "Method: LHL → RHL → f(a) → compare. Continuous only if all three agree.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This converts the definition into an exam-solving problem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "LHL",
      "RHL",
      "f(a)",
      "Compare"
    ]
  },
  {
    "id": "AC1-06",
    "front": "Define differentiability of f(x) at x=a and explain why differentiability implies continuity.",
    "back": "f differentiable at a if lim h->0 [f(a+h)-f(a)]/h exists. Differentiability => continuity (prove via limit of increment).",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Differentiability is explicitly part of Unit 1 and is essential for Rolle and LMVT.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-07",
    "front": "Test differentiability of a piecewise function at a specified point using left and right derivatives.",
    "back": "Compute left derivative and right derivative; differentiable iff both exist and are equal.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This is the natural numerical counterpart to the differentiability definition.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "Calculate left derivative",
      "Calculate right derivative",
      "Compare"
    ]
  },
  {
    "id": "AC1-08",
    "front": "Explain the relationship between continuity and differentiability. Give an example of a function that is continuous but not differentiable.",
    "back": "Differentiable => continuous; converse false. Classic: |x| continuous at 0 but not differentiable there.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "A classic conceptual distinction and useful for theorem-condition questions.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "Example: |x| at x=0"
  },
  {
    "id": "AC1-09",
    "front": "Find the nth derivative of e^(ax).",
    "back": "D^n(e^(ax)) = a^n e^(ax)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Basic standard-function pattern from successive differentiation.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "D^n(e^(ax)) = a^n e^(ax)"
  },
  {
    "id": "AC1-10",
    "front": "Find the nth derivative of sin(ax) and cos(ax).",
    "back": "D^n(sin ax)=a^n sin(ax+n*pi/2) · D^n(cos ax)=a^n cos(ax+n*pi/2)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "One of the core standard nth-derivative patterns.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": [
      "D^n(sin ax)=a^n sin(ax+n*pi/2)",
      "D^n(cos ax)=a^n cos(ax+n*pi/2)"
    ]
  },
  {
    "id": "AC1-11",
    "front": "Find the nth derivative of log x.",
    "back": "D^n(log x)=(-1)^(n-1) (n-1)! / x^n",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Standard higher-order derivative problem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "D^n(log x)=(-1)^(n-1)(n-1)!/x^n"
  },
  {
    "id": "AC1-12",
    "front": "Find the nth derivative of 1/x or 1/(ax+b).",
    "back": "D^n(1/x)=(-1)^n n! / x^(n+1); for 1/(ax+b) scale by a^n accordingly.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Tests factorial/sign patterns in higher derivatives.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "D^n(1/x)=(-1)^n n!/x^(n+1)"
  },
  {
    "id": "AC1-13",
    "front": "Find the nth derivative of x^m.",
    "back": "D^n(x^m)= m!/(m-n)! x^(m-n) for n <= m (and 0 for n > m if m integer >=0)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Essential polynomial nth-derivative pattern and frequently used inside Leibniz problems.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "D^n(x^m)=m!/(m-n)! x^(m-n), for n<=m"
  },
  {
    "id": "AC1-14",
    "front": "Find the nth derivative of a product such as x^2 e^(3x).",
    "back": "Use Leibniz: D^n(uv)=Sum C(n,r) u^(n-r) v^r. For x^2 e^(3x), polynomial derivatives vanish after order 2.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This is a much more exam-relevant test of successive differentiation than simply differentiating e^x repeatedly.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master. Skill: Recognise and apply Leibniz theorem."
  },
  {
    "id": "AC1-15",
    "front": "Find the nth derivative of sin(ax)cos(bx).",
    "back": "Product-to-sum: sin A cos B = [sin(A+B)+sin(A-B)]/2, then apply D^n of sine.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Tests transformation of a product followed by the standard nth derivative formula.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "Use product-to-sum",
      "Convert into sine terms",
      "Apply nth derivative formula"
    ]
  },
  {
    "id": "AC1-16",
    "front": "State and prove Leibniz theorem for the nth derivative of a product.",
    "back": "State: D^n(uv)=Sum_{r=0}^n C(n,r) u^(n-r) v^r. Prove by induction on n.",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This is a major higher-order differentiation theorem and is strongly represented in engineering mathematics material.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "D^n(uv)=Sum C(n,r) u^(n-r) v^r"
  },
  {
    "id": "AC1-17",
    "front": "Using Leibniz theorem, find the nth derivative of x^m e^(ax).",
    "back": "Apply Leibniz with u=x^m, v=e^(ax). Derivatives of x^m stop after r=m.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This is the principal application problem for Leibniz theorem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master. Exam skill: Exploit the fact that derivatives of x^m eventually become zero."
  },
  {
    "id": "AC1-18",
    "front": "Use Leibniz theorem to find a higher derivative of a product involving a polynomial and log x, sin x or e^x.",
    "back": "Same Leibniz pattern with poly * log x / sin x / e^x: expand sum until poly derivatives vanish.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Prevents preparation from being tied to one memorised example.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-19",
    "front": "Given a function such as y=a cos(log x)+b sin(log x), derive the differential equation satisfied by y.",
    "back": "Differentiate y repeatedly, eliminate a,b (or parameters) to get a DE in y and its derivatives. Example pattern: y=a cos(log x)+b sin(log x).",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Tests the engineering-mathematics technique of converting a complicated function into a differential relation.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-20",
    "front": "From the differential equation obtained for a function, derive the recurrence relation involving its higher derivatives.",
    "back": "From the DE, differentiate further and rearrange into a recurrence relating y_n, y_(n-1), ...",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "This is the step students often miss: the question may continue beyond the first differential equation.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-21",
    "front": "State Rolle's theorem and explain all three conditions required for its application.",
    "back": "If f continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then exists c in (a,b) with f'(c)=0.",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Directly within the IILM syllabus and a standard theorem question.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "continuous on [a,b]",
      "differentiable on (a,b)",
      "f(a)=f(b)"
    ]
  },
  {
    "id": "AC1-22",
    "front": "Verify Rolle's theorem for a specified function on [a,b] and find the value of c.",
    "back": "Check continuity, differentiability, f(a)=f(b); find f'; solve f'(c)=0; verify a<c<b.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "One of the most important theorem-based numerical patterns.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "Check continuity",
      "Check differentiability",
      "Check equal endpoint values",
      "Find f'(x)",
      "Solve f'(c)=0",
      "Verify a<c<b"
    ]
  },
  {
    "id": "AC1-23",
    "front": "Given a function and interval, determine whether Rolle's theorem can be applied. If not, identify the failed condition.",
    "back": "Check hypotheses first. If any fails (continuity, differentiability, or f(a)=f(b)), state which; do not solve f'(c)=0.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This is more important than it looks: an exam can test the hypotheses instead of simply giving a theorem-friendly problem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master. Exam trap: Do not immediately solve f'(c)=0."
  },
  {
    "id": "AC1-24",
    "front": "Explain the geometrical interpretation of Rolle's theorem.",
    "back": "There is a point in (a,b) where the tangent is horizontal (parallel to the chord joining endpoints with equal heights).",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Useful for a short theory question and reinforces the theorem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-25",
    "front": "State Lagrange's Mean Value Theorem and its conditions.",
    "back": "If continuous on [a,b] and differentiable on (a,b), then exists c in (a,b) with f'(c)=[f(b)-f(a)]/(b-a).",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Directly specified in the IILM syllabus and a major theorem in the unit.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "answerPattern": "f'(c)=[f(b)-f(a)]/(b-a)"
  },
  {
    "id": "AC1-26",
    "front": "Verify Lagrange's Mean Value Theorem for a given function on a specified interval and find c.",
    "back": "Check conditions → compute slope [f(b)-f(a)]/(b-a) → set f'(c) equal → verify c in (a,b).",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "One of the highest-value numerical problem types in this unit.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "Check continuity",
      "Check differentiability",
      "Compute [f(b)-f(a)]/(b-a)",
      "Compute f'(x)",
      "Equate",
      "Check c in (a,b)"
    ]
  },
  {
    "id": "AC1-27",
    "front": "Verify LMVT for a polynomial function on a given interval.",
    "back": "Same LMVT method on a polynomial; practice at least two intervals/functions.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Polynomial LMVT questions are computationally clean and are common university exam forms.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "Practice: Use at least two different polynomial examples."
  },
  {
    "id": "AC1-28",
    "front": "Differentiate between Rolle's theorem and Lagrange's Mean Value Theorem.",
    "back": "Rolle: f(a)=f(b) and concludes f'(c)=0. LMVT: no equal-endpoint requirement; concludes f'(c)= chord slope.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "A natural theory question and helps prevent theorem-selection mistakes.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-29",
    "front": "Show that Rolle's theorem is a special case of Lagrange's Mean Value Theorem.",
    "back": "If f(a)=f(b), LMVT gives f'(c)=0, which is Rolle's conclusion. So Rolle is LMVT with zero chord slope.",
    "priority": "B",
    "cardType": "derivation",
    "whyExists": "A concise proof question that demonstrates conceptual understanding.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "Key step: When f(a)=f(b), the LMVT slope becomes zero."
  },
  {
    "id": "AC1-30",
    "front": "State Taylor's theorem for a function of one variable and write its expansion with the remainder term.",
    "back": "Taylor: f(x)=f(a)+f'(a)(x-a)+...+f^(n)(a)/n! (x-a)^n + R_n(x). State remainder form used in your course.",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Taylor's theorem is explicitly the final major topic in the current IILM Unit 1 syllabus.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-31",
    "front": "Expand a function about x=a using Taylor's theorem up to a specified degree.",
    "back": "Compute f(a), f'(a), ..., up to required order; substitute into Taylor formula in powers of (x-a).",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This is the central computational problem for Taylor's theorem.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master.",
    "mustInclude": [
      "Find f(a)",
      "Find f'(a)",
      "Find f''(a)",
      "Continue to required order",
      "Substitute in Taylor formula"
    ]
  },
  {
    "id": "AC1-32",
    "front": "Expand 1/x about x=2 using Taylor's theorem up to the required term.",
    "back": "Expand 1/x about x=2: f(2), f', f'', ... then powers of (x-2).",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Excellent representative problem because the expansion point is not zero.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-33",
    "front": "Expand ln(1+x) by Maclaurin's theorem up to the term containing x^5.",
    "back": "Maclaurin of ln(1+x) up to x^5: x - x^2/2 + x^3/3 - x^4/4 + x^5/5 (+ remainder if asked).",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Classic one-variable Taylor/Maclaurin problem and a high-value pattern for the unit.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-34",
    "front": "Expand e^x cos x by Maclaurin's theorem up to a specified power of x.",
    "back": "Find successive derivatives of e^x cos x at 0 (or multiply known series) up to the required power.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Important composite-function series problem and repeatedly used in engineering mathematics.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "A+: Must solve/master."
  },
  {
    "id": "AC1-35",
    "front": "Expand e^x sin x by Maclaurin's theorem up to a specified power of x.",
    "back": "Same technique as e^x cos x with e^x sin x; track the derivative cycle carefully.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Tests the same core technique with a different derivative cycle.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-36",
    "front": "Expand a polynomial or elementary function in ascending powers of (x-a).",
    "back": "Write expansion in ascending powers of (x-a), not merely powers of x.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Tests whether you understand that Taylor expansion about a requires powers of (x-a), not merely x.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-37",
    "front": "Write the standard Maclaurin expansions of e^x, sin x, cos x, ln(1+x) and tan^-1x.",
    "back": "e^x, sin x, cos x, ln(1+x), tan^{-1}x standard Maclaurin series (memorise leading terms).",
    "priority": "B",
    "cardType": "formula_revision",
    "whyExists": "These standard series dramatically reduce calculation time in composite expansions.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-38",
    "front": "Differentiate between Taylor series and Maclaurin series.",
    "back": "Maclaurin series is Taylor expansion about x=0 (powers of x).",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Short-answer concept.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ],
    "priorityNote": "Key point: Maclaurin is Taylor expansion about x=0."
  },
  {
    "id": "AC1-39",
    "front": "What is the remainder term in Taylor's theorem and why is it included?",
    "back": "Remainder R_n measures the error after n terms; makes the finite Taylor formula exact.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Tests understanding of the difference between an exact finite expansion with remainder and an infinite series.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-40",
    "front": "Write the statements/formulas of Rolle's theorem, LMVT and Taylor's theorem.",
    "back": "Rolle: f'(c)=0 under conditions. LMVT: f'(c)=[f(b)-f(a)]/(b-a). Taylor: expansion + remainder about a.",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Final 5-minute revision card.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1",
      "One Variable Calculus"
    ]
  },
  {
    "id": "AC1-R1",
    "front": "Highest-priority Unit 1 problem archetypes: list them from memory.",
    "back": "nth derivative (standard + product) · Leibniz · DE from y · higher-derivative recurrence · Rolle verify/non-apply · LMVT verify · Taylor about nonzero a · Maclaurin · composite Maclaurin",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Rapid recall of the exam problem shapes that matter most in Unit 1.",
    "answer": [
      "nth derivative of standard functions",
      "nth derivative of product",
      "Leibniz theorem",
      "differential equation from a given y",
      "higher-derivative recurrence relation",
      "Rolle verification",
      "Rolle non-applicability",
      "LMVT verification",
      "Taylor expansion about a non-zero point",
      "Maclaurin expansion",
      "composite Maclaurin expansion"
    ],
    "diagram": false,
    "sources": [
      "IILM Applied Calculus Unit 1"
    ]
  },
  {
    "id": "AC1-B1",
    "front": "Unit 1 boundary: which topics should you NOT mix into One Variable Calculus revision?",
    "back": "Leave for later units: partial differentiation, Euler homogeneous, total derivatives, Jacobians, 2-var max/min, Lagrange multipliers, gradient/Hessian, optimization algorithms, multiple integrals, vector calculus.",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "These belong to later IILM Applied Calculus units (Unit 2+). Protect Unit 1 revision time.",
    "answer": [
      "Partial differentiation",
      "Euler theorem for homogeneous functions",
      "Total derivatives / Jacobians",
      "Maxima/minima of two variables",
      "Lagrange multipliers / gradient / Hessian",
      "Gradient descent / Newton optimization",
      "Double/triple integration",
      "Vector calculus"
    ],
    "priorityNote": "Revision guardrail: Unit 2 starts two-variable calculus; Unit 3 optimization; Unit 4 multiple integration; Unit 5 vector calculus.",
    "diagram": false,
    "sources": [
      "IILM Applied Calculus syllabus"
    ]
  }
] as Flashcard[];

export const appliedCalculusUnit1: FlashcardDeck = {
  courseSlug: "applied-calculus",
  courseName: "Applied Calculus",
  semesterSlug: "1stsem",
  unitSlug: "unit-1",
  unitLabel: "Unit 1",
  title: "Applied Calculus: Unit 1",
  courseCode: "Applied Calculus: B.Tech CSE Sem 1",
  purpose: "Exam preparation + revision: One Variable Calculus",
  focus: ["Limits, continuity & differentiability", "Successive differentiation & Leibniz theorem", "Rolle's theorem & LMVT", "Taylor & Maclaurin expansions", "IILM Unit 1 one-variable syllabus"],
  ready: true,
  minimumExamSet: ["AC1-05", "AC1-07", "AC1-10", "AC1-14", "AC1-15", "AC1-16", "AC1-17", "AC1-19", "AC1-21", "AC1-22", "AC1-23", "AC1-25", "AC1-26", "AC1-28", "AC1-30", "AC1-32", "AC1-33", "AC1-34", "AC1-35"],
  formulaSheet: ["lim x->0 sin x/x = 1", "lim x->0 (1-cos x)/x^2 = 1/2", "D^n(e^(ax)) = a^n e^(ax)", "D^n(sin ax) = a^n sin(ax + n*pi/2)", "D^n(cos ax) = a^n cos(ax + n*pi/2)", "D^n(log x) = (-1)^(n-1) (n-1)! / x^n", "D^n(uv) = Sum C(n,r) u^(n-r) v^r", "Rolle: f'(c) = 0 when f(a)=f(b)", "LMVT: f'(c) = [f(b)-f(a)]/(b-a)", "Taylor expansion about x=a with remainder"],
  diagramSet: ["Continuity checklist at x=a", "Left/right derivatives at a corner", "Geometric meaning of Rolle (horizontal tangent)", "Geometric meaning of LMVT (chord = tangent slope)"],
  cards,
};
