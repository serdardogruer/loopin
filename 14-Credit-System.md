# 14-Credit-System.md
# Loopin Credit System & Economy Specification
### Version 1.0

---

# 1. Overview & Economy Model

Loopin uses a **Credit-Based Economy (Kredi Bazlı Ekonomi)**.

Credits are required for:
1. **Creating an event** (Etkinlik Oluşturma).
2. **Approving participants** (Katılımcı Onaylama).

Users can obtain credits by:
- Purchasing credit packages (Kredi paketleri satın alma).
- Completing missions (Görevleri tamamlama).
- Inviting friends / Referrals (Arkadaş daveti).
- Sharing events on social media (Sosyal medyada paylaşım).
- Subscribing to membership packages (Gümüş / Altın / Organizatör paketleri).

---

# 2. Credit Costs & Rules

## 2.1 Event Creation
Creating any event costs:
**5 Credits**

*Example:*
- User Initial Credits: `20`
- User Creates an Event -> Deducts `-5 Credits`
- Remaining Credits: `15`

## 2.2 Participant Approval
Approving a participant costs:
**5 Credits per approved participant**

- Credits are deducted **ONLY** after the event organizer presses the **Approve (Onayla)** button.
- Simply applying to an event **NEVER** costs credits.
- Rejecting or cancelling an application **NEVER** costs credits.

---

# 3. Membership Packages & Participant Limits

| Package Name | Price | Initial Credits | Event Creation Cost | Approval Cost | Max Approved Participants / Event |
|---|---|---|---|---|---|
| **Normal User (Free)** | ₺0 (Free) | **10 Credits** | 5 Credits | 5 Credits / person | **Max 1 Participant** |
| **Silver Package** | ₺100 | **50 Credits** | 5 Credits | 5 Credits / person | **Max 2 Participants** |
| **Gold Package** | ₺400 | **200 Credits** | 5 Credits | 5 Credits / person | **Max 3 Participants** |
| **Organizer Package** | ₺4,000 | **1,000 Credits** | 5 Credits | 5 Credits / person | **Unlimited Participants** |

---

## Package Breakdown & Examples

### Normal User (Free)
- **Price**: ₺0
- **Initial Credits**: 10
- **Rules**:
  - Can create unlimited events while credits are available (5 credits each).
  - Can approve **only ONE participant** per event (5 credits).
- *Example*:
  - Initial: `10 Credits`
  - Create Event -> `-5` (Remaining: `5`)
  - Approve 1 Participant -> `-5` (Remaining: `0`)

### Silver Package
- **Price**: ₺100
- **Initial Credits**: 50
- **Rules**:
  - Event Creation: 5 Credits
  - Maximum approved participants per event: **2**
  - Approval Cost: 5 Credits per approved participant
- *Example*:
  - Initial: `50 Credits`
  - Create Event -> `-5` (Remaining: `45`)
  - Approve Participant 1 -> `-5` (Remaining: `40`)
  - Approve Participant 2 -> `-5` (Remaining: `35`)

### Gold Package
- **Price**: ₺400
- **Initial Credits**: 200
- **Rules**:
  - Event Creation: 5 Credits
  - Maximum approved participants per event: **3**
  - Approval Cost: 5 Credits per approved participant

### Organizer Package
- **Price**: ₺4,000
- **Initial Credits**: 1,000
- **Rules**:
  - Event Creation: 5 Credits
  - **Unlimited** approved participants
  - Approval Cost: 5 Credits per approved participant
- *Example*:
  - Initial: `1000 Credits`
  - Create Event -> `-5` (Remaining: `995`)
  - Approve 100 Participants -> `-500` (Remaining: `495`)

---

# 4. Applications & Interactions

- **Submitting an Application**: Anyone can apply to unlimited events for **FREE**. Submitting an application **NEVER** consumes credits.
- **Deduction Trigger**: Credits are deducted **ONLY** when the organizer explicitly approves the participant.
- **Rejected Applications**: Consume 0 credits.
- **Cancelled Applications**: Consume 0 credits.
- **Browsing / Searching / Editing**: Consume 0 credits.

---

# 5. Credit Validation & System Errors

## 5.1 Before Creating an Event
The system must verify:
`credits >= 5`

- **If Invalid**: Show error modal/toast:
  > **"Yetersiz Kredi!"** (Insufficient Credits)
  > *Etkinlik oluşturmak için 5 krediniz olmalıdır. Lütfen kredi paketi yükleyin.*

## 5.2 Before Approving a Participant
The system must verify:
1. `credits >= 5`
2. `approved_participants_count < package_limit`

- **If Credits < 5**: Show error:
  > **"Yetersiz Kredi!"** (Insufficient Credits)
  > *Katılımcı onaylamak için 5 krediniz olmalıdır.*

- **If Package Limit Reached**: Show error:
  > **"Paket Katılımcı Limitine Ulaşıldı!"**
  > *Mevcut paketiniz etkinlik başına en fazla {limit} katılımcı onaylamanıza izin verir. Lütfen paketinizi yükseltin.*

---

# 6. Admin Panel Credit Management

In the Admin Panel (`web/admin/`), administrators must be able to:
- **View User Credits**: See live credit balances for all users.
- **Add Credits**: Manually grant credits (`ADMIN_ADD`).
- **Remove Credits**: Manually deduct credits (`ADMIN_REMOVE`).
- **View Credit History & Breakdown**:
  - Purchased Credits
  - Earned Credits (Missions, Social, Referral)
  - Spent Credits (Events created, Participants approved)

---

# 7. Credit Transactions Logging (Audit Trail)

Every single credit movement must be recorded in an immutable ledger/log.

## 7.1 Data Fields
- `Transaction ID` (UUID)
- `User ID`
- `Type` (`EARN` / `SPEND` / `ADMIN_ADJUST`)
- `Amount` (+ / -)
- `Balance Before`
- `Balance After`
- `Reason`
- `Date` (Timestamp)

## 7.2 Transaction Reasons (Enums)
- `EVENT_CREATED` (-5 Credits)
- `PARTICIPANT_APPROVED` (-5 Credits)
- `CREDIT_PURCHASE` (+Credits)
- `MISSION_REWARD` (+Credits)
- `ADMIN_ADD` (+Credits)
- `ADMIN_REMOVE` (-Credits)
- `REFERRAL_REWARD` (+Credits)
- `SOCIAL_SHARE_REWARD` (+Credits)

---

# 8. Summary of Credit Rules

**Credits ARE NEVER consumed when:**
- Browsing events
- Applying to events
- Rejecting participants
- Editing an event

**Credits ARE ONLY consumed when:**
- Creating an event (-5 Credits)
- Approving a participant (-5 Credits)
