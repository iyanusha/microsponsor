;; MicroSponsor Smart Contract v2.0
;; Enhanced security implementation for scholarship management

;; ---------- Constants ----------

(define-constant contract-owner tx-sender)

;; Error codes with meaningful messages
(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-STUDENT-NOT-VERIFIED (err u1001))
(define-constant ERR-INVALID-PARAMS (err u1002))
(define-constant ERR-ALREADY-EXISTS (err u1003))
(define-constant ERR-NOT-FOUND (err u1004))
(define-constant ERR-INACTIVE-STATUS (err u1005))
(define-constant ERR-INSUFFICIENT-FUNDS (err u1006))
(define-constant ERR-MILESTONE-INVALID (err u1007))
(define-constant ERR-CONTRACT-PAUSED (err u1008))
(define-constant ERR-AMOUNT-TOO-SMALL (err u1009))
(define-constant ERR-AMOUNT-TOO-LARGE (err u1010))
(define-constant ERR-INVALID-TIME (err u1011))

;; ---------- Data Variables ----------

;; Contract status for emergency pause
(define-data-var contract-enabled bool true)

;; Multi-signature admin control
(define-map Administrators principal bool)

;; Required number of admin signatures for critical operations
(define-data-var required-signatures uint u2)

;; Pending admin actions for multi-sig
(define-map PendingAdminActions
    uint 
    {
        action-type: (string-ascii 50),
        proposed-by: principal,
        approvals: uint,
        expiration: uint,
        executed: bool
    }
)

;; Counter for admin actions
(define-data-var admin-action-counter uint u0)

;; Security thresholds
(define-data-var min-scholarship-amount uint u1000000) ;; 1 STX
(define-data-var max-scholarship-amount uint u1000000000) ;; 1000 STX
(define-data-var milestone-timeout-blocks uint u1440) ;; ~10 days

;; ---------- Data Maps ----------

(define-map Students 
    principal 
    {
        name: (string-ascii 50),
        institution: (string-ascii 100),
        total-received: uint,
        status: (string-ascii 20),
        milestones-completed: uint,
        verified: bool,
        verification-time: uint,
        verification-admin: principal,
        last-activity: uint
    }
)

(define-map Scholarships
    uint
    {
        donor: principal,
        student: principal,
        amount: uint,
        released-amount: uint,
        milestone-count: uint,
        status: (string-ascii 20),
        creation-time: uint,
        last-update: uint,
        emergency-contact: principal,
        fund-recovery-address: principal
    }
)

(define-map Milestones
    {scholarship-id: uint, milestone-id: uint}
    {
        description: (string-ascii 200),
        amount: uint,
        completed: bool,
        verified: bool,
        completion-time: uint,
        verification-time: uint,
        verifier: principal,
        evidence-hash: (buff 32)
    }
)

;; Activity tracking for security monitoring
(define-map ActivityLog
    uint
    {
        actor: principal,
        action: (string-ascii 50),
        timestamp: uint,
        details: (string-ascii 200)
    }
)

;; ---------- Private Functions ----------

(define-private (is-admin (address principal))
    (default-to false (map-get? Administrators address))
)

(define-private (is-contract-enabled)
    (var-get contract-enabled)
)

(define-private (log-activity (actor principal) (action (string-ascii 50)) (details (string-ascii 200)))
    (let
        (
            (activity-id (+ (var-get admin-action-counter) u1))
        )
        (begin
            (var-set admin-action-counter activity-id)
            (map-set ActivityLog activity-id
                {
                    actor: actor,
                    action: action,
                    timestamp: block-height,
                    details: details
                }
            )
            activity-id
        )
    )
)

(define-private (verify-amount (amount uint))
    (and 
        (>= amount (var-get min-scholarship-amount))
        (<= amount (var-get max-scholarship-amount))
    )
)

;; ---------- Administrative Functions ----------

(define-public (add-administrator (new-admin principal))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (not (is-admin new-admin)) ERR-ALREADY-EXISTS)
        (ok (map-set Administrators new-admin true))
    )
)

(define-public (remove-administrator (admin principal))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (not (is-eq admin contract-owner)) ERR-NOT-AUTHORIZED)
        (ok (map-set Administrators admin false))
    )
)

(define-public (pause-contract)
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (var-set contract-enabled false)
        (log-activity tx-sender "CONTRACT_PAUSE" "Emergency pause activated")
        (ok true)
    )
)

(define-public (resume-contract)
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (var-set contract-enabled true)
        (log-activity tx-sender "CONTRACT_RESUME" "Contract resumed")
        (ok true)
    )
)

;; ---------- Student Management Functions ----------

(define-public (register-student (name (string-ascii 50)) 
                               (institution (string-ascii 100))
                               (emergency-contact principal))
    (begin
        (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
        (asserts! (is-none (map-get? Students tx-sender)) ERR-ALREADY-EXISTS)
        (asserts! (not (is-eq emergency-contact tx-sender)) ERR-INVALID-PARAMS)
        (ok (map-set Students tx-sender {
            name: name,
            institution: institution,
            total-received: u0,
            status: "pending",
            milestones-completed: u0,
            verified: false,
            verification-time: u0,
            verification-admin: contract-owner,
            last-activity: block-height
        }))
    )
)

;; ---------- Scholarship Management Functions ----------

(define-public (create-scholarship 
    (student-address principal) 
    (milestone-count uint)
    (fund-recovery-address principal))
    (let
        (
            (scholarship-id (+ (var-get admin-action-counter) u1))
            (amount (stx-get-balance tx-sender))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (verify-amount amount) ERR-INVALID-PARAMS)
            (asserts! (is-some (map-get? Students student-address)) ERR-NOT-FOUND)
            (asserts! (get verified (unwrap! (map-get? Students student-address) ERR-NOT-FOUND)) ERR-STUDENT-NOT-VERIFIED)
            (var-set admin-action-counter scholarship-id)
            (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
            (ok (map-set Scholarships scholarship-id {
                donor: tx-sender,
                student: student-address,
                amount: amount,
                released-amount: u0,
                milestone-count: milestone-count,
                status: "active",
                creation-time: block-height,
                last-update: block-height,
                emergency-contact: tx-sender,
                fund-recovery-address: fund-recovery-address
            }))
        )
    )
)

;; ---------- Milestone Management Functions ----------

(define-public (verify-milestone (scholarship-id uint) 
                               (milestone-id uint)
                               (evidence-hash (buff 32)))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) ERR-NOT-FOUND))
            (milestone (unwrap! (map-get? Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}) 
                ERR-NOT-FOUND))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
            (asserts! (get completed milestone) ERR-MILESTONE-INVALID)
            (asserts! (not (get verified milestone)) ERR-ALREADY-EXISTS)
            (asserts! (<= (- block-height (get completion-time milestone)) 
                         (var-get milestone-timeout-blocks)) ERR-INVALID-TIME)
            
            ;; Transfer funds to student
            (try! (as-contract (stx-transfer? 
                (get amount milestone)
                tx-sender
                (get student scholarship))))

            ;; Update milestone
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                (merge milestone {
                    verified: true,
                    verification-time: block-height,
                    verifier: tx-sender,
                    evidence-hash: evidence-hash
                })))
        )
    )
)

;; ---------- Emergency Recovery Functions ----------

(define-public (emergency-fund-recovery (scholarship-id uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) ERR-NOT-FOUND))
            (remaining-amount (- (get amount scholarship) (get released-amount scholarship)))
        )
        (begin
            (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
            (asserts! (> remaining-amount u0) ERR-INSUFFICIENT-FUNDS)
            (try! (as-contract (stx-transfer? 
                remaining-amount
                tx-sender
                (get fund-recovery-address scholarship))))
            (log-activity tx-sender "EMERGENCY_RECOVERY" 
                (concat "Scholarship ID: " (to-ascii scholarship-id)))
            (ok true)
        )
    )
)

;; ---------- Read-Only Functions ----------

(define-read-only (get-contract-status)
    (var-get contract-enabled)
)

(define-read-only (get-activity-log (activity-id uint))
    (map-get? ActivityLog activity-id)
)

(define-read-only (is-amount-valid (amount uint))
    (verify-amount amount)
)

(define-read-only (get-milestone-timeout)
    (var-get milestone-timeout-blocks)
)
