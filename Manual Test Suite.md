# ✅ Manual Test Suite – Route Conflict Detection and Reassignment Auditing

## 1. Test Design

### 1.1 Functional Test Cases (Happy Path)

**1.1.1 - Reassign route before campaign start date**  
Manager reassigns route successfully if constraints are met (no conflicts, matching location type).  
**Expected:** Route reassigned, audit log created, confirmation emails sent, route locked for 24h.  

**1.1.2 - Reassign route with matching location type (indoor → indoor)**  
**Expected:** Successful reassignment.  

**1.1.3 - Reassign route with no time overlap between agents**  
**Expected:** Successful reassignment.  

---

### 1.2 Negative Scenarios

**1.2.1 - Attempt reassignment after campaign start date**  
**Expected:** System prevents reassignment, error message displayed, no log/email triggered.  

**1.2.2 - Attempt reassignment when receiving agent already has overlapping route**  
**Expected:** System prevents reassignment, error message displayed.  

**1.2.3 - Attempt reassignment with mismatched location type (indoor → outdoor)**  
**Expected:** System blocks reassignment.  

**1.2.4 - Reassign a route already locked in the past 24h**  
**Expected:** Action denied with clear error message.  

---

### 1.3 Edge Cases

**1.3.1 - Reassign route at the exact minute of campaign start time**  
**Expected:** Clarify if allowed or blocked (assumption).  

**1.3.2 - Reassign to an agent with multiple non-overlapping routes**  
**Expected:** Allowed if schedules do not overlap.  

**1.3.3 - Simultaneous reassignment requests by two managers**  
**Expected:** Only first successful, second rejected due to lock.  

---

### 1.4 Permission / Role-based

**1.4.1 - Manager attempts reassignment (valid role)**  
**Expected:** Allowed.  

**1.4.2 - Regular agent attempts reassignment (invalid role)**  
**Expected:** Denied, permission error.  

**1.4.3 - System admin overrides reassignment lock (if feature exists)**  
**Expected:** Verify expected behavior.  

---

## 2. Test Data Table

| Campaign   | Agent   | Route ID | Location Type | Schedule            | Notes                        |
|------------|---------|----------|---------------|---------------------|------------------------------|
| Campaign A | Agent X | R1       | Indoor        | 10:00–12:00, Day 1  | Source route                 |
| Campaign B | Agent Y | R2       | Indoor        | 14:00–16:00, Day 1  | Valid reassignment           |
| Campaign C | Agent Z | R3       | Outdoor       | 10:00–12:00, Day 1  | Overlap case                 |
| Campaign D | Agent W | R4       | Indoor        | 10:00–12:00, Day 2  | Non-overlap case             |
| Campaign E | Agent T | R5       | Indoor        | 09:00–11:00, Day 1  | Conflict with R1             |
| Campaign F | Agent U | R6       | Indoor        | 11:59–12:01, Day 1  | Edge case (campaign overlap) |

**Mapping examples:**  
- Test 1 → Campaign A (R1) → Reassign to Agent Y (R2)  
- Test 5 → Campaign A (R1) → Reassign to Agent T (R5)  

---

## 3. Audit and Email Verification

### Audit Log Verification
- **Step:** After reassignment, check system logs or API (`/audit/logs`) for entry.  
- **Fields:** timestamp, managerID, routeID, sourceAgent, destinationAgent, status=success.  

### Email Verification
- **Step:** Check confirmation emails sent to:  
  - Source agent (route removed).  
  - Destination agent (route added).  
- **Validation:**  
  - Subject line: *“Route Reassignment Confirmation”*  
  - Content includes campaign, route ID, schedule.  
- **Method:**  
  - Use mock email inbox or test email monitoring tool.  

---

## 4. Bug Reporting Sample

**Title:** System allows reassignment despite location type mismatch  
**Environment:** QA environment – Build v1.2.5  

**Preconditions:**  
- Campaign A with Indoor route assigned to Agent X.  
- Campaign C with Outdoor route assigned to Agent Z.  

**Steps to Reproduce:**  
1. Login as Manager.  
2. Open Campaign A → Route R1 (Indoor).  
3. Attempt to reassign R1 to Agent Z (Outdoor).  

**Expected Result:**  
System should block reassignment with message:  
*“Location type mismatch – reassignment not allowed”*.  

**Actual Result:**  
Reassignment completed successfully; audit log created; emails sent incorrectly.  

**Severity:** High – Business rule violation.  

---

## 5. Assumptions & Risks

**Assumptions:**  
- Campaign start time boundary (e.g., reassignment at exact start minute) is clarified by product team.  
- Audit log storage is synchronous (immediate visibility).  
- Emails are checked via test inbox (not real agents).  

**Risks:**  
- Edge cases not handled → inconsistent behavior at campaign start.  
- Email delivery delays might hide failures in production.  
- Simultaneous manager actions might cause database race conditions.  

---

## 6. Regression Impact Checklist

The following modules/flows could be indirectly affected:  
- Campaign Management (status changes, start time handling).  
- Agent Assignment Engine (scheduling conflicts).  
- Audit Logging (all features writing logs).  
- Email Notification System (any feature triggering confirmation emails).  
- Route Locking Mechanism (potential impact on regular route updates).  
