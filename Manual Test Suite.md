### ✅ Manual Test Suite – Route Conflict Detection and Reassignment Auditing

## 1. Test Design

### 1.1 Functional Test Cases (Happy Path)

**1.1.1 - Reassign route before campaign start date**
A manager successfully reassigns a route if all constraints are met (no conflicts, matching location type).
**Expected:** The route is reassigned, an audit log entry is created, confirmation emails are sent, and the route is locked for 24 hours.

**1.1.2 - Reassign route with a matching location type (indoor → indoor)**
**Expected:** Successful reassignment.

**1.1.3 - Reassign route with no time overlap between agents**
**Expected:** Successful reassignment.

---

### 1.2 Negative Scenarios

**1.2.1 - Attempt reassignment after the campaign start date**
**Expected:** The system prevents the reassignment, displays an error message, and no log or email is triggered.

**1.2.2 - Attempt reassignment when the receiving agent already has an overlapping route**
**Expected:** The system prevents the reassignment and displays an error message.

**1.2.3 - Attempt reassignment with a mismatched location type (indoor → outdoor)**
**Expected:** The system blocks the reassignment.

**1.2.4 - Reassign a route that has already been locked in the past 24 hours**
**Expected:** The action is denied with a clear error message.

---

### 1.3 Edge Cases

**1.3.1 - Reassign a route at the exact minute of the campaign start time**
**Expected:** Clarify if the action is allowed or blocked (assumption).

**1.3.2 - Reassign to an agent with multiple non-overlapping routes**
**Expected:** Allowed if the schedules do not overlap.

**1.3.3 - Simultaneous reassignment requests by two managers**
**Expected:** Only the first one succeeds; the second is rejected due to the lock.

---

### 1.4 Permission / Role-based

**1.4.1 - A manager attempts a reassignment (valid role)**
**Expected:** Allowed.

**1.4.2 - A regular agent attempts a reassignment (invalid role)**
**Expected:** Denied, with a permission error.

**1.4.3 - A system admin overrides the reassignment lock (if the feature exists)**
**Expected:** Verify the expected behavior.

---

## 2. Test Data Table

| Campaign   | Agent   | Route ID | Location Type | Schedule            | Notes                        |
|------------|---------|----------|---------------|---------------------|------------------------------|
| Campaign A | Agent X | R1       | Indoor        | 10:00–12:00, Day 1  | Source route                 |
| Campaign B | Agent Y | R2       | Indoor        | 14:00–16:00, Day 1  | Valid reassignment           |
| Campaign C | Agent Z | R3       | Outdoor       | 10:00–12:00, Day 1  | Overlap case                 |
| Campaign D | Agent W | R4       | Indoor        | 10:00–12:00, Day 2  | Non-overlap case             |
| Campaign E | Agent T | R5       | Indoor        | 09:00–11:00, Day 1  | Conflict with R1             |
| Campaign F | Agent U | R6       | Indoor        | 11:59–12:01, Day 1  | Edge case (campaign overlap) |

**Mapping examples:**
- Test 1 → Campaign A (R1) → Reassign to Agent Y (R2)
- Test 5 → Campaign A (R1) → Reassign to Agent T (R5)

---

## 3. Audit and Email Verification

### Audit Log Verification
- **Step:** After reassignment, check the system logs or API (`/audit/logs`) for an entry.
- **Fields:** timestamp, managerID, routeID, sourceAgent, destinationAgent, status=success.

### Email Verification
- **Step:** Check for confirmation emails sent to:
  - The source agent (route removed).
  - The destination agent (route added).
- **Validation:**
  - Subject line: *“Route Reassignment Confirmation”*
  - The content includes the campaign, route ID, and schedule.
- **Method:**
  - Use a mock email inbox or a test email monitoring tool.

---

## 4. Bug Reporting Sample

**Title:** The system allows reassignment despite a location type mismatch
**Environment:** QA environment – Build v1.2.5

**Preconditions:**
- Campaign A has an Indoor route assigned to Agent X.
- Campaign C has an Outdoor route assigned to Agent Z.

**Steps to Reproduce:**
1. Log in as a Manager.
2. Open Campaign A → Route R1 (Indoor).
3. Attempt to reassign R1 to Agent Z (Outdoor).

**Expected Result:**
The system should block the reassignment with the message:
*“Location type mismatch – reassignment not allowed”*.

**Actual Result:**
The reassignment was completed successfully; an audit log was created, and emails were sent incorrectly.

**Severity:** High – Business rule violation.

---

## 5. Assumptions & Risks

**Assumptions:**
- The campaign start time boundary (e.g., reassignment at the exact start minute) is clarified by the product team.
- The audit log storage is synchronous (immediate visibility).
- Emails are checked via a test inbox (not real agents).

**Risks:**
- Unhandled edge cases → inconsistent behavior at campaign start.
- Email delivery delays might hide failures in production.
- Simultaneous manager actions might cause database race conditions.

---

## 6. Regression Impact Checklist

The following modules/flows could be indirectly affected:
- Campaign Management (status changes, start time handling).
- Agent Assignment Engine (scheduling conflicts).
- Audit Logging (all features that write logs).
- Email Notification System (any feature that triggers confirmation emails).
- Route Locking Mechanism (potential impact on regular route updates).