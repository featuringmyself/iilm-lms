import type { Flashcard, FlashcardDeck } from "../types";

const cards = [
  {
    "id": "Q01",
    "front": "Derive the time-independent Schrödinger wave equation.",
    "back": "Cover: Matter-wave equation → E = p²/2m + V → p and E relations → operator substitution → final TISE",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Direct IILM long question and a recurring AKTU question. This is one of the highest-value derivations in Unit 3.",
    "mustInclude": [
      "Matter-wave equation",
      "E = p²/2m + V",
      "p and E relations",
      "operator substitution",
      "final TISE"
    ],
    "diagram": false,
    "sources": [
      "IILM Assignment Q8",
      "IILM Midterm",
      "AKTU recurring question"
    ]
  },
  {
    "id": "Q02",
    "front": "Derive the time-dependent Schrödinger wave equation.",
    "back": "Cover: ψ = Ae^{i(kx−ωt)} → E = ℏω → p = ℏk → time derivative → second spatial derivative → final TDSE",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Direct IILM long question and recurring AKTU question. It is a separate derivation from TISE and must be reproducible from memory.",
    "mustInclude": [
      "ψ = Ae^{i(kx−ωt)}",
      "E = ℏω",
      "p = ℏk",
      "time derivative",
      "second spatial derivative",
      "final TDSE"
    ],
    "diagram": false,
    "sources": [
      "IILM Assignment Q7",
      "AKTU recurring question"
    ]
  },
  {
    "id": "Q03",
    "front": "Explain the physical significance of the Schrödinger wave function ψ.",
    "back": "Cover: ψ is probability amplitude → |ψ|² is probability density → probability interpretation → normalization",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Direct IILM long question and one of the most repeatedly listed AKTU questions.",
    "mustInclude": [
      "ψ is probability amplitude",
      "|ψ|² is probability density",
      "probability interpretation",
      "normalization"
    ],
    "diagram": false,
    "sources": [
      "IILM Assignment Q8",
      "AKTU repeated question"
    ]
  },
  {
    "id": "Q04",
    "front": "Derive the energy eigenvalues and normalized wave function of a particle in a 1D infinite potential box.",
    "back": "Cover: potential diagram → TISE inside box → general solution → boundary conditions → k = nπ/L → energy eigenvalues → normalization → normalized ψ",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "This combines the most important 1D-box derivation into the exact form repeatedly used in IILM and AKTU exams.",
    "mustInclude": [
      "potential diagram",
      "TISE inside box",
      "general solution",
      "boundary conditions",
      "k = nπ/L",
      "energy eigenvalues",
      "normalization",
      "normalized ψ"
    ],
    "diagram": true,
    "diagramRequired": "Draw infinite potential walls at x=0 and x=L, V=0 inside.",
    "sources": [
      "IILM Assignment Q9",
      "IILM Midterm alternative",
      "AKTU recurring long question"
    ]
  },
  {
    "id": "Q05",
    "front": "Show that the energy levels of a particle in a 1D box are quantized.",
    "back": "Cover: boundary conditions → kL = nπ → E_n = n²h²/(8mL²)",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "This is the central logical result of the 1D-box derivation and can be asked independently.",
    "mustInclude": [
      "boundary conditions",
      "kL = nπ",
      "E_n = n²h²/(8mL²)"
    ],
    "diagram": true,
    "diagramRequired": "Potential well with ψ=0 at both infinite walls.",
    "sources": [
      "IILM Assignment",
      "AKTU 1D-box questions"
    ]
  },
  {
    "id": "Q06",
    "front": "Derive de Broglie wavelength in terms of kinetic energy.",
    "back": "Cover: λ = h/p → E = p²/(2m) → p = √(2mE) → λ = h/√(2mE)",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Direct IILM long question and a fundamental derivation needed for several numerical variants.",
    "mustInclude": [
      "λ = h/p",
      "E = p²/(2m)",
      "p = √(2mE)",
      "λ = h/√(2mE)"
    ],
    "diagram": false,
    "sources": [
      "IILM Assignment Q11",
      "AKTU matter-wave questions"
    ]
  },
  {
    "id": "Q07",
    "front": "Calculate the de Broglie wavelength of a proton moving at one-twentieth the speed of light.",
    "back": "λ = h/mv",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "This exact numerical appears in the IILM tutorial and repeatedly in older UPTU/AKTU material.",
    "answerPattern": "λ = h/mv",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q1",
      "AKTU/UPTU recurring numerical"
    ]
  },
  {
    "id": "Q08",
    "front": "A neutron has de Broglie wavelength 1 Å. Find its velocity and kinetic energy.",
    "back": "v = h/(mλ) · K = 1/2 mv²",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and recurring AKTU/UPTU problem. Tests two linked calculations.",
    "answerPattern": [
      "v = h/(mλ)",
      "K = 1/2 mv²"
    ],
    "diagram": false,
    "sources": [
      "IILM Tutorial Q2",
      "AKTU/UPTU recurring numerical"
    ]
  },
  {
    "id": "Q09",
    "front": "Calculate the de Broglie wavelength of an α-particle accelerated through 200 V.",
    "back": "λ = h/√(2mqV), with q = 2e",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and a repeated historical UPTU/AKTU numerical.",
    "answerPattern": "λ = h/√(2mqV), with q = 2e",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q3",
      "AKTU/UPTU recurring numerical"
    ]
  },
  {
    "id": "Q10",
    "front": "Calculate the kinetic energy of an electron whose de Broglie wavelength equals 5893 Å.",
    "back": "K = h²/(2mλ²)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem. Tests conversion of wavelength plus de Broglie energy relation.",
    "answerPattern": "K = h²/(2mλ²)",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q4",
      "AKTU/UPTU sodium-light numerical"
    ]
  },
  {
    "id": "Q11",
    "front": "Calculate the de Broglie wavelength of an electron having kinetic energy 50 eV.",
    "back": "λ = h/√(2mK)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and a clean test of the kinetic-energy form of de Broglie relation.",
    "answerPattern": "λ = h/√(2mK)",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q9"
    ]
  },
  {
    "id": "Q12",
    "front": "An electron is confined in a 1D box of width 2.5×10⁻¹⁰ m. Find the lowest two energy levels.",
    "back": "E_n = n²h²/(8mL²)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and an AKTU-recurring numerical. This is one of the most important box calculations.",
    "answerPattern": "E_n = n²h²/(8mL²)",
    "diagram": true,
    "diagramRequired": "Simple infinite potential box.",
    "sources": [
      "IILM Tutorial Q5",
      "AKTU recurring numerical"
    ]
  },
  {
    "id": "Q13",
    "front": "Find the energy difference between the first and second excited states of an electron in a 1D box.",
    "back": "First excited = n=2; second excited = n=3; ΔE = E₃−E₂",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem. Tests whether you correctly interpret excited-state numbering.",
    "answerPattern": "First excited = n=2; second excited = n=3; ΔE = E₃−E₂",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q6"
    ]
  },
  {
    "id": "Q14",
    "front": "A particle in a 1D box has known ground-state energy and width. Find its mass.",
    "back": "m = h²/(8L²E₁)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem. Tests rearrangement rather than direct substitution.",
    "answerPattern": "m = h²/(8L²E₁)",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q7"
    ]
  },
  {
    "id": "Q15",
    "front": "Find the ground-state energy of an electron in an infinite 1D box of width 1 Å.",
    "back": "E₁ = h²/(8mL²)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and a repeated historical UPTU problem.",
    "answerPattern": "E₁ = h²/(8mL²)",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q8",
      "AKTU/UPTU recurring numerical"
    ]
  },
  {
    "id": "Q16",
    "front": "Find the energy difference between the ground state and first excited state in a 1D box.",
    "back": "ΔE = E₂−E₁ = 3h²/(8mL²)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial problem and tests the n=1 to n=2 transition.",
    "answerPattern": "ΔE = E₂−E₁ = 3h²/(8mL²)",
    "diagram": false,
    "sources": [
      "IILM Tutorial Q10"
    ]
  },
  {
    "id": "Q17",
    "front": "Calculate the probability of finding a particle within a specified interval in a 1D box.",
    "back": "P = ∫ₐᵇ |ψ_n|² dx",
    "priority": "A",
    "cardType": "probability",
    "whyExists": "AKTU papers include this type of problem. It tests whether you can actually use |ψ|² rather than merely define it.",
    "answerPattern": "P = ∫ₐᵇ |ψ_n|² dx",
    "diagram": true,
    "diagramRequired": "1D box with the requested interval shaded/marked.",
    "sources": [
      "AKTU 2024–25 style paper",
      "Wave-function interpretation"
    ]
  },
  {
    "id": "Q18",
    "front": "What is the physical meaning of |ψ|²?",
    "back": "|ψ|² is the probability density of finding the particle.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Very common short-answer question and essential for probability questions.",
    "answer": "|ψ|² is the probability density of finding the particle.",
    "diagram": false,
    "sources": [
      "IILM Assignment Q3",
      "AKTU repeated question"
    ]
  },
  {
    "id": "Q19",
    "front": "Explain the normalization condition of a wave function.",
    "back": "∫|ψ|²dx = 1 over all space.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Direct IILM short question and required when deriving the normalized 1D-box wave function.",
    "answer": "∫|ψ|²dx = 1 over all space.",
    "diagram": false,
    "sources": [
      "IILM Assignment Q4"
    ]
  },
  {
    "id": "Q20",
    "front": "Derive the normalized wave function for a particle in a 1D infinite box.",
    "back": "Cover: ψ = A sin(nπx/L) → normalization integral → A = √(2/L)",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Often bundled with the energy derivation, but worth practising independently because normalization is a separate scoring step.",
    "mustInclude": [
      "ψ = A sin(nπx/L)",
      "normalization integral",
      "A = √(2/L)"
    ],
    "diagram": true,
    "diagramRequired": "Show standing-wave form for at least n=1 and indicate boundaries.",
    "sources": [
      "IILM Assignment Q9",
      "AKTU recurring question"
    ]
  },
  {
    "id": "Q21",
    "front": "State de Broglie's hypothesis of matter waves.",
    "back": "Every moving particle is associated with a matter wave of wavelength λ=h/p.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Direct IILM short question and an actual short-answer pattern in AKTU material.",
    "answer": "Every moving particle is associated with a matter wave of wavelength λ=h/p.",
    "diagram": false,
    "sources": [
      "IILM Assignment Q1",
      "IILM Midterm",
      "AKTU question bank"
    ]
  },
  {
    "id": "Q22",
    "front": "What is wave-particle duality?",
    "back": "Quantum objects exhibit both wave-like and particle-like behaviour.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Explicitly included in the current SLM and provides the conceptual bridge between de Broglie and Schrödinger mechanics.",
    "answer": "Quantum objects exhibit both wave-like and particle-like behaviour.",
    "diagram": false,
    "sources": [
      "IILM SLM"
    ]
  },
  {
    "id": "Q23",
    "front": "Describe the Davisson–Germer experiment and explain how it proves electron wave nature.",
    "back": "Cover: electron gun → nickel crystal → detector → scattering → Bragg diffraction → agreement with de Broglie wavelength",
    "priority": "B",
    "cardType": "long_answer",
    "whyExists": "It is in the broader AKTU question pattern and directly tests experimental evidence for de Broglie's hypothesis.",
    "mustInclude": [
      "electron gun",
      "nickel crystal",
      "detector",
      "scattering",
      "Bragg diffraction",
      "agreement with de Broglie wavelength"
    ],
    "diagram": true,
    "diagramRequired": "Electron gun → nickel crystal → movable detector; label scattering angle.",
    "sources": [
      "AKTU question bank"
    ]
  },
  {
    "id": "Q24",
    "front": "State the inadequacies of classical physics.",
    "back": "Classical physics cannot explain key microscopic phenomena such as blackbody radiation and quantum behaviour.",
    "priority": "B",
    "cardType": "short_answer",
    "whyExists": "Direct IILM short question and explicitly part of the current SLM, although qualitative.",
    "answer": "Classical physics cannot explain key microscopic phenomena such as blackbody radiation and quantum behaviour.",
    "diagram": false,
    "sources": [
      "IILM Assignment Q2",
      "IILM SLM"
    ]
  },
  {
    "id": "Q25",
    "front": "Explain the photoelectric effect and its quantum significance.",
    "back": "Photon energy E=hν explains electron emission; it demonstrates particle-like behaviour of light.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "It appeared in the earlier PDF material/deck, but it is lower priority because the current SLM and IILM assignment do not explicitly list it under Unit 3.",
    "answer": "Photon energy E=hν explains electron emission; it demonstrates particle-like behaviour of light.",
    "diagram": true,
    "diagramRequired": "Metal surface, incident photons and emitted electrons.",
    "sources": [
      "Earlier Unit 3 PDF",
      "Current SLM does not explicitly list it"
    ],
    "priorityNote": "Revision only unless your teacher's lecture notes explicitly include it."
  },
  {
    "id": "Q26",
    "front": "What is a finite potential well?",
    "back": "A potential well bounded by barriers of finite height.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Explicitly included in the current SLM and forms the basis for understanding tunneling.",
    "answer": "A potential well bounded by barriers of finite height.",
    "diagram": true,
    "diagramRequired": "Finite-height potential barriers around a well.",
    "sources": [
      "IILM SLM"
    ]
  },
  {
    "id": "Q27",
    "front": "Compare classical and quantum predictions for a particle encountering a potential barrier.",
    "back": "Cover: E < V₀ → classical reflection → quantum penetration → decaying wave function → transmission probability",
    "priority": "B",
    "cardType": "long_answer",
    "whyExists": "Exact IILM long question. This is the required way to prepare tunneling rather than memorizing vague definitions.",
    "mustInclude": [
      "E < V₀",
      "classical reflection",
      "quantum penetration",
      "decaying wave function",
      "transmission probability"
    ],
    "diagram": true,
    "diagramRequired": "Potential barrier V₀ with particle energy E below the barrier.",
    "sources": [
      "IILM Assignment Q10"
    ]
  },
  {
    "id": "Q28",
    "front": "Explain quantum tunneling.",
    "back": "A quantum particle can penetrate and cross a finite potential barrier even when E<V₀.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Direct IILM short question and explicitly listed in the current SLM.",
    "answer": "A quantum particle can penetrate and cross a finite potential barrier even when E<V₀.",
    "diagram": true,
    "diagramRequired": "Barrier with E<V₀ and decaying wave inside.",
    "sources": [
      "IILM Assignment Q5",
      "IILM SLM"
    ]
  },
  {
    "id": "Q29",
    "front": "How do barrier height and width affect tunneling probability?",
    "back": "Increasing either barrier height or width reduces tunneling probability.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "A natural follow-up to the required tunneling comparison and tests understanding rather than memorization.",
    "answer": "Increasing either barrier height or width reduces tunneling probability.",
    "diagram": false,
    "sources": [
      "Finite-potential/tunneling theory"
    ]
  },
  {
    "id": "Q30",
    "front": "Explain quantum computing qualitatively.",
    "back": "Cover: qubit → superposition → measurement → entanglement",
    "priority": "C",
    "cardType": "concept",
    "whyExists": "Explicitly listed in the IILM SLM and assignment, but qualitative and unlikely to deserve the same preparation time as Schrödinger/box problems.",
    "mustInclude": [
      "qubit",
      "superposition",
      "measurement",
      "entanglement"
    ],
    "diagram": false,
    "sources": [
      "IILM Assignment Q6",
      "IILM SLM"
    ]
  },
  {
    "id": "Q31",
    "front": "What is a qubit?",
    "back": "A quantum information unit represented as a superposition α|0⟩+β|1⟩.",
    "priority": "C",
    "cardType": "concept",
    "whyExists": "Useful for answering the qualitative quantum-computing question in a few marks.",
    "answer": "A quantum information unit represented as a superposition α|0⟩+β|1⟩.",
    "diagram": false,
    "sources": [
      "IILM SLM"
    ]
  },
  {
    "id": "Q32",
    "front": "Calculate the de Broglie wavelength of an electron accelerated through a potential difference V.",
    "back": "λ = h/√(2meV)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Not just one specific number: this is the general numerical pattern behind many AKTU questions.",
    "answerPattern": "λ = h/√(2meV)",
    "diagram": false,
    "sources": [
      "AKTU recurring numerical pattern"
    ]
  },
  {
    "id": "Q33",
    "front": "Given kinetic energy of an electron, calculate its velocity, momentum and de Broglie wavelength.",
    "back": "v = √(2K/m) · p = mv · λ = h/p",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "AKTU question banks contain multi-step problems of this form. It ensures you can move between K, v, p and λ.",
    "answerPattern": [
      "v = √(2K/m)",
      "p = mv",
      "λ = h/p"
    ],
    "diagram": false,
    "sources": [
      "AKTU question bank"
    ]
  },
  {
    "id": "Q34",
    "front": "Find the de Broglie wavelength of a particle when its momentum is given.",
    "back": "λ=h/p",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "The simplest λ=h/p form is the base case from which all other de Broglie numericals are derived.",
    "answerPattern": "λ=h/p",
    "diagram": false,
    "sources": [
      "De Broglie fundamentals"
    ]
  },
  {
    "id": "Q35",
    "front": "Find E₁, E₂ and E₃ for an electron in a 1D box.",
    "back": "E_n=n²h²/(8mL²)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Tests whether you understand the n² dependence instead of blindly solving one ground-state problem.",
    "answerPattern": "E_n=n²h²/(8mL²)",
    "diagram": true,
    "diagramRequired": "Standing-wave sketches for n=1, 2 and 3.",
    "sources": [
      "IILM Tutorial",
      "AKTU 1D-box material"
    ]
  },
  {
    "id": "Q36",
    "front": "What are the ground state, first excited state and second excited state?",
    "back": "Ground: n=1; first excited: n=2; second excited: n=3.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Prevents a common numerical mistake: ground=n=1, first excited=n=2, second excited=n=3.",
    "answer": "Ground: n=1; first excited: n=2; second excited: n=3.",
    "diagram": true,
    "diagramRequired": "Energy-level diagram showing n=1,2,3.",
    "sources": [
      "1D-box numericals"
    ]
  },
  {
    "id": "Q37",
    "front": "Why can a particle in an infinite box not have zero energy?",
    "back": "n=0 gives the trivial ψ=0 solution, so the first physical state is n=1 and E₁>0.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Tests the physical meaning of quantization and prevents the n=0 mistake.",
    "answer": "n=0 gives the trivial ψ=0 solution, so the first physical state is n=1 and E₁>0.",
    "diagram": false,
    "sources": [
      "1D-box theory"
    ]
  },
  {
    "id": "Q38",
    "front": "How does the energy of a particle in a box depend on n, m and L?",
    "back": "E_n ∝ n², E_n ∝ 1/m and E_n ∝ 1/L².",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Makes many numerical variations almost immediate.",
    "answer": "E_n ∝ n², E_n ∝ 1/m and E_n ∝ 1/L².",
    "diagram": false,
    "sources": [
      "1D-box formula"
    ]
  },
  {
    "id": "Q39",
    "front": "If the box length doubles, how do the energy levels change?",
    "back": "All energy levels become one-fourth because E∝1/L².",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Fast conceptual numerical commonly used to test whether the formula is understood.",
    "answer": "All energy levels become one-fourth because E∝1/L².",
    "diagram": false,
    "sources": [
      "1D-box formula"
    ]
  },
  {
    "id": "Q40",
    "front": "If the particle mass doubles, how do the energy levels change?",
    "back": "All energy levels become half because E∝1/m.",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Quick test of proportionality in the 1D-box equation.",
    "answer": "All energy levels become half because E∝1/m.",
    "diagram": false,
    "sources": [
      "1D-box formula"
    ]
  },
  {
    "id": "Q41",
    "front": "What is the probability density at a node of a 1D-box wave function?",
    "back": "Zero, because ψ=0 at a node and therefore |ψ|²=0.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Connects the mathematical wave function to its physical interpretation.",
    "answer": "Zero, because ψ=0 at a node and therefore |ψ|²=0.",
    "diagram": true,
    "diagramRequired": "Standing-wave sketch with nodes marked.",
    "sources": [
      "Wave-function interpretation",
      "1D-box theory"
    ]
  },
  {
    "id": "Q42",
    "front": "Show that the normalized wave function satisfies total probability equal to one.",
    "back": "Evaluate ∫₀ᴸ |ψ_n|²dx and set it equal to 1.",
    "priority": "B",
    "cardType": "derivation",
    "whyExists": "Connects normalization theory to the actual constant √(2/L) used in the box derivation.",
    "answerPattern": "Evaluate ∫₀ᴸ |ψ_n|²dx and set it equal to 1.",
    "diagram": false,
    "sources": [
      "IILM Assignment Q4",
      "1D-box derivation"
    ]
  },
  {
    "id": "Q43",
    "front": "What is the difference between ψ and |ψ|²?",
    "back": "ψ is the probability amplitude; |ψ|² is the measurable probability density.",
    "priority": "C",
    "cardType": "concept",
    "whyExists": "Very useful for rapid revision and prevents one of the most basic conceptual errors.",
    "answer": "ψ is the probability amplitude; |ψ|² is the measurable probability density.",
    "diagram": false,
    "sources": [
      "IILM Assignment",
      "AKTU recurring question"
    ]
  },
  {
    "id": "Q44",
    "front": "What is the difference between TDSE and TISE?",
    "back": "TDSE describes time evolution; TISE gives stationary states and allowed energies.",
    "priority": "C",
    "cardType": "concept",
    "whyExists": "A high-yield 2–3 mark comparison and helps decide which equation to use.",
    "answer": "TDSE describes time evolution; TISE gives stationary states and allowed energies.",
    "diagram": false,
    "sources": [
      "Schrödinger theory"
    ]
  },
  {
    "id": "Q45",
    "front": "Which de Broglie formula should be used when momentum is given?",
    "back": "λ=h/p.",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Formula-selection practice reduces mistakes in numericals.",
    "answer": "λ=h/p.",
    "diagram": false
  },
  {
    "id": "Q46",
    "front": "Which de Broglie formula should be used when kinetic energy is given?",
    "back": "λ=h/√(2mK).",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Formula-selection practice for the most common numerical variant.",
    "answer": "λ=h/√(2mK).",
    "diagram": false
  },
  {
    "id": "Q47",
    "front": "Which de Broglie formula should be used when accelerating voltage is given?",
    "back": "λ=h/√(2mqV).",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Formula-selection practice for charged-particle problems.",
    "answer": "λ=h/√(2mqV).",
    "diagram": false
  },
  {
    "id": "Q48",
    "front": "What is the particle-in-a-box energy formula?",
    "back": "E_n=n²h²/(8mL²).",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "The single most important formula for Unit 3 box numericals.",
    "answer": "E_n=n²h²/(8mL²).",
    "diagram": false
  },
  {
    "id": "Q49",
    "front": "What is the normalized particle-in-a-box wave function?",
    "back": "ψ_n=√(2/L) sin(nπx/L).",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "The second essential box formula and a required result in the IILM assignment.",
    "answer": "ψ_n=√(2/L) sin(nπx/L).",
    "diagram": false
  },
  {
    "id": "Q50",
    "front": "How should a 6-mark derivation be presented?",
    "back": "Diagram → assumptions → starting equation → substitutions → derivation → boxed final result.",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "Knowing the physics is not enough; the derivation must be reproducible under exam conditions.",
    "answer": "Diagram → assumptions → starting equation → substitutions → derivation → boxed final result.",
    "diagram": true,
    "diagramRequired": "Include a labelled diagram whenever the physical setup requires one."
  },
  {
    "id": "Q51",
    "front": "How should a numerical be presented?",
    "back": "Given → formula → unit conversion → substitution → calculation → final answer with unit.",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "Creates a consistent answer format and reduces unit/calculation mistakes.",
    "answer": "Given → formula → unit conversion → substitution → calculation → final answer with unit.",
    "diagram": false
  },
  {
    "id": "Q52",
    "front": "Which Unit 3 diagrams should you be able to draw from memory?",
    "back": "Infinite 1D potential box · 1D-box standing waves · Energy-level diagram · Davisson-Germer setup · Finite potential barrier/tunneling",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "These diagrams directly support the long-answer questions and make answers more complete.",
    "answer": [
      "Infinite 1D potential box",
      "1D-box standing waves",
      "Energy-level diagram",
      "Davisson-Germer setup",
      "Finite potential barrier/tunneling"
    ],
    "diagram": true
  },
  {
    "id": "Q53",
    "front": "Full derivation test: Without notes, derive TISE and state the physical significance of ψ.",
    "back": "Cover: TISE derivation → ψ as probability amplitude → |ψ|² interpretation → normalization",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Combines two directly assigned IILM long-answer components into one exam-style task.",
    "mustInclude": [
      "TISE derivation",
      "ψ as probability amplitude",
      "|ψ|² interpretation",
      "normalization"
    ],
    "diagram": false
  },
  {
    "id": "Q54",
    "front": "Full derivation test: Solve the infinite 1D box and obtain ψ_n and E_n.",
    "back": "Cover: boundary conditions → E_n = n²h²/(8mL²) → ψ_n = √(2/L) sin(nπx/L)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "This reproduces the highest-value multi-step derivation in the syllabus.",
    "mustInclude": [
      "boundary conditions",
      "E_n = n²h²/(8mL²)",
      "ψ_n = √(2/L) sin(nπx/L)"
    ],
    "diagram": true,
    "diagramRequired": "Potential-energy diagram plus at least one standing-wave sketch."
  },
  {
    "id": "Q55",
    "front": "Full numerical test: Solve one de Broglie problem where K is given and one where V is given.",
    "back": "λ = h/√(2mK) · λ = h/√(2mqV)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Forces you to select the correct formula rather than memorizing one numerical.",
    "answerPattern": [
      "λ = h/√(2mK)",
      "λ = h/√(2mqV)"
    ],
    "diagram": false
  },
  {
    "id": "Q56",
    "front": "Full numerical test: Solve a 1D-box problem involving E₁/E₂ and an energy difference.",
    "back": "E_n = n²h²/(8mL²) · ΔE = E₂−E₁ = 3h²/(8mL²)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Combines the exact numerical patterns appearing in the IILM tutorial.",
    "answerPattern": [
      "E_n = n²h²/(8mL²)",
      "ΔE = E₂−E₁ = 3h²/(8mL²)"
    ],
    "diagram": true,
    "diagramRequired": "Draw the box before calculating."
  }
] as Flashcard[];

export const quantumPhysicsUnit3: FlashcardDeck = {
  courseSlug: "quantum-physics",
  courseName: "Quantum Physics",
  semesterSlug: "1stsem",
  unitSlug: "unit-3",
  unitLabel: "Unit 3",
  title: "Quantum Physics Unit 3 — Final Exam Prep Question Bank",
  courseCode: "26SOST101 — Semiconductor and Quantum Physics",
  purpose: "Exam preparation + active revision",
  focus: [
    "IILM Assignment long questions",
    "IILM Tutorial numericals",
    "IILM SLM syllabus",
    "AKTU-style recurring questions",
  ],
  ready: true,
  minimumExamSet: [
    "Q01",
    "Q02",
    "Q03",
    "Q04",
    "Q06",
    "Q07",
    "Q08",
    "Q09",
    "Q10",
    "Q11",
    "Q12",
    "Q13",
    "Q15",
    "Q16",
    "Q17",
    "Q21",
    "Q23",
    "Q27",
  ],
  formulaSheet: [
    "λ = h/p",
    "λ = h/(mv)",
    "λ = h/√(2mK)",
    "λ = h/√(2mqV)",
    "−ℏ²/(2m) d²ψ/dx² + Vψ = Eψ",
    "iℏ ∂ψ/∂t = −ℏ²/(2m) ∂²ψ/∂x² + Vψ",
    "P = ∫|ψ|²dx",
    "∫|ψ|²dx = 1",
    "E_n = n²h²/(8mL²)",
    "ψ_n = √(2/L) sin(nπx/L)",
  ],
  diagramSet: [
    "1D infinite potential box",
    "1D-box n=1, n=2, n=3 wave functions",
    "1D-box energy levels",
    "Davisson-Germer experimental setup",
    "Finite potential barrier and tunneling",
  ],
  cards,
};
