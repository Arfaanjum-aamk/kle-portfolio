export type VerificationStatus = 'not_checked' | 'draft' | 'verified' | 'needs_source'

export const clutchBenchSources = [
  { title: 'LOG BOOK SOFT COPY.pdf', sourceType: 'document', status: 'used', notes: 'A1 Need Statement and A2 Design Input Freeze, both dated 28/09/26. Primary source for every value on the Class 1 page.' },
  { title: 'LOG BOOK SOFT COPY.pdf — A3 to A5', sourceType: 'document', status: 'cross_check', notes: 'Foundation Integration Map (02/10/26), Candidate Functional Requirements (02/10/26), and Gate Check Rehearsal (07/10/26). Used for A3, A4, A5 and cross-checks.' },
  { title: 'LOG BOOK SOFT COPY(2).pdf — A6 Divergence Sprint', sourceType: 'document', status: 'used', notes: 'Six layouts by six team members, dated 08/10/26. Source of every A6 entry.' },
  { title: 'LOG BOOK SOFT COPY(2).pdf — A7 concept sheets 1 to 3', sourceType: 'document', status: 'used', notes: 'Concept 1 (10/10/26), Concept 2 (10/10/26), Concept 3 (11/10/26). Source of every A7 answer and sketch reference.' },
  { title: 'LOG BOOK SOFT COPY(2).pdf — earlier A3 to A5 pages', sourceType: 'document', status: 'cross_check', notes: 'Used only for the cross-references under the Class 3 comparison.' },
  { title: 'Mini_Project_Class1.pptx', sourceType: 'instruction', status: 'not_received', notes: 'The file did not arrive with the supplied materials; the A1 purpose and peer-check wording follow the project material available.' },
  { title: 'Mini_Project_Class2.pptx', sourceType: 'instruction', status: 'not_received', notes: 'The file did not arrive with the supplied materials; the A3-A5 structure follows the available project material.' },
  { title: 'Mini_Project_Class3.pptx', sourceType: 'instruction', status: 'not_received', notes: 'The file was not available; the A6/A7 formats follow the available project material.' },
]

export const a1Reference = {
  background: [
    { basis: 'logbook', text: 'The project is a lab bench built around a second-hand centrifugal clutch, a used 1440 rpm motor and a pulley drive. The A2 page records a clutch drum of about Ø105–110 mm on a 20 mm shaft, with the whole set-up on one bench plate.' },
    { basis: 'inferred', text: 'Because the clutch is second-hand, its real engagement speed and torque capacity are unknown until a bench exists to measure them. That gap is what the bench is meant to close.' },
  ],
  problem: 'A centrifugal clutch goes from slipping to locked as speed rises. The logbook asks for a bench on which an engineering student and a lab instructor can see that change happen and measure the torque the drive delivers, at least 5 N·m, within ₹6000.',
  whyItMatters: [
    { basis: 'logbook', text: 'Until the shoes lock, the clutch slips and turns power into heat. A2 puts this at about 500 W at 5 N·m and 100 rad/s of slip. The expected engagement band is 1500–2000 rpm, but A2 warns that clutches often engage nearer 2500–3500 rpm. Neither figure has been measured yet.' },
    { basis: 'inferred', text: 'A user who knows the engagement speed can pick a motor speed that locks the clutch before the brake is loaded, which keeps slip heat down.' },
  ],
  purpose: [
    { basis: 'logbook', text: 'To make engagement visible and measurable. Torque is read from a Prony brake on the clutch drum (T = F × r) using a 0–5 kg hanging scale. The A4 page adds tachometers on the input and output shafts, so the change from slipping to locked can be shown as well as measured.' },
    { basis: 'inferred', text: 'The intended use is short, supervised demonstrations in which a student compares engagement at different motor speeds.' },
  ],
  users: 'An engineering student and a lab instructor, working at an indoor college lab bench on a 230 V single-phase supply.',
  limits: ['≥ 5 N·m target torque', '≤ ₹6000 total cost', '≤ 800 × 400 mm footprint', '≤ 30 s loaded run', 'Drum ≤ 80 °C', '1500–2000 rpm expected engagement'],
  drafts: [
    { n: 1, torque: '≥ 15 N·m', budget: '₹10000', text: 'An engineering student and lab instructor need to see and measure, on a lab bench, a drive going from slipping to locked as speed rises, delivering at least 15 N·m within ₹10000 with centrifugal clutch and induction motor.' },
    { n: 2, torque: '≥ 10 N·m', budget: '₹8000', text: 'An engineering student and lab instructor need to see and measure, on a lab bench, a drive going from slipping to locked as speed rises, delivering at least 10 N·m within ₹8000 with centrifugal clutch and 3-phase IM.', note: 'The last words are hard to read; 3-phase IM is the best reading used in the source.' },
    { n: 3, torque: '≥ 5 N·m', budget: '₹6000', text: 'An engineering student and lab instructor need to see and measure, on a lab bench, a drive going from slipping to locked as speed rises, delivering at least 5 N·m within ₹6000 with centrifugal clutch, induction motor and pulley.' },
  ],
  finalNeed: 'An engineering student and lab instructor need to see and measure, on a lab bench, a drive going from slipping to locked as speed rises, delivering at least 5 N·m within ₹6000 with centrifugal clutch, induction motor and pulley.',
  peerCheck: [
    { question: 'Does the statement identify a person or system?', mark: 'Person' },
    { question: 'Does it describe the need rather than prescribe a mechanism?', mark: 'Need, not mechanism' },
    { question: 'Does it contain at least one measurable number?', mark: 'Number' },
  ],
  scope: 'Activity A1 (Need Statement) and A2 (Design Input Freeze), both dated 28/09/26. The work records a need, a set of design inputs with sources, and the questions still open. Later logbook pages (A3 to A5) are used here only as cross-checks in the design notes.',
  scopeNote: 'Nothing on the supplied page claims that the bench has been manufactured, fully calculated or validated. The logbook pages used here contain no test data.',
}

export const a2Reference = {
  rule: 'Every design input must have a value, unit, and traceable source. Changes to frozen inputs may require recalculation.',
  inputs: [
    { category: 'Load', what: 'Prony brake on the clutch drum, arm 0.30 m, read on 0–5 kg hanging scale (T = F × r). Design torque.', values: ['Target 5 N·m', 'Measurable up to 14.7 N·m', '1 HP (746 W)'], source: ['Project brief', 'Motor limited as explained above', 'Given motor specification'], notes: ['Arithmetic check: 5 kgf × 9.81 × 0.30 m = 14.7 N·m, the full range of this arm and scale.', 'The page reads “1 HP (746 W)”. It sits beside the motor specification source, so it is probably the motor rating.'], status: 'frozen' },
    { category: 'Motion', what: '1440 rpm used motor, 4-step cone pulley feeding the clutch input shaft.', values: ['1000 / 1400 / 2000 / 2500 rpm', 'Engagement expected at 1500–2000 rpm'], source: ['Motor nameplate', 'Engagement will be confirmed by test', 'Centrifugal clutch testing'], notes: ['The page does not say the listed speeds are the four pulley-step speeds; that reading is an interpretation.'], status: 'measure' },
    { category: 'Size', what: 'Whole set-up on one bench plate. Clutch drum about Ø105–110 mm, 20 mm shaft.', values: ['≤ 800 × 400 mm footprint'], source: ['Initial bench-top design assumption', 'Shaft strength and component selection'], notes: [], status: 'assumed' },
    { category: 'Duty', what: 'Short demonstrations, not continuous running. Check drum temperature with an IR thermometer.', values: ['≤ 30 s loaded run', '2 min cool down', 'Drum ≤ 80 °C'], source: ['Assumed from slip heat (≈ 500 W at 5 N·m, 100 rad/s slip)'], notes: [], status: 'assumed' },
    { category: 'Place', what: 'Indoor college lab bench, 230 V single phase, total cost limit.', values: ['≤ ₹6000'], source: ['Brief'], notes: ['The budget is written in the Place row of the logbook page.'], status: 'frozen' },
    { category: 'Still Unknown', what: 'Actual engagement rpm of the second-hand clutch (clutches often engage nearer 2500–3500 rpm), torque capacity before slipping, shoe lining condition, motor starting current.', values: ['To be measured'], source: ['First bench test', 'Weaker springs may be needed'], notes: [], status: 'measure' },
  ],
  keyInputs: [
    ['Target torque', '5', 'N·m', 'Design torque, delivered once the clutch is locked. Read from the Prony brake on the clutch drum.', 'frozen'],
    ['Measurement ceiling', '14.7', 'N·m', '0.30 m arm with a 0–5 kg hanging scale.', 'frozen'],
    ['Motor speed', '1440', 'rpm', 'Used motor, from the nameplate. Speeds listed: 1000 / 1400 / 2000 / 2500 rpm.', 'frozen'],
    ['Expected engagement', '1500–2000', 'rpm', 'To be confirmed by test. A used clutch may engage nearer 2500–3500 rpm.', 'measure'],
    ['Bench footprint', '≤ 800 × 400', 'mm', 'Initial bench-top design assumption.', 'assumed'],
    ['Budget ceiling', '≤ 6000', '₹', 'Total cost limit from the brief. Indoor lab bench, 230 V single phase.', 'frozen'],
    ['Loaded run', '≤ 30', 's', 'Then 2 min cool down. Assumed from slip heat of about 500 W.', 'assumed'],
    ['Drum temperature', '≤ 80', '°C', 'Checked with an IR thermometer.', 'assumed'],
  ],
  designNotes: [
    ['Torque measurement and calibration', 'logbook + inferred', 'The Prony brake has a 0.30 m arm and is read on a 0–5 kg hanging scale, so T = F × r reaches 14.7 N·m at full scale. A3 and A4 set an accuracy target of ±0.2 N·m. How the scale will be calibrated is not yet decided.'],
    ['Motor and drive selection', 'logbook', 'The motor runs at 1440 rpm and feeds the clutch through a 4-step cone pulley. Since P = Tω, A3 records that 5 N·m at 1440 rpm needs a motor of about 0.75 kW or more, and A5 gives this as the reason the target fell from 15 N·m to 5 N·m.'],
    ['Centrifugal clutch engagement', 'logbook', 'The shoes engage when centrifugal force (F = mω²r) overcomes the spring force, expected at 1500–2000 rpm. The clutch is second-hand, so A2 notes weaker springs may be needed. A4 proposes a tachometer on the input shaft, repeating the engagement test five times.'],
    ['Shaft and bearing strength', 'logbook + inferred', 'The shaft is 20 mm. With τ = 16T/πd³, A3 records about 9.6 MPa at 15 N·m. Bearing loads and bearing selection are not yet in the logbook.'],
    ['Bench stability and component mounting', 'logbook + inferred', 'Everything sits on one bench plate within 800 × 400 mm. Mounting for the motor, bearings, clutch and brake, and how the brake arm reaction is carried, have not been designed.'],
    ['Safety around rotating components', 'logbook', 'A4 (FR-4) requires 100% of rotating parts guarded, an emergency stop within reach, and a pre-run safety check with inspection by the guide. The belt, shaft and clutch drum are the exposed parts. The guard is not yet drawn.'],
    ['Thermal behaviour during repeated engagement', 'logbook', 'Slipping at 5 N·m produces about 500 W of heat. The duty is therefore limited to a 30 s loaded run, a 2 min cool down and a drum temperature of 80 °C or less. All three limits are assumptions until measured.'],
    ['Budget-conscious component selection', 'logbook + inferred', 'The whole bench has a ₹6000 ceiling. The clutch and motor are second-hand or used, which keeps cost down. The logbook lists no costs yet for the plate, bearings, guard, scale or tachometers.'],
  ],
  toVerify: [
    ['Actual engagement rpm of the second-hand clutch', 'Expected 1500–2000 rpm. A2 notes clutches often engage nearer 2500–3500 rpm.'],
    ['Torque capacity before slipping', 'The A1 target is at least 5 N·m. The clutch has not been tested against it.'],
    ['Shoe lining condition', 'Not inspected in the logbook.'],
    ['Motor starting current', 'Not measured. A2 lists it under Still Unknown.'],
    ['Whether weaker springs are needed', 'A2 says this may follow from the first bench test.'],
  ],
  transcriptionFlags: [
    ['Draft 2, last words', 'The handwriting after “centrifugal clutch and” is hard to read. This page shows “3-phase IM” as a best reading.'],
    ['Final need statement, word order', 'The budget and “pulley” are placed differently in the handwritten final than in Draft 3. This page follows Draft 3 for the order.'],
    ['Lower bound of the torque range', 'The brief mentions about 1 N·m as the lower end. The A2 page only says “measurable up to 14.7 N·m”, so no lower bound is shown here.'],
    ['“1 HP (746 W)” in the Load row', 'Read as the motor rating. Confirm the units and what it refers to.'],
    ['Meaning of 1000 / 1400 / 2000 / 2500 rpm', 'Probably the four cone-pulley speeds. The page does not say so.'],
    ['Guide’s initials', 'Blank on the scanned A1 and A2 pages. Sign-off is still to be recorded.'],
  ],
}

export const a3Reference = {
  rows: [
    ['Spring and shoe selection', 'Engineering Mechanics / Physics', 'Centrifugal force against spring force', 'F = mω²r', 'Shoes engage at 1500–2000 rpm', 'The symbol/relationship should be checked against the original page.'],
    ['Clutch torque capacity', 'Engineering Mechanics', 'Coulomb friction', 'T = n·μ·N·R', 'Transmits ≥ 5 N·m without sustained slip once locked', 'The symbol n is not defined on the page.'],
    ['Torque measurement', 'Engineering Mechanics / Measurement', 'Torque moment, Prony brake', 'T = F × R', 'Torque measured ± 0.2 N·m', 'Measurement method is tied to the 0.30 m Prony brake arm.'],
    ['Motor selection', 'Basic Electrical Engineering', 'Induction motor torque-speed curve', 'P = Tω', 'Motor ≥ 0.75 kW, giving ≥ 5 N·m at 1440 rpm', 'The 0.75 kW value is close to the 5 N·m requirement; check margin.'],
    ['Shaft sizing', 'Strength of Materials', 'Torsion', 'τ = 16T / πd³', '20 mm shaft at 15 N·m gives τ = 9.6 MPa, FoS > 10', 'The factor-of-safety text is hard to read on the scan.'],
    ['Slip heating', 'Thermodynamics / Heat transfer', 'Slip power turns into heat', 'P = T·Δω', 'Loaded slip run ≤ 30 s; drum ≤ 80 °C', 'The 30 s and 80 °C limits are carried from A2 assumptions.'],
  ],
  narrative: 'Each row starts with a decision the bench has to make, names the subject that governs it, states the equation used, and ends with a draft requirement that can later be tested. Engineering Mechanics governs how the shoes engage, how much torque the clutch can carry and how torque is measured. Basic Electrical Engineering sizes the motor through P = Tω. Strength of Materials checks the 20 mm shaft in torsion, at 15 N·m, which is the Draft 1 torque and three times the 5 N·m target. Thermodynamics limits how long the clutch may slip. Several draft requirements repeat A2 inputs: 1500–2000 rpm, 5 N·m, 30 s, 80 °C and the 20 mm shaft. Three add numbers that A2 does not list: ±0.2 N·m, 0.75 kW and 9.6 MPa.',
  subjects: [
    ['Engineering Mechanics', '3', 'Two rows also list Physics and Measurement'],
    ['Basic Electrical Engineering', '1', 'Motor selection'],
    ['Strength of Materials', '1', 'Shaft sizing'],
    ['Thermodynamics / Heat transfer', '1', 'Slip heating'],
  ],
}

export const a4Reference = {
  requirements: [
    ['FR-1', 'Transmit no torque to the output shaft below engagement speed, and begin transmitting at it.', 'Engagement at 1500–2000 rpm', 'Tachometer on the input shaft. Note the rpm when the output starts. Repeat 5 times.'],
    ['FR-2', 'Deliver measurable torque to the load once locked.', '≥ 5 N·m at 1440 rpm input', 'Prony brake: scale reading (kgf) × 9.81 × 0.30 m. Accuracy ±0.2 N·m.'],
    ['FR-3', 'Show the change from slipping to locked.', 'Output speed ≥ 95% of input speed to lock-up', 'Tachometers on both shafts. Painted marker stripes for the visual.'],
    ['FR-4', 'Run safely every time.', '100% of rotating parts guarded. Emergency stop within reach.', 'Pre-run safety check and inspection by the guide. IR thermometer in drum.'],
  ],
  traceability: [
    ['FR-1', '1500–2000 rpm', 'Motion: engagement expected at 1500–2000 rpm', 'traced', 'A2 Still Unknown warns a used clutch may engage nearer 2500–3500 rpm, so this target is unconfirmed until measured.'],
    ['FR-2', '≥ 5 N·m at 1440 rpm', 'Load: target 5 N·m, Prony brake, 0.30 m arm. Motion: 1440 rpm motor.', 'traced', 'The ±0.2 N·m accuracy is in A3 row 3 but not in A2.'],
    ['FR-3', 'Output ≥ 95% of input speed', 'None. A2 has no speed-ratio input and no tachometers.', 'flag', 'Record the source of the 95% figure.'],
    ['FR-4', '100% guarded. Emergency stop within reach.', 'Duty: IR thermometer check, drum ≤ 80 °C (for the measurement method only).', 'partial', '“Within reach” has no number or unit.'],
  ],
  checks: [
    ['At least three requirements', 'traced', 'Four are recorded, FR-1 to FR-4.'],
    ['Each has an ID, a statement, a target with unit and a method', 'partial', 'FR-1 to FR-3 have all four. In FR-4 the target “within reach” has no number or unit.'],
    ['Requirements state outcomes, not mechanisms', 'partial', 'Statements describe outcomes, and the Prony brake, tachometers and IR thermometer appear only in the method column. FR-4 names an emergency stop inside its target.'],
  ],
  reviewNotes: [
    'FR-2: ±0.2 N·m on a 0.30 m arm is about ±0.07 kgf at the scale (0.2 ÷ (9.81 × 0.30)). Check that the 0–5 kg scale can be read that finely.',
    'FR-3: add where the 95% figure comes from, or measure the speed ratio first and then fix the target.',
    'FR-4: “within reach” could be given as a distance in mm, or as the time in seconds to bring the shafts to rest.',
  ],
}

export const a5Reference = {
  question: 'Which foundational learning would become invisible if this project were judged only on whether it works?',
  answer: [
    { subject: 'Engineering Mechanics', text: 'If the project is judged only on whether it works, we lose the Engineering Mechanics, because a clutch can lock up without anyone checking the centrifugal force against spring force (F = mω²r) that decides when it engages, or the friction torque (T = n·μ·N·R) that decides how much load it can carry.', links: ['Spring and shoe selection · F = mω²r', 'Clutch torque capacity · T = n·μ·N·R'] },
    { subject: 'Basic Electrical Engineering', text: 'We also lose the Basic Electrical part because P = Tω is the reason we cut the target from 15 N·m to 5 N·m at 1440 rpm, needs about 2.3 kW, and a 0.75 kW motor gives only about 5 N·m.', links: ['Motor selection · P = Tω'] },
    { subject: 'Thermodynamics / Heat transfer', text: 'And we lose the heat calculation from Thermodynamics because slipping at 5 N·m makes about 500 W of heat, so the clutch can work once still burn its lining, which we run to 30 s, and check drum temperature.', links: ['Slip heating · P = T·Δω'] },
  ],
  review: { heard: 'Yes', decision: 'Convincing', missing: 'Nothing major. They said the answer was clear and linked well with A3.' },
  claims: [
    ['F = mω²r against spring force', 'A3 row 1, Spring and shoe selection'],
    ['T = n·μ·N·R decides the load the clutch can carry', 'A3 row 2, Clutch torque capacity'],
    ['P = Tω, and a 0.75 kW motor gives about 5 N·m at 1440 rpm', 'A3 row 4, Motor selection'],
    ['Target cut from 15 N·m to 5 N·m', 'A1 Draft 1 and Draft 3'],
    ['About 500 W of heat when slipping at 5 N·m', 'A2 Duty and source column'],
    ['30 s run and drum temperature check', 'A2 Duty and A3 row 6, Slip heating'],
  ],
  gateRationale: 'A working prototype shows that a result was reached. It does not show that the spring, motor, shaft and run time were chosen for stated reasons. Without those reasons, a clutch could lock up by luck, a motor could prove too small only when it stalls, and a lining could burn before anyone expected the heat. The gate question asks the team to show the foundational reasoning that a successful demonstration would hide.',
  missingFoundations: 'The answer covers Engineering Mechanics, Basic Electrical Engineering and Thermodynamics. Strength of Materials (A3 row 5, shaft sizing) is not named, and neither is torque measurement. This does not make the answer wrong. It is something a reviewer might ask about.',
}

export const a6Layouts = [
  { no: 1, sketch: 'Sketch 1', title: 'Straight-line layout on one plate', drawnBy: 'Pavankumar', date: '2026-10-10', varies: 'Layout of all components in a single straight line on one plate.', loadPath: 'Torque from clutch output shaft is resisted by the disc brake. The reaction force is measured by the load cell / spring scale attached to the brake arm. Force path is linear and direct.', weakness: 'Long base plate needed; belt can slip or come off; open rotating parts need good guarding; Prony brake arm must be exactly horiz… for accurate reading.', labels: '220 V · motor · pulley · ball bearing · clutch · disc brake · load cell', redPath: 'Red arrows run along the belt, down through each ball bearing support to the base, along the shaft through the clutch to the disc, and from the disc brake to the load cell.', flags: ['The scan edge cuts the end of the word after “horiz” (probably “horizontal”). The next line, “for accurate reading.”, is readable.', 'The sheet names a disc brake, a load cell, a spring scale and a Prony brake arm. Confirm which of these the concept uses.'] },
  { no: 2, sketch: 'Sketch 4', title: 'Petrol engine', drawnBy: 'Afaanjum Khan', date: '2026-10-10', varies: 'Power source (petrol engine instead of electric motor).', loadPath: 'Engine torque goes directly into the clutch (no belt). Clutch output is resisted by the Prony brake, and measured on spring scale.', weakness: 'Lower available torque (only ~2–4 N·m); noise, vibration, exhaust smoke and fuel handling; also harder to control exact speed; safe… and.', labels: 'petrol engine · throttle · fuel · smoke goes outside · no belt · ball bearing · clutch · spring scale', redPath: 'Red arrows run along the shaft from the engine into the clutch, down through the ball bearing support to the base, and from the clutch along a line to the spring scale.', flags: ['The weakness line is cut off by the edge of the scan after “safe”, and the last line reads only “and.” The full wording is missing.', 'The mark before “2–4” reads as a tilde (about).', '“Exact speed” is a best reading. The handwriting could also be read as “road speed”.'] },
  { no: 3, sketch: 'Sketch 6', title: 'Flywheel', drawnBy: 'Manikanta Desai', date: '2026-10-11', varies: 'Type of load (inertia / energy storage instead of friction brake).', loadPath: 'Clutch accelerates the heavy flywheel. The torque is used to overcome the inertia of the flywheel. No continuous braking force. Load is dynamic.', weakness: 'Difficult to measure exact torque value; flywheel is heavy and dangerous if it comes loose; longer time needed to reach steady speed; hard to show sustained locked torque.', labels: '220 V · motor · pulley · ball bearing · clutch · painted stripe · heavy flywheel · spin up', redPath: 'Red arrows run along the belt, down through each ball bearing support to the base, and along the shaft through the clutch to the flywheel.', flags: ['The words “if it comes loose” are hard to read and are given as a best reading.', 'The sketch number is written so that it could be a 5 or a 6. This page shows 6.'] },
  { no: 4, sketch: 'Not separately assigned in A7', title: 'Protected motor / boxed layout', drawnBy: 'Afaanjum Khan', date: '', varies: 'Where the motor sits.', loadPath: 'Motor and belt hidden inside a box; only clutch and brake are on top.', weakness: 'Same parts as Layout 1, but safer and smaller on the bench.', labels: 'Clutch and brake on top; motor and belt enclosed.', redPath: 'Not separately recorded in the supplied A6 text.', flags: ['A6 row 2 identifies the author as Shishir Prabhu; the A7-linked concept is Concept 2 by Afaanjum Khan. The source should be kept exactly as recorded and checked against the original logbook.'] },
  { no: 5, sketch: 'Not separately assigned in A7', title: 'Clear-lid / upright clutch layout', drawnBy: 'Spoorthi', date: '', varies: 'Direction of the shaft.', loadPath: 'Clutch stands upright under a clear lid so the shoe can be viewed from above.', weakness: 'Same parts as Layout 1, but with a different way of seeing the clutch.', labels: 'Clear lid · upright clutch · brake layout.', redPath: 'Not separately recorded in the supplied A6 text.', flags: ['The source notes say to check the spelling of Spoorthi.'] },
  { no: 6, sketch: 'Sketch 6 / A7 Concept 3 link', title: 'Heavy flywheel load', drawnBy: 'Manikanta Desai', date: '2026-10-11', varies: 'The load.', loadPath: 'Clutch spins up a heavy flywheel.', weakness: 'Same idea as Layout 5; different from the brake layouts.', labels: 'Heavy flywheel · spin up.', redPath: 'The A7-linked red force path runs along the belt, through the bearing supports and shaft, through the clutch to the flywheel.', flags: ['The source A6 table identifies this as layout 6 and links it to Concept 3.'] },
]

export const a6Grouping = [
  ['Brake layouts', '1, 2, 3', 'Same parts, arranged or viewed differently. The load is a brake.'],
  ['Different power source', '4', 'A petrol engine in place of the electric motor and belt.'],
  ['No-brake loads', '5, 6', 'The clutch drives a dynamo or spins up a flywheel instead of working against a brake.'],
]

export const a6Narrative = 'Layouts 1, 2 and 3 use the same parts and differ in where the motor sits or how the clutch is viewed, so they are one family. Layout 4 changes the power source, and layouts 5 and 6 change the load and drop the brake. The Same as / different from column makes this grouping explicit: six sketches fall into three genuinely different ideas. Checking each layout against the others before developing any of them is what exposes that two layouts which look different on paper may be the same idea.'
export const a6ToA7 = 'Layouts 1, 4 and 6 carry the same sketch numbers and drawer names as A7 Concepts 1, 2 and 3. Layouts 2, 3 and 5 are not developed in A7.'

export const a7Concepts = [
  { no: 1, title: 'Straight-line layout on one plate', sketch: 'Sketch 1', drawnBy: 'Pavankumar', date: '2026-10-10', whatChanges: 'Layout: all components in one straight line on one plate.', howItWorks: 'Torque from the clutch output is resisted by the disc brake; the reaction is measured at the brake arm. The source describes a direct linear force path.', advantages: '', weaknesses: 'Long base plate; belt can slip or come off; open rotating parts need guarding; Prony brake arm must be exactly horizontal for accurate reading.', verification: 'A2 and A4 measure torque with a Prony brake and a 0–5 kg hanging scale. A load cell is not an A2 input. Concept 1 mentions both a load cell and a spring scale. Guide initials were blank on the scan.' },
  { no: 2, title: 'Petrol engine', sketch: 'Sketch 4', drawnBy: 'Afaanjum Khan', date: '2026-10-10', whatChanges: 'Power source: petrol engine instead of electric motor.', howItWorks: 'Engine torque goes directly into the clutch with no belt. Clutch output is resisted by the Prony brake and measured on a spring scale.', advantages: '', weaknesses: 'Only about 2–4 N·m available; noise, vibration, exhaust smoke and fuel handling; harder to control exact speed. The end of the handwritten weakness statement is cut off.', verification: 'Recorded torque of about 2–4 N·m is below the 5 N·m target in the A1 final need and FR-2. The unit on the source is read as N·m; confirm against the original. The A6 handwriting also has an ambiguity around “exact speed”.' },
  { no: 3, title: 'Flywheel', sketch: 'Sketch 6', drawnBy: 'Manikanta Desai', date: '2026-10-11', whatChanges: 'Type of load: inertia / energy storage instead of friction brake.', howItWorks: 'The clutch accelerates a heavy flywheel. Torque is used to overcome flywheel inertia; there is no continuous braking force and the load is dynamic.', advantages: '', weaknesses: 'Difficult to measure exact torque value; flywheel is heavy and dangerous if it comes loose; longer time to reach steady speed; hard to show sustained locked torque.', verification: 'It records difficulty in measuring exact torque. FR-2 asks for torque measured to ±0.2 N·m. The sketch number is recorded as 6, although the handwriting could be read as 5 or 6.' },
]

export const a7Comparison = [
  ['What it varies', 'Layout: all components in one straight line on one plate', 'Power source: petrol engine instead of electric motor', 'Type of load: inertia / energy storage instead of friction brake'],
  ['Resists the clutch output', 'Disc brake, with the reaction measured by a load cell / spring scale on the brake arm', 'Prony brake, measured on a spring scale', 'Heavy flywheel, accelerated by the clutch. No continuous braking force'],
  ['Drive, from the sketch', '220 V motor, pulley and belt', 'Petrol engine, no belt', '220 V motor, pulley and belt'],
  ['Likely weakness', 'Long base plate. Belt can slip or come off. Open rotating parts need guarding. Prony brake arm must be exactly horiz… for accurate reading.', 'Only ~2–4 N·m available. Noise, vibration, exhaust smoke, fuel handling. Harder to control exact speed.', 'Hard to measure exact torque. Heavy flywheel is dangerous if it comes loose. Longer time to reach steady speed. Hard to show sustained locked torque.'],
  ['Drawn by', 'Pavankumar', 'Afaanjum Khan', 'Manikanta Desai'],
  ['Date', '10/10/26', '10/10/26', '11/10/26'],
  ["Guide's initials", 'Blank on the scan', 'Blank on the scan', 'Blank on the scan'],
]

export const a7Review = 'Each concept changes a different thing. Concept 1 changes the layout, Concept 2 changes the power source and Concept 3 changes the type of load. Concepts 1 and 3 share the same motor and belt drive, so what separates them is the load. All three keep the clutch, shaft and ball bearings, and all three show a red force path in the sketch. None is selected here. Choosing between them belongs to the later concept-selection activity.'

export const a7CrossChecks = [
  ['Concept 1', 'The A2 and A4 pages measure torque with a Prony brake and a 0–5 kg hanging scale. A load cell is not an A2 input. Concept 1 mentions both a load cell and a spring scale.'],
  ['Concept 2', 'Its recorded torque of about 2–4 N·m is below the 5 N·m target in the A1 final need and in FR-2.'],
  ['Concept 3', 'It records difficulty in measuring exact torque. FR-2 asks for torque measured to ±0.2 N·m.'],
]
