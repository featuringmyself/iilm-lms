import type { Flashcard, FlashcardDeck } from "../types";

const cards = [
  {
    "id": "U4-01",
    "front": "Derive the relations between Einstein's A and B coefficients using thermal equilibrium and Planck's radiation law.",
    "back": "Cover: N1 B12 ρ(ν) → N2 A21 → N2 B21 ρ(ν) → Boltzmann distribution → Planck radiation density → B12 = B21 for non-degenerate levels → A21/B21 = 8πhν³/c³",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Exact IILM long question and a recurring AKTU question. This is the major derivation of the radiation-matter section.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "mustInclude": [
      "N1 B12 ρ(ν)",
      "N2 A21",
      "N2 B21 ρ(ν)",
      "Boltzmann distribution",
      "Planck radiation density",
      "B12 = B21 for non-degenerate levels",
      "A21/B21 = 8πhν³/c³"
    ],
    "diagramRequired": "Two energy levels E1 and E2 showing absorption, spontaneous emission and stimulated emission.",
    "sources": [
      "IILM Assignment Q1",
      "IILM Unit 4 notes",
      "AKTU recurring question"
    ]
  },
  {
    "id": "U4-02",
    "front": "Explain the construction and working of a He-Ne laser with a neat labelled diagram. Explain its energy-level scheme and applications.",
    "back": "Cover: construction → He-Ne mixture → discharge → mirrors → energy-level scheme (He metastable → Ne) → applications",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Exact IILM long question and one of the most repeatedly reported AKTU laser questions.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "diagramRequired": "Label: Discharge tube · He-Ne gas · Electrodes · Fully reflecting mirror · Partially reflecting mirror · Laser output · Energy-level scheme",
    "sources": [
      "IILM Assignment Q2",
      "IILM notes",
      "AKTU repeated question"
    ]
  },
  {
    "id": "U4-03",
    "front": "Explain the construction and working of Ruby laser with a neat diagram and energy-level scheme.",
    "back": "Cover: ruby rod + flash lamp → mirrors → three-level scheme → metastable state → pulsed output",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Exact IILM long question and repeatedly appears in AKTU Engineering Physics.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "diagramRequired": "Label: Ruby rod · Flash lamp · Reflecting mirrors · Laser output · Three energy levels · Metastable state",
    "sources": [
      "IILM Assignment Q3",
      "IILM notes",
      "AKTU PYQ pattern"
    ]
  },
  {
    "id": "U4-04",
    "front": "Discuss the classification of optical fibres. Explain step-index and graded-index fibres and distinguish single-mode and multimode fibres.",
    "back": "Cover: step-index vs graded-index · single-mode vs multimode · refractive-index profiles · ray diagrams",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "Exact IILM long question. It covers almost the entire fibre-classification portion of the syllabus.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "diagramRequired": "Label: Step-index refractive-index profile · Graded-index profile · Single-mode ray · Multimode rays",
    "sources": [
      "IILM Assignment Q4",
      "IILM Unit 4 notes",
      "AKTU fibre questions"
    ]
  },
  {
    "id": "U4-05",
    "front": "Derive expressions for acceptance angle and numerical aperture of an optical fibre.",
    "back": "Cover: Snell's law → Critical angle → Total internal reflection → Acceptance angle → NA = n0 sin α0 → NA = √(n1² − n2²) for air",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "Exact IILM long question and one of the strongest recurring AKTU fibre questions.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "mustInclude": [
      "Snell's law",
      "Critical angle",
      "Total internal reflection",
      "Acceptance angle",
      "NA = n0 sin α0",
      "NA = √(n1² − n2²) for air"
    ],
    "diagramRequired": "Acceptance-angle geometry with core, cladding, normal, refracted ray and critical angle.",
    "sources": [
      "IILM Assignment Q5",
      "IILM notes",
      "AKTU repeated question"
    ]
  },
  {
    "id": "U4-06",
    "front": "What are the necessary conditions for lasing action?",
    "back": "Cover: Active medium → Pumping → Population inversion → Metastable state → Optical resonator",
    "priority": "A",
    "cardType": "short_answer",
    "whyExists": "Exact IILM short question and fundamental to Ruby, He-Ne and semiconductor laser answers.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "mustInclude": [
      "Active medium",
      "Pumping",
      "Population inversion",
      "Metastable state",
      "Optical resonator"
    ],
    "sources": [
      "IILM Assignment Q1"
    ]
  },
  {
    "id": "U4-07",
    "front": "Identify the basic components of a laser and explain the function of each.",
    "back": "Cover: Active medium → Pumping source → Optical resonator",
    "priority": "A",
    "cardType": "short_answer",
    "whyExists": "Exact IILM short question and provides the framework for every laser construction answer.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "mustInclude": [
      "Active medium",
      "Pumping source",
      "Optical resonator"
    ],
    "diagramRequired": "Basic laser cavity with two mirrors and active medium.",
    "sources": [
      "IILM Assignment Q2"
    ]
  },
  {
    "id": "U4-08",
    "front": "Explain the importance of an optical resonator in a laser.",
    "back": "Optical resonator provides feedback, selects cavity modes, and builds coherent amplified output via multiple passes.",
    "priority": "A",
    "cardType": "short_answer",
    "whyExists": "Exact IILM short question. It is also a scoring component of the Ruby/He-Ne construction answer.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "sources": [
      "IILM Assignment Q3"
    ]
  },
  {
    "id": "U4-09",
    "front": "What is the working principle of an optical fibre?",
    "back": "Light is guided through the core by total internal reflection at the core-cladding interface.",
    "priority": "A",
    "cardType": "short_answer",
    "whyExists": "Exact IILM short question and the conceptual foundation for NA, acceptance angle and fibre classification.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answer": "Light is guided through the core by total internal reflection at the core-cladding interface.",
    "diagramRequired": "Core, cladding and zig-zag ray undergoing TIR.",
    "sources": [
      "IILM Assignment Q4"
    ]
  },
  {
    "id": "U4-10",
    "front": "Briefly describe the working principle of a semiconductor laser.",
    "back": "Forward-biased p-n junction → population inversion in active region → stimulated emission → cleaved faces as cavity mirrors.",
    "priority": "A",
    "cardType": "short_answer",
    "whyExists": "Exact IILM short question and semiconductor laser is explicitly in the current syllabus.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "diagramRequired": "Forward-biased p-n junction, active region and optical cavity.",
    "sources": [
      "IILM Assignment Q5",
      "IILM SLM"
    ]
  },
  {
    "id": "U4-11",
    "front": "Differentiate absorption, spontaneous emission and stimulated emission.",
    "back": "Absorption: photon absorbed, atom E1→E2 · Spontaneous: random emission E2→E1 · Stimulated: incident photon triggers identical photon E2→E1",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "These three processes are the conceptual foundation of Einstein coefficients and laser action.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "diagramRequired": "Three two-level transition diagrams.",
    "sources": [
      "IILM notes",
      "AKTU short-question pattern"
    ]
  },
  {
    "id": "U4-12",
    "front": "What is stimulated emission? Why is it essential for laser action?",
    "back": "Stimulated emission: an incoming photon of energy hν causes an excited atom to emit a second identical photon (same phase, direction, frequency). Essential because it provides optical amplification.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Stimulated emission is the defining mechanism of laser amplification and frequently appears as a short question.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "sources": [
      "IILM notes",
      "AKTU PYQ pattern"
    ]
  },
  {
    "id": "U4-13",
    "front": "What is population inversion? Why is it necessary for laser action?",
    "back": "Population inversion means N2 > N1 between the relevant laser levels, allowing stimulated emission to dominate absorption.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Explicit syllabus topic and repeatedly tested in AKTU questions.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answer": "Population inversion means N2 > N1 between the relevant laser levels, allowing stimulated emission to dominate absorption.",
    "diagramRequired": "Energy levels with N2 > N1.",
    "sources": [
      "IILM SLM",
      "IILM notes",
      "AKTU recurring question"
    ]
  },
  {
    "id": "U4-14",
    "front": "What is a metastable state? Explain its role in laser action.",
    "back": "A metastable state has a relatively long lifetime, allowing population to accumulate so N2 can exceed N1 (population inversion).",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Explicitly listed in the current SLM and essential to explaining population inversion.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "sources": [
      "IILM SLM",
      "IILM notes"
    ]
  },
  {
    "id": "U4-15",
    "front": "A Ruby laser emits at 694.3 nm. Calculate its frequency and the energy of one photon.",
    "back": "ν = c/λ · E = hν = hc/λ",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": [
      "ν = c/λ",
      "E = hν = hc/λ"
    ],
    "sources": [
      "IILM Tutorial Q1"
    ]
  },
  {
    "id": "U4-16",
    "front": "A Ruby laser emits a 0.5 J pulse at 694.3 nm. Find the number of photons emitted.",
    "back": "N = E_total/(hc/λ)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical. Tests conversion between pulse energy and photon energy.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "N = E_total/(hc/λ)",
    "sources": [
      "IILM Tutorial Q2"
    ]
  },
  {
    "id": "U4-17",
    "front": "At 300 K, calculate N2/N1 when E2−E1 = 1 eV.",
    "back": "N2/N1 = exp[-(E2−E1)/(kT)]",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical and tests Boltzmann population distribution.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "N2/N1 = exp[-(E2−E1)/(kT)]",
    "sources": [
      "IILM Tutorial Q3"
    ]
  },
  {
    "id": "U4-18",
    "front": "If N2 = 5×10^18 and N1 = 2×10^18, determine whether population inversion exists.",
    "back": "Population inversion exists when N2 > N1.",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical. Very simple but directly tests the defining condition.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "Population inversion exists when N2 > N1.",
    "sources": [
      "IILM Tutorial Q4"
    ]
  },
  {
    "id": "U4-19",
    "front": "At 500 K, N2/N1 = 0.01. Calculate the energy separation E2−E1.",
    "back": "ΔE = −kT ln(N2/N1)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical. Tests rearrangement of the Boltzmann relation.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "ΔE = −kT ln(N2/N1)",
    "sources": [
      "IILM Tutorial Q5"
    ]
  },
  {
    "id": "U4-20",
    "front": "For n1=1.48 and n2=1.46, calculate the numerical aperture.",
    "back": "NA = √(n1²−n2²)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical and the basic NA problem.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "NA = √(n1²−n2²)",
    "sources": [
      "IILM Tutorial Q6"
    ]
  },
  {
    "id": "U4-21",
    "front": "For n1=1.5 and n2=1.48, calculate the critical angle.",
    "back": "sin C = n2/n1",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical and tests the TIR condition.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "sin C = n2/n1",
    "sources": [
      "IILM Tutorial Q7"
    ]
  },
  {
    "id": "U4-22",
    "front": "For n1=1.50 and n2=1.47, find NA, acceptance angle in air and maximum internal angle.",
    "back": "NA = √(n1²−n2²) · α0 = sin⁻¹(NA) · sin θc = n2/n1",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial multi-step numerical. This is the best single practice problem for fibre geometry.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": [
      "NA = √(n1²−n2²)",
      "α0 = sin⁻¹(NA)",
      "sin θc = n2/n1"
    ],
    "diagramRequired": "Acceptance-angle geometry.",
    "sources": [
      "IILM Tutorial Q8"
    ]
  },
  {
    "id": "U4-23",
    "front": "For n1=1.50, n2=1.48 and internal incidence angle 78°, determine whether TIR occurs.",
    "back": "Cover: Calculate C from sin C = n2/n1 → Compare i with C → State whether TIR occurs",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical. Tests critical-angle reasoning rather than formula substitution alone.",
    "diagram": true,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "mustInclude": [
      "Calculate C from sin C = n2/n1",
      "Compare i with C",
      "State whether TIR occurs"
    ],
    "sources": [
      "IILM Tutorial Q9"
    ]
  },
  {
    "id": "U4-24",
    "front": "A fibre must have an acceptance angle of 30° in air and n1=1.50. Find n2.",
    "back": "n2 = √(n1²−sin²α0)",
    "priority": "A",
    "cardType": "numerical",
    "whyExists": "Exact IILM tutorial numerical and tests reverse use of the NA relation.",
    "diagram": false,
    "priorityNote": "A+: Directly assigned by IILM + strong exam recurrence. Must master.",
    "answerPattern": "n2 = √(n1²−sin²α0)",
    "sources": [
      "IILM Tutorial Q10"
    ]
  },
  {
    "id": "U4-25",
    "front": "What are the characteristics of laser light?",
    "back": "Monochromatic · Coherent · Highly directional · High intensity",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Common short-answer question and necessary for differentiating laser and ordinary light.",
    "diagram": false,
    "mustInclude": [
      "Monochromatic",
      "Coherent",
      "Highly directional",
      "High intensity"
    ],
    "sources": [
      "IILM Unit 4 notes"
    ]
  },
  {
    "id": "U4-26",
    "front": "Differentiate between ordinary light and laser light.",
    "back": "Ordinary: polychromatic, incoherent, divergent, lower intensity · Laser: monochromatic, coherent, directional, high intensity",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Frequently used as a short/medium answer and consolidates laser characteristics.",
    "diagram": false,
    "sources": [
      "IILM Unit 4 notes",
      "AKTU question patterns"
    ]
  },
  {
    "id": "U4-27",
    "front": "Explain the principle and working of a three-level laser system.",
    "back": "Pump ground→pump level → fast decay to metastable → laser transition to ground · Must invert against heavily populated ground state",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "AKTU-oriented 2025-26 material explicitly tests 3-level vs 4-level lasers, while Ruby is a three-level laser.",
    "diagram": true,
    "diagramRequired": "Three-level energy diagram showing pump, metastable and laser transitions.",
    "sources": [
      "AKTU 2025-26 assignment",
      "Ruby laser theory"
    ]
  },
  {
    "id": "U4-28",
    "front": "Explain the principle and working of a four-level laser system.",
    "back": "Pump → upper laser level → laser transition to lower laser level → fast decay to ground · Lower level stays nearly empty → easier inversion",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "AKTU-oriented 2025-26 material explicitly asks 3-level vs 4-level lasers; useful extension beyond the current IILM assignment.",
    "diagram": true,
    "sources": [
      "AKTU 2025-26 material"
    ]
  },
  {
    "id": "U4-29",
    "front": "Compare three-level and four-level laser systems.",
    "back": "Compare: number of levels · lower laser level · inversion difficulty · pumping · efficiency · examples (Ruby vs He-Ne)",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Recent AKTU assignment specifically asks this, and it explains why He-Ne-type four-level operation is easier to sustain than Ruby.",
    "diagram": true,
    "mustInclude": [
      "Number of levels",
      "Lower laser level",
      "Population inversion",
      "Pumping requirement",
      "Efficiency",
      "Examples"
    ],
    "sources": [
      "AKTU 2025-26 assignment"
    ]
  },
  {
    "id": "U4-30",
    "front": "Why is a He-Ne laser superior to a Ruby laser in practical operation?",
    "back": "He-Ne: CW operation, lower pumping threshold, four-level-like ease of inversion, higher efficiency, better beam quality for many uses",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "This exact comparison appears in recent AKTU-oriented material and is a natural extension of the two laser constructions.",
    "diagram": false,
    "mustInclude": [
      "Continuous operation",
      "Pumping requirement",
      "Efficiency",
      "Population inversion",
      "Output characteristics"
    ],
    "sources": [
      "AKTU 2025-26 assignment",
      "AKTU important-question compilation"
    ]
  },
  {
    "id": "U4-31",
    "front": "Explain the interaction of radiation with matter using absorption, spontaneous emission and stimulated emission.",
    "back": "Three processes with rates N1 B12 ρ(ν), N2 A21, N2 B21 ρ(ν); diagrams for each transition",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This provides the complete theoretical foundation before Einstein coefficients and laser action.",
    "diagram": true,
    "diagramRequired": "Three separate two-level diagrams.",
    "sources": [
      "IILM notes",
      "Current SLM"
    ]
  },
  {
    "id": "U4-32",
    "front": "Why is population inversion impossible to maintain in thermal equilibrium?",
    "back": "At thermal equilibrium the higher-energy state has fewer atoms than the lower-energy state, so N2<N1.",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Tests the reason pumping is necessary rather than simply memorizing N2>N1.",
    "diagram": false,
    "answer": "At thermal equilibrium the higher-energy state has fewer atoms than the lower-energy state, so N2<N1.",
    "sources": [
      "Einstein coefficient theory"
    ]
  },
  {
    "id": "U4-33",
    "front": "Explain the complete sequence of laser action from pumping to laser output.",
    "back": "Pumping → excitation → metastable → population inversion → stimulated emission → resonator feedback → amplification → output coupling",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "This is the conceptual skeleton behind every Ruby/He-Ne laser working answer.",
    "diagram": true,
    "mustInclude": [
      "Pumping",
      "Excitation",
      "Metastable state",
      "Population inversion",
      "Stimulated emission",
      "Optical resonator",
      "Amplification",
      "Output coupling"
    ]
  },
  {
    "id": "U4-34",
    "front": "Explain Ruby laser including its three-level energy scheme.",
    "back": "Construction + three-level Cr³⁺ scheme linking flash-lamp pumping to metastable laser transition at 694.3 nm",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "A more exam-ready version of the assignment question: it forces you to connect construction to the energy-level mechanism.",
    "diagram": true,
    "sources": [
      "IILM Assignment",
      "AKTU PYQs"
    ]
  },
  {
    "id": "U4-35",
    "front": "Explain He-Ne laser including the role of helium in producing population inversion in neon.",
    "back": "He atoms excited by discharge; resonant energy transfer He→Ne populates Ne upper laser levels → inversion in Ne",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "The role of helium is the key conceptual distinction in the He-Ne laser and frequently appears in explanations.",
    "diagram": true,
    "sources": [
      "IILM notes",
      "AKTU material"
    ]
  },
  {
    "id": "U4-36",
    "front": "Explain the construction and working of a semiconductor laser.",
    "back": "p-n junction diode laser: forward bias, active region recombination, cleaved facets as Fabry-Pérot cavity, stimulated emission",
    "priority": "A",
    "cardType": "long_answer",
    "whyExists": "The current IILM SLM explicitly includes semiconductor laser even though the assignment only asks it as a short question.",
    "diagram": true,
    "sources": [
      "IILM SLM",
      "IILM Assignment Q5"
    ]
  },
  {
    "id": "U4-37",
    "front": "Compare Ruby, He-Ne and semiconductor lasers.",
    "back": "Compare active medium, pumping, levels, output, CW/pulsed, applications across Ruby / He-Ne / semiconductor",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Excellent final revision question because it forces recall of active medium, pumping and operation for all three syllabus lasers.",
    "diagram": false,
    "mustInclude": [
      "Active medium",
      "Pumping",
      "Energy-level system",
      "Typical output",
      "Operation",
      "Applications"
    ]
  },
  {
    "id": "U4-38",
    "front": "Derive the critical-angle relation for an optical fibre.",
    "back": "sin C = n2/n1",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "It is the first mathematical step toward the acceptance-angle and NA derivation.",
    "diagram": true,
    "answerPattern": "sin C = n2/n1",
    "sources": [
      "IILM fibre notes",
      "IILM tutorial"
    ]
  },
  {
    "id": "U4-39",
    "front": "Explain total internal reflection in an optical fibre.",
    "back": "n1 > n2 and incidence > critical angle → TIR guides light along the core",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "The entire operating principle of a conventional optical fibre depends on TIR.",
    "diagram": true,
    "sources": [
      "IILM notes",
      "IILM Assignment"
    ]
  },
  {
    "id": "U4-40",
    "front": "Define acceptance angle and acceptance cone.",
    "back": "Acceptance angle α0: max external angle for guided rays · Acceptance cone: solid cone of half-angle α0",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "These are explicitly part of the fibre theory behind the NA derivation and AKTU repeatedly tests them.",
    "diagram": true,
    "diagramRequired": "Acceptance cone at the fibre entrance.",
    "sources": [
      "IILM notes",
      "AKTU question pattern"
    ]
  },
  {
    "id": "U4-41",
    "front": "Derive numerical aperture in terms of core and cladding refractive indices.",
    "back": "NA = √(n1²−n2²) for air",
    "priority": "A",
    "cardType": "derivation",
    "whyExists": "This is the mathematical core of the fibre section and repeatedly appears in AKTU exams.",
    "diagram": true,
    "answerPattern": "NA = √(n1²−n2²) for air",
    "sources": [
      "IILM Assignment Q5",
      "AKTU repeated question"
    ]
  },
  {
    "id": "U4-42",
    "front": "Differentiate step-index and graded-index optical fibres.",
    "back": "Step-index: abrupt n change · Graded-index: n decreases radially · different ray paths and modal dispersion",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Exact IILM assignment component and repeated AKTU fibre question.",
    "diagram": true,
    "sources": [
      "IILM Assignment Q4",
      "AKTU repeated question"
    ]
  },
  {
    "id": "U4-43",
    "front": "Differentiate single-mode and multimode optical fibres.",
    "back": "Single-mode: one mode, small core · Multimode: many modes, larger core · bandwidth and coupling differences",
    "priority": "A",
    "cardType": "concept",
    "whyExists": "Explicitly required in the IILM long question and tested in AKTU material.",
    "diagram": true,
    "sources": [
      "IILM Assignment Q4",
      "AKTU fibre questions"
    ]
  },
  {
    "id": "U4-44",
    "front": "Calculate the energy of a photon emitted by a laser of wavelength λ.",
    "back": "E = hc/λ",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Generalizes the exact Ruby-laser tutorial problem and prepares you for any wavelength.",
    "diagram": false,
    "answerPattern": "E = hc/λ"
  },
  {
    "id": "U4-45",
    "front": "Given total laser pulse energy and wavelength, calculate the number of photons emitted.",
    "back": "N = E_total λ/(hc)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "General form of the IILM tutorial's 0.5 J Ruby laser problem.",
    "diagram": false,
    "answerPattern": "N = E_total λ/(hc)"
  },
  {
    "id": "U4-46",
    "front": "Given N2/N1 and temperature, calculate the energy separation of two laser levels.",
    "back": "ΔE = −kT ln(N2/N1)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "General form of the exact IILM tutorial population problem.",
    "diagram": false,
    "answerPattern": "ΔE = −kT ln(N2/N1)"
  },
  {
    "id": "U4-47",
    "front": "Given N1 and N2, determine whether laser population inversion exists.",
    "back": "Inversion if N2>N1.",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "General form of the IILM tutorial question.",
    "diagram": false,
    "answerPattern": "Inversion if N2>N1."
  },
  {
    "id": "U4-48",
    "front": "Given n1 and n2, calculate NA and acceptance angle in air.",
    "back": "NA = √(n1²−n2²) · α0 = sin⁻¹(NA)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "The most important general fibre numerical pattern.",
    "diagram": true,
    "answerPattern": [
      "NA = √(n1²−n2²)",
      "α0 = sin⁻¹(NA)"
    ]
  },
  {
    "id": "U4-49",
    "front": "Given n1, n2 and an internal incidence angle, determine whether TIR occurs.",
    "back": "Cover: Calculate C → Compare i with C → State whether TIR occurs",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Generalizes the exact IILM tutorial Q9.",
    "diagram": true,
    "mustInclude": [
      "Calculate C",
      "Compare i with C",
      "State whether TIR occurs"
    ]
  },
  {
    "id": "U4-50",
    "front": "Given acceptance angle and n1, calculate n2.",
    "back": "n2 = √(n1²−sin²α0)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Generalizes the exact IILM tutorial Q10.",
    "diagram": false,
    "answerPattern": "n2 = √(n1²−sin²α0)"
  },
  {
    "id": "U4-51",
    "front": "Calculate the intensity of a laser beam from its power and beam diameter.",
    "back": "I = P/A = 4P/(πd²)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "This numerical appears in recent AKTU-oriented Unit 4 assignment material and is a useful laser-numerical extension.",
    "diagram": false,
    "answerPattern": "I = P/A = 4P/(πd²)",
    "sources": [
      "AKTU 2025-26 assignment"
    ]
  },
  {
    "id": "U4-52",
    "front": "Given number of active ions and laser wavelength, calculate the energy of the emitted pulse.",
    "back": "E_pulse = Nhc/λ",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Appears in recent AKTU-oriented Unit 4 assignment and tests photon energy × number of photons.",
    "diagram": false,
    "answerPattern": "E_pulse = Nhc/λ",
    "sources": [
      "AKTU 2025-26 assignment"
    ]
  },
  {
    "id": "U4-53",
    "front": "Calculate population ratio for two laser states when wavelength and temperature are given.",
    "back": "Cover: Find ΔE = hc/λ → Use N2/N1 = exp(-ΔE/kT)",
    "priority": "B",
    "cardType": "numerical",
    "whyExists": "Recent AKTU-oriented assignments use this form; it combines E=hc/λ with the Boltzmann relation.",
    "diagram": false,
    "mustInclude": [
      "Find ΔE = hc/λ",
      "Use N2/N1 = exp(-ΔE/kT)"
    ],
    "sources": [
      "AKTU 2025-26 assignment"
    ]
  },
  {
    "id": "U4-54",
    "front": "What is the difference between a three-level and four-level laser in terms of population inversion?",
    "back": "3-level: invert against ground · 4-level: lower laser level nearly empty → inversion at lower pump power",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "High-value AKTU extension and helps explain why four-level systems require less pumping.",
    "diagram": true
  },
  {
    "id": "U4-55",
    "front": "What is numerical aperture physically?",
    "back": "NA measures light-gathering ability: the sine of the maximum acceptance angle (in air, NA = sin α0).",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Prevents formula-only learning: NA measures the light-gathering ability of a fibre.",
    "diagram": false,
    "sources": [
      "IILM fibre notes"
    ]
  },
  {
    "id": "U4-56",
    "front": "Why must n1 > n2 in an optical fibre?",
    "back": "The core must be optically denser than the cladding so light can undergo TIR at their interface.",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Tests the physical condition required for TIR.",
    "diagram": false,
    "answer": "The core must be optically denser than the cladding so light can undergo TIR at their interface."
  },
  {
    "id": "U4-57",
    "front": "Compare the propagation of light in step-index and graded-index fibres.",
    "back": "Step-index: zig-zag meridional rays · Graded-index: continuously refracted curved paths; reduced intermodal delay",
    "priority": "B",
    "cardType": "concept",
    "whyExists": "Tests the actual ray behaviour rather than just memorizing refractive-index profiles.",
    "diagram": true
  },
  {
    "id": "U4-58",
    "front": "What is LASER? Expand the acronym.",
    "back": "Light Amplification by Stimulated Emission of Radiation.",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Easy 1-2 mark revision question.",
    "diagram": false,
    "answer": "Light Amplification by Stimulated Emission of Radiation."
  },
  {
    "id": "U4-59",
    "front": "List important applications of lasers.",
    "back": "Surgery, cutting/welding, communication, barcode scanners, holography, metrology, entertainment",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Explicitly in the current SLM and useful for short answers/conclusions.",
    "diagram": false,
    "sources": [
      "IILM SLM"
    ]
  },
  {
    "id": "U4-60",
    "front": "List important applications of optical fibre.",
    "back": "Telecom, LAN/data links, medical endoscopy, sensors, military/avionics, illumination",
    "priority": "C",
    "cardType": "short_answer",
    "whyExists": "Explicitly in the current SLM and useful for short answers.",
    "diagram": false,
    "sources": [
      "IILM SLM"
    ]
  },
  {
    "id": "U4-61",
    "front": "Draw and label the basic optical-fibre structure.",
    "back": "Cover: Core → Cladding → Protective coating/sheath",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "A diagram can be required inside construction/principle questions.",
    "diagram": true,
    "mustInclude": [
      "Core",
      "Cladding",
      "Protective coating/sheath"
    ]
  },
  {
    "id": "U4-62",
    "front": "Draw the Ruby laser energy-level diagram from memory.",
    "back": "Cover: Ground state → Pump level → Metastable level → Pumping transition → Non-radiative transition → Laser transition",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "Diagram is essential to a complete Ruby laser answer.",
    "diagram": true,
    "mustInclude": [
      "Ground state",
      "Pump level",
      "Metastable level",
      "Pumping transition",
      "Non-radiative transition",
      "Laser transition"
    ]
  },
  {
    "id": "U4-63",
    "front": "Draw the He-Ne laser energy-level scheme from memory.",
    "back": "He metastable levels → resonant transfer to Ne · Ne laser transitions (e.g. 632.8 nm) · lower Ne levels → ground",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "The IILM assignment explicitly requires the energy-level scheme.",
    "diagram": true
  },
  {
    "id": "U4-64",
    "front": "Draw step-index and graded-index refractive-index profiles.",
    "back": "Step-index: flat n1 in core, abrupt drop to n2 · Graded-index: n decreases smoothly from axis to cladding",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "Essential diagram for the fibre-classification long answer.",
    "diagram": true,
    "mustInclude": [
      "Step-index flat core profile",
      "Abrupt core-cladding step",
      "Graded-index parabolic/smooth decrease"
    ],
    "diagramRequired": "Side-by-side n(r) plots for step-index and graded-index fibres."
  },
  {
    "id": "U4-65",
    "front": "Draw acceptance-angle geometry and label all angles.",
    "back": "Label: α0 (acceptance), θ0/θ1 (air-core), φ (core-cladding incidence), C (critical angle), n1, n2",
    "priority": "C",
    "cardType": "exam_method",
    "whyExists": "You need the geometry to reproduce the NA derivation correctly.",
    "diagram": true,
    "mustInclude": [
      "Acceptance angle α0",
      "Core n1 and cladding n2",
      "Critical angle C",
      "Internal incidence at core-cladding interface"
    ],
    "diagramRequired": "Acceptance-angle geometry with core, cladding, normal, refracted ray and critical angle."
  },
  {
    "id": "U4-66",
    "front": "State the five most important Unit 4 formulas.",
    "back": "E=hc/λ · N2/N1=e^[-ΔE/kT] · sin C=n2/n1 · NA=√(n1²−n2²) · NA=sin α0 in air",
    "priority": "C",
    "cardType": "formula_revision",
    "whyExists": "Final 5-minute formula recall.",
    "diagram": false,
    "answer": [
      "E=hc/λ",
      "N2/N1=e^[-ΔE/kT]",
      "sin C=n2/n1",
      "NA=√(n1²−n2²)",
      "NA=sin α0 in air"
    ]
  },
  {
    "id": "U4-EX1",
    "front": "Exam sim: Derive Einstein A-B relations.",
    "back": "Cover: rates → Boltzmann → Planck → B12=B21 → A21/B21 = 8πhν³/c³",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Highest-value A+ derivation; direct IILM/AKTU long question.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill.",
    "diagramRequired": "Two-level diagram with absorption, spontaneous and stimulated emission.",
    "mustInclude": [
      "N1 B12 ρ(ν)",
      "N2 A21",
      "N2 B21 ρ(ν)",
      "B12 = B21",
      "A21/B21 = 8πhν³/c³"
    ]
  },
  {
    "id": "U4-EX2",
    "front": "Exam sim: Explain He-Ne laser with construction and energy-level diagram.",
    "back": "Cover: tube + mirrors → He excitation → transfer to Ne → inversion → CW output + applications",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Most repeatedly reported AKTU laser construction question.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill."
  },
  {
    "id": "U4-EX3",
    "front": "Exam sim: Explain Ruby laser with construction and energy-level diagram.",
    "back": "Cover: rod + flash lamp → three-level scheme → metastable → pulsed laser output",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Exact IILM long question and recurring AKTU Engineering Physics item.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill."
  },
  {
    "id": "U4-EX4",
    "front": "Exam sim: Classify optical fibres and compare step/graded and single/multimode.",
    "back": "Cover: RI profiles → step vs graded → single vs multimode ray diagrams",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Covers the entire fibre-classification syllabus block.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill."
  },
  {
    "id": "U4-EX5",
    "front": "Exam sim: Derive acceptance angle and numerical aperture.",
    "back": "Cover: Snell → critical angle → α0 → NA = n0 sin α0 = √(n1²−n2²)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Strongest recurring AKTU fibre derivation.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill.",
    "diagramRequired": "Acceptance-angle geometry."
  },
  {
    "id": "U4-EX6",
    "front": "Exam sim: Solve a photon-energy / number-of-photons numerical.",
    "back": "E = hc/λ · N = E_total λ/(hc)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Standard Ruby-laser tutorial numerical pattern.",
    "diagram": false,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill.",
    "answerPattern": [
      "E = hc/λ",
      "N = E_total λ/(hc)"
    ]
  },
  {
    "id": "U4-EX7",
    "front": "Exam sim: Solve a population-ratio numerical.",
    "back": "N2/N1 = exp(−ΔE/kT) · ΔE = −kT ln(N2/N1)",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Boltzmann population pattern from IILM tutorial.",
    "diagram": false,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill.",
    "answerPattern": [
      "N2/N1 = exp(−ΔE/kT)",
      "ΔE = −kT ln(N2/N1)"
    ]
  },
  {
    "id": "U4-EX8",
    "front": "Exam sim: Solve an NA / acceptance-angle / TIR numerical.",
    "back": "NA = √(n1²−n2²) · α0 = sin⁻¹(NA) · sin C = n2/n1 · compare i with C",
    "priority": "A",
    "cardType": "mock_exam",
    "whyExists": "Best multi-step fibre geometry practice pattern.",
    "diagram": true,
    "priorityNote": "A+ exam simulation: treat as a timed write-from-memory drill.",
    "diagramRequired": "Acceptance-angle geometry."
  }
] as Flashcard[];

export const quantumPhysicsUnit4: FlashcardDeck = {
  courseSlug: "quantum-physics",
  courseName: "Quantum Physics",
  semesterSlug: "1stsem",
  unitSlug: "unit-4",
  unitLabel: "Unit 4",
  title: "Semiconductor & Quantum Physics: Unit 4",
  courseCode: "26SOST101: Semiconductor and Quantum Physics",
  purpose: "Research-backed Exam Prep + Revision Question Bank: Photonics and Optical Communication",
  focus: ["Einstein coefficients & radiation-matter interaction", "Ruby, He-Ne & semiconductor lasers", "Optical fibre principle, NA & classification", "IILM Assignment + Tutorial numericals", "AKTU 3-level vs 4-level extensions"],
  ready: true,
  minimumExamSet: ["U4-01", "U4-02", "U4-03", "U4-04", "U4-05", "U4-11", "U4-13", "U4-14", "U4-15", "U4-16", "U4-17", "U4-19", "U4-22", "U4-29", "U4-41"],
  formulaSheet: ["E = hν = hc/λ", "ν = c/λ", "N = E_total λ/(hc)", "N2/N1 = exp[-(E2−E1)/(kT)]", "E2−E1 = −kT ln(N2/N1)", "sin C = n2/n1", "NA = n0 sin α0", "NA = √(n1²−n2²) for air", "α0 = sin⁻¹(NA)", "n2 = √(n1²−sin²α0)", "I = P/A = 4P/(πd²)"],
  diagramSet: ["Einstein two-level energy diagram", "Absorption transition", "Spontaneous emission transition", "Stimulated emission transition", "Basic laser cavity", "Ruby laser construction", "Ruby three-level energy diagram", "He-Ne laser construction", "He-Ne energy-level scheme", "Semiconductor laser p-n junction", "Optical fibre construction", "TIR inside optical fibre", "Acceptance-angle geometry", "Step-index refractive-index profile", "Graded-index refractive-index profile", "Single-mode propagation", "Multimode propagation", "Three-level laser", "Four-level laser"],
  cards,
};
