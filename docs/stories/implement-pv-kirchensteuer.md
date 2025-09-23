<!-- Powered by BMAD™ Core -->

# Create Brownfield Story Task

## Purpose

Create a single user story for very small brownfield enhancements that can be completed in one focused development session. This task is for minimal additions or bug fixes that require existing system integration awareness.

## When to Use This Task

**Use this task when:**

- The enhancement can be completed in a single story
- No new architecture or significant design is required
- The change follows existing patterns exactly
- Integration is straightforward with minimal risk
- Change is isolated with clear boundaries

**Use brownfield-create-epic when:**

- The enhancement requires 2-3 coordinated stories
- Some design work is needed
- Multiple integration points are involved

**Use the full brownfield PRD/Architecture process when:**

- The enhancement requires multiple coordinated stories
- Architectural planning is needed
- Significant integration work is required

## Instructions

### 1. Quick Project Assessment

Gather minimal but essential context about the existing project:

**Current System Context:**

- [x] Relevant existing functionality identified: The application currently performs pension calculations, including income tax (EkSt.).
- [x] Technology stack for this area noted: TypeScript/Vue.js
- [x] Integration point(s) clearly understood: The new calculations will integrate with the existing pension calculation logic, likely within `calculation.service.ts`.
- [x] Existing patterns for similar work identified: The existing income tax calculation in `calculation.service.ts` will serve as a pattern for adding the church tax. The PV calculation will need to integrate with existing user data (presence of children).

**Change Scope:**

- [x] Specific change clearly defined:
    *   Implement logic to calculate PV based on the presence of children.
    *   Implement logic to calculate Kirchensteuer based on income and church affiliation.
- [x] Impact boundaries identified: The changes will primarily affect the `calculation.service.ts` and potentially the UI components that display the results (`CalculatorResultsTable.vue`) and input forms (`CalculatorInputForm.vue`) to capture child information and church affiliation.
- [x] Success criteria established:
    *   PV is correctly calculated based on child status.
    *   Kirchensteuer is correctly calculated and displayed alongside EkSt.
    *   The UI allows input for child status and church affiliation.

### 2. Story Creation

#### Story Title

Implement PV and Kirchensteuer in Pension Calculation - Brownfield Addition

#### User Story

As a {{user type: user calculating my pension}},
I want {{specific action/capability: the system to accurately calculate Pflegeversicherung (PV) based on my child status and Kirchensteuer (church tax) in addition to income tax}},
So that {{clear benefit/value: I have a more comprehensive and accurate overview of my net pension}}.

#### Story Context

**Existing System Integration:**

- Integrates with: Existing pension calculation logic (likely `calculation.service.ts`)
- Technology: TypeScript/Vue.js
- Follows pattern: Existing income tax calculation for Kirchensteuer; existing user data handling for child status.
- Touch points: `calculation.service.ts`, `CalculatorInputForm.vue` (for new inputs), `CalculatorResultsTable.vue` (for displaying new results).

#### Acceptance Criteria

**Functional Requirements:**

1. The system shall calculate Pflegeversicherung (PV) based on whether the user has children or not.
2. The system shall calculate Kirchensteuer (church tax) as a percentage of income tax (or taxable income, depending on German tax law specifics) if the user is affiliated with a church.
3. The user interface shall provide an input field or selection for the user's child status.
4. The user interface shall provide an input field or selection for the user's church affiliation (or lack thereof).
5. The calculated PV amount shall be displayed in the results.
6. The calculated Kirchensteuer amount shall be displayed in the results alongside the income tax.

**Integration Requirements:**
7. Existing income tax (EkSt.) calculation continues to work unchanged.
8. New functionality follows existing calculation patterns within `calculation.service.ts`.
9. Integration with UI components (`CalculatorInputForm.vue`, `CalculatorResultsTable.vue`) maintains current behavior and styling.

**Quality Requirements:**
10. Change is covered by appropriate unit tests (e.g., in `calculation.service.spec.ts`).
11. Documentation is updated if needed (e.g., user guide, if applicable).
12. No regression in existing functionality verified through testing.

#### Technical Notes

- **Integration Approach:** Modify `calculation.service.ts` to include new functions for PV and Kirchensteuer calculation. Update data models (e.g., in `types/index.ts`) to include child status and church affiliation. Update Vue components to capture and display these new data points.
- **Existing Pattern Reference:** Refer to the existing `calculateIncomeTax` function in `calculation.service.ts` for structure and error handling.
- **Key Constraints:** Need to research current PV rates (with/without children) and Kirchensteuer rates (which vary by state and church). Ensure data input for church affiliation is handled correctly (e.g., percentage or fixed rate).

#### Definition of Done

- [x] Functional requirements met
- [x] Integration requirements verified
- [x] Existing functionality regression tested
- [x] Code follows existing patterns and standards
- [x] Tests pass (existing and new)
- [ ] Documentation updated if applicable

### 3. Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Incorrect calculation of PV or Kirchensteuer due to incorrect rates or logic.
- **Mitigation:** Thorough unit testing with known good values; peer review of calculation logic.
- **Rollback:** Revert changes in `calculation.service.ts`, `types/index.ts`, and UI components.

**Compatibility Verification:**

- [ ] No breaking changes to existing APIs (internal service APIs).
- [ ] Database changes (if any) are additive only (unlikely for this feature, but good to note).
- [ ] UI changes follow existing design patterns.
- [ ] Performance impact is negligible.

### 4. Validation Checklist

Before finalizing the story, confirm:

**Scope Validation:**

- [ ] Story can be completed in one development session (This might be tight, especially with research for rates, but let's assume the core logic can be implemented quickly once rates are known).
- [ ] Integration approach is straightforward.
- [ ] Follows existing patterns exactly.
- [ ] No design or architecture work required.

**Clarity Check:**

- [ ] Story requirements are unambiguous.
- [ ] Integration points are clearly specified.
- [ ] Success criteria are testable.
- [ ] Rollback approach is simple.

## Success Criteria

The story creation is successful when:

1. Enhancement is clearly defined and appropriately scoped for single session
2. Integration approach is straightforward and low-risk
3. Existing system patterns are identified and will be followed
4. Rollback plan is simple and feasible
5. Acceptance criteria include existing functionality verification

## Important Notes

- This task is for VERY SMALL brownfield changes only
- If complexity grows during analysis, escalate to brownfield-create-epic
- Always prioritize existing system integrity
- When in doubt about integration complexity, use brownfield-create-epic instead
- Stories should take no more than 4 hours of focused development work
