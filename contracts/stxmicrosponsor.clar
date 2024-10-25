;; MicroSponsor Smart Contract
;; Handles scholarship management, fund disbursement, and milestone tracking

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-unauthorized (err u103))
(define-constant err-invalid-amount (err u104))
(define-constant err-milestone-incomplete (err u105))

;; Data Variables
(define-data-var admin-address principal tx-sender)

;; Data Maps
(define-map Students 
    principal 
    {
        name: (string-ascii 50),
        institution: (string-ascii 100),
        total-received: uint,
        status: (string-ascii 20),
        milestones-completed: uint,
        verified: bool
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
        creation-time: uint
    }
)

(define-map Milestones
    {scholarship-id: uint, milestone-id: uint}
    {
        description: (string-ascii 200),
        amount: uint,
        completed: bool,
        verified: bool,
        completion-time: uint
    }
)

;; Counter for scholarship IDs
(define-data-var scholarship-id-counter uint u0)

;; Administrative Functions

(define-public (set-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get admin-address)) err-owner-only)
        (ok (var-set admin-address new-admin))
    )
)

;; Student Management Functions

(define-public (register-student (name (string-ascii 50)) (institution (string-ascii 100)))
    (begin
        (asserts! (is-none (map-get? Students tx-sender)) err-already-exists)
        (ok (map-set Students tx-sender {
            name: name,
            institution: institution,
            total-received: u0,
            status: "active",
            milestones-completed: u0,
            verified: false
        }))
    )
)

(define-public (verify-student (student-address principal))
    (begin
        (asserts! (is-eq tx-sender (var-get admin-address)) err-owner-only)
        (asserts! (is-some (map-get? Students student-address)) err-not-found)
        (ok (map-set Students student-address 
            (merge (unwrap-panic (map-get? Students student-address))
                  {verified: true})))
    )
)

;; Scholarship Management Functions

(define-public (create-scholarship (student-address principal) (milestone-count uint))
    (let
        (
            (scholarship-id (+ (var-get scholarship-id-counter) u1))
        )
        (begin
            (asserts! (> (stx-get-balance tx-sender) u0) err-invalid-amount)
            (asserts! (is-some (map-get? Students student-address)) err-not-found)
            (var-set scholarship-id-counter scholarship-id)
            (ok (map-set Scholarships scholarship-id {
                donor: tx-sender,
                student: student-address,
                amount: (stx-get-balance tx-sender),
                released-amount: u0,
                milestone-count: milestone-count,
                status: "active",
                creation-time: block-height
            }))
        )
    )
)

(define-public (add-milestone (scholarship-id uint) 
                            (milestone-id uint)
                            (description (string-ascii 200))
                            (amount uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) err-not-found))
        )
        (begin
            (asserts! (is-eq tx-sender (get donor scholarship)) err-unauthorized)
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                {
                    description: description,
                    amount: amount,
                    completed: false,
                    verified: false,
                    completion-time: u0
                }))
        )
    )
)

;; Milestone Verification and Fund Release

(define-public (complete-milestone (scholarship-id uint) (milestone-id uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) err-not-found))
            (milestone (unwrap! (map-get? Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}) 
                err-not-found))
        )
        (begin
            (asserts! (is-eq tx-sender (get student scholarship)) err-unauthorized)
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                (merge milestone {completed: true, completion-time: block-height})))
        )
    )
)

(define-public (verify-milestone (scholarship-id uint) (milestone-id uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) err-not-found))
            (milestone (unwrap! (map-get? Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}) 
                err-not-found))
        )
        (begin
            (asserts! (is-eq tx-sender (var-get admin-address)) err-owner-only)
            (asserts! (get completed milestone) err-milestone-incomplete)
            (try! (stx-transfer? 
                (get amount milestone)
                tx-sender
                (get student scholarship)))
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                (merge milestone {verified: true})))
        )
    )
)

;; Read-Only Functions

(define-read-only (get-student-info (student-address principal))
    (map-get? Students student-address)
)

(define-read-only (get-scholarship-info (scholarship-id uint))
    (map-get? Scholarships scholarship-id)
)

(define-read-only (get-milestone-info (scholarship-id uint) (milestone-id uint))
    (map-get? Milestones {scholarship-id: scholarship-id, milestone-id: milestone-id})
)

;; Emergency Functions

(define-public (pause-scholarship (scholarship-id uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) err-not-found))
        )
        (begin
            (asserts! (or 
                (is-eq tx-sender (get donor scholarship))
                (is-eq tx-sender (var-get admin-address))) 
                err-unauthorized)
            (ok (map-set Scholarships 
                scholarship-id
                (merge scholarship {status: "paused"})))
        )
    )
)

(define-public (resume-scholarship (scholarship-id uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) err-not-found))
        )
        (begin
            (asserts! (or 
                (is-eq tx-sender (get donor scholarship))
                (is-eq tx-sender (var-get admin-address))) 
                err-unauthorized)
            (ok (map-set Scholarships 
                scholarship-id
                (merge scholarship {status: "active"})))
        )
    )
)
