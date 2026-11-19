# ST-PAIR prototype change report

## What changed

Built a responsive, five-role ST-PAIR interface from the supplied UI/UX plan. The visual system follows the reference screenshots: light surfaces, compact sidebar, structured data panels, restrained borders, striped camera placeholders, and a focused urgent mobile alert.

The prototype connects the main sample workflows: Security response and reporting, Administrator incident review and approvals, System Administrator zone editing, Faculty receipt acknowledgement, and Student safety notification. It keeps severity, classification, verification, confidence, and response state distinct.

## Why

The plan called for a unified role-based campus safety experience with clear incident priority, human response controls, spatial zone context, and privacy boundaries. Interactive sample data makes the design reviewable without claiming a working detection or surveillance system.

## Files touched

- `index.html`, `styles.css`, `src.js`: app structure, design, screens, and interactions.
- `domain.js`, `domain.test.js`: sample data, permission and lifecycle rules, and tests.
- `package.json`, `package-lock.json`, `.gitignore`: local tooling and build setup.
- `README.md`, `report.md`: run instructions and change record.
- `preview.jpg`: browser capture of the Security Live Alert Console.

## Files not touched

No existing project files were present. The supplied text and reference images were read only.

## Verification

- `npm test`: four tests passed, covering incident lifecycle, role navigation, student alert routing, and zone geometry.
- `npm run build`: Vite production build passed.
- Browser readback: Security acknowledgement changed the available action to “Start Responding”; a submitted zone request appeared in the Administrator approval queue and changed to Approved after confirmation; the Student urgent notice rendered without CCTV or personal identity information.

## Limitations

This is a front-end demonstration with in-memory state. Camera frames and the incident clip are illustrations, not video. Production use requires server-side authorization, persistence, event streaming, institutional safety copy, approved configuration rules, and real data integration.

## Follow-up · 19 Nov 2026

Added confirmation dialogs before a System Administrator submits a severity rule change and before Faculty acknowledges an alert. The rule dialog names the proposed change and notes that Administrator approval is still required. The Faculty dialog clarifies that receipt acknowledgement does not change the Security response state.

Files touched: `src.js`, `styles.css`, `README.md`, `report.md`, `preview-rule-confirmation.jpg`, and `preview-faculty-confirmation.jpg`. The earlier preview was renamed to `preview.jpg` to match its JPEG content. Other application files were not changed.

Verification cases: Cancel left each action incomplete; confirming placed the rule request in the pending queue and changed the Faculty control to “Receipt acknowledged.” `npm test` passed all four tests and `npm run build` passed.

## Follow-up · Project Git ignore rules

Added `.gitignore` to this repository using the reviewed ST-PAIR prototype rules. It excludes dependencies, build output, coverage, Vite cache, local environment files, logs, editor settings, and OS metadata while keeping `.env.example` trackable. No existing source or configuration file was changed for this update.

Verification: read the new file back, confirmed it matches the source ignore file, and used `git check-ignore` to verify representative generated and local files are excluded. The existing `README.md` change and other untracked project files were left as found.

## Follow-up · Zone editor sensitivity control

Removed the sensitivity radio group from the zone editor and its unused styling. Zone submissions now preserve the selected zone's existing sensitivity instead of reading a removed form field. The campus zones table still displays the current value. Updated `src.js`, `domain.js`, `domain.test.js`, and `styles.css`; no other application source was changed.

Verification: five tests passed, including a new case for preserving sensitivity; the production build passed. Browser readback showed the editor without the radio group and a pending request without an empty sensitivity value.

## Follow-up · Zone add and removal controls

Added a confirmation dialog before creating a draft zone and a Remove action to each campus zone row. Removing a draft takes effect after confirmation. Removing an active zone creates an Administrator approval request; the zone remains active until approval, and a rejected request leaves it in place. Approval removes the zone and clears its camera mapping. Updated `src.js`, `domain.js`, `domain.test.js`, and `styles.css`.

Verification: seven tests and the production build passed. Browser checks covered add cancel/confirm, draft remove cancel/confirm, and active removal entering the approval queue while the zone remained listed.

## Follow-up · Action confirmation dialogs

Added confirmation dialogs for Security acknowledgement and false-alarm disposition, Administrator approval and rejection, zone-change submission, and discarding zone edits. The existing resolution confirmation now uses the same dialog. Confirming Cancel edits restores the saved form values and default polygon; cancelling the dialog leaves edits in place. Updated `src.js`; no other application source was changed.

Verification: browser checks exercised cancel and confirm for all six requested actions, plus the resolution dialog. Seven existing tests and the production build passed in the ST-PAIR project.
