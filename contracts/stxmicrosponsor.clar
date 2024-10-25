;; MicroSponsor Smart Contract v3.0
;; Comprehensive scholarship management system with enhanced features

;; ============================================
;; Constants and Error Codes
;; ============================================

(define-constant contract-owner tx-sender)

;; Administrative error codes (1000-1099)
(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-ALREADY-EXISTS (err u1001))
(define-constant ERR-NOT-FOUND (err u1002))
(define-constant ERR-CONTRACT-PAUSED (err u1003))
(define-constant ERR-INVALID-ADMIN (err u1004))
(define-constant ERR-LOG-FAILED (err u1005))
(define-constant ERR-DONOR-UPDATE-FAILED (err u1006))
(define-constant ERR-INACTIVE-STATUS (err u1007)) 

;; Parameter validation errors (1100-1199)
(define-constant ERR-INVALID-PARAMS (err u1100))
(define-constant ERR-INVALID-AMOUNT (err u1101))
(define-constant ERR-INVALID-TIME (err u1102))
(define-constant ERR-INVALID-STATUS (err u1103))
(define-constant ERR-INVALID-GPA (err u1104))

;; Operation errors (1200-1299)
(define-constant ERR-INSUFFICIENT-FUNDS (err u1200))
(define-constant ERR-MILESTONE-INVALID (err u1201))
(define-constant ERR-STUDENT-NOT-VERIFIED (err u1202))
(define-constant ERR-INSTITUTION-NOT-VERIFIED (err u1203))
(define-constant ERR-REQUIREMENTS-NOT-MET (err u1204))

;; ============================================
;; Data Variables
;; ============================================

;; Contract control
(define-data-var contract-enabled bool true)
(define-data-var admin-action-counter uint u0)
(define-data-var required-signatures uint u2)

;; Financial thresholds
(define-data-var min-scholarship-amount uint u1000000) ;; 1 STX
(define-data-var max-scholarship-amount uint u1000000000) ;; 1000 STX
(define-data-var milestone-timeout-blocks uint u1440) ;; ~10 days

;; ============================================
;; Data Maps
;; ============================================

;; Administrative Maps
(define-map Administrators principal bool)

;; Core Entity Maps
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
        last-activity: uint,
        academic-year: uint,
        program: (string-ascii 50)
    }
)

(define-map StudentMetrics
    principal
    {
        gpa: uint,  ;; Stored as percentage (e.g., 385 = 3.85)
        attendance-rate: uint,  ;; Percentage
        extra-curricular: uint,  ;; Count of activities
        academic-awards: uint,
        research-projects: uint,
        last-update: uint,
        updated-by: principal
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
        fund-recovery-address: principal,
        template-id: (optional uint),
        category: (string-ascii 50)
    }
)

(define-map DonorProfiles
    principal
    {
        total-donations: uint,
        active-scholarships: uint,
        successful-completions: uint,
        total-students-supported: uint,
        joining-date: uint,
        last-donation: uint,
        donor-tier: (string-ascii 20),
        preferred-categories: (list 5 (string-ascii 50)),
        impact-score: uint
    }
)

(define-map VerifiedInstitutions
    (string-ascii 100)  
    {
        verification-admin: principal,
        verification-time: uint,
        status: (string-ascii 20),
        student-count: uint,
        total-scholarships: uint,
        website: (string-ascii 100),
        contact-email: (string-ascii 100),
        accreditation-status: (string-ascii 50),
        performance-rating: uint
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
        evidence-hash: (buff 32),
        performance-metrics: {
            gpa-requirement: uint,
            attendance-requirement: uint,
            extra-activities-requirement: uint
        }
    }
)

(define-map ScholarshipTemplates
    uint
    {
        name: (string-ascii 50),
        description: (string-ascii 200),
        total-amount: uint,
        milestone-count: uint,
        duration-blocks: uint,
        requirements: (string-ascii 200),
        creator: principal,
        creation-time: uint,
        template-status: (string-ascii 20),
        category: (string-ascii 50),
        required-gpa: uint,
        success-rate: uint
    }
)

(define-map ActivityLog
    uint
    {
        actor: principal,
        action: (string-ascii 50),
        timestamp: uint,
        details: (string-ascii 200),
        related-scholarship: (optional uint),
        category: (string-ascii 50),
        severity: (string-ascii 20)
    }
)

;; ============================================
;; Private Functions
;; ============================================

(define-private (is-admin (address principal))
    (default-to false (map-get? Administrators address))
)

(define-private (is-contract-enabled)
    (var-get contract-enabled)
)

(define-private (verify-amount (amount uint))
    (and 
        (>= amount (var-get min-scholarship-amount))
        (<= amount (var-get max-scholarship-amount))
    )
)

(define-private (calculate-donor-tier (total-amount uint))
    (if (>= total-amount u1000000000)
        "platinum"
        (if (>= total-amount u500000000)
            "gold"
            (if (>= total-amount u100000000)
                "silver"
                "bronze")))
)

(define-private (update-donor-metrics (donor principal) (amount uint))
    (let
        (
            (current-profile (default-to 
                {
                    total-donations: u0,
                    active-scholarships: u0,
                    successful-completions: u0,
                    total-students-supported: u0,
                    joining-date: block-height,
                    last-donation: block-height,
                    donor-tier: "bronze",
                    preferred-categories: (list ),
                    impact-score: u0
                }
                (map-get? DonorProfiles donor)))
            (new-total (+ (get total-donations current-profile) amount))
        )
        (begin
            (if (map-set DonorProfiles donor
                (merge current-profile
                    {
                        total-donations: new-total,
                        last-donation: block-height,
                        donor-tier: (calculate-donor-tier new-total),
                        active-scholarships: (+ (get active-scholarships current-profile) u1)
                    }))
                (ok true)  ;; Success case
                ERR-DONOR-UPDATE-FAILED)  ;; Error case
        )
    )
)

(define-private (log-activity 
    (actor principal) 
    (action (string-ascii 50)) 
    (details (string-ascii 200))
    (category (string-ascii 50))
    (severity (string-ascii 20)))
    (begin
        (let
            (
                (activity-id (+ (var-get admin-action-counter) u1))
            )
            (var-set admin-action-counter activity-id)
            (if (map-set ActivityLog activity-id
                    {
                        actor: actor,
                        action: action,
                        timestamp: block-height,
                        details: details,
                        related-scholarship: none,
                        category: category,
                        severity: severity
                    })
                (ok true)  ;; Changed to return (ok true) instead of (ok activity-id)
                ERR-LOG-FAILED)  ;; Return specific error constant
        )
    )
)

;; ============================================
;; Public Functions - Administrative
;; ============================================

(define-public (add-administrator (new-admin principal))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (not (is-admin new-admin)) ERR-ALREADY-EXISTS)
        (try! (log-activity tx-sender "ADMIN_ADDED" "New administrator added" "ADMIN" "HIGH"))
        (ok (map-set Administrators new-admin true))
    )
)

(define-public (remove-administrator (admin principal))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (not (is-eq admin contract-owner)) ERR-INVALID-ADMIN)
        (try! (log-activity tx-sender "ADMIN_REMOVED" "Administrator removed" "ADMIN" "HIGH"))
        (ok (map-set Administrators admin false))
    )
)

;; ============================================
;; Public Functions - Institution Management
;; ============================================

(define-public (register-institution
    (institution-name (string-ascii 100))
    (website (string-ascii 100))
    (contact-email (string-ascii 100))
    (accreditation-status (string-ascii 50)))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (is-none (map-get? VerifiedInstitutions institution-name)) ERR-ALREADY-EXISTS)
        (try! (log-activity tx-sender "INSTITUTION_REGISTERED" institution-name "INSTITUTION" "MEDIUM"))
        (ok (map-set VerifiedInstitutions institution-name
            {
                verification-admin: tx-sender,
                verification-time: block-height,
                status: "active",
                student-count: u0,
                total-scholarships: u0,
                website: website,
                contact-email: contact-email,
                accreditation-status: accreditation-status,
                performance-rating: u0
            }))
    )
)

;; ============================================
;; Public Functions - Student Management
;; ============================================

(define-public (register-student 
    (name (string-ascii 50)) 
    (institution (string-ascii 100))
    (emergency-contact principal)
    (program (string-ascii 50))
    (academic-year uint))
    (begin
        (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
        (asserts! (is-none (map-get? Students tx-sender)) ERR-ALREADY-EXISTS)
        (asserts! (is-some (map-get? VerifiedInstitutions institution)) ERR-INSTITUTION-NOT-VERIFIED)
        (try! (log-activity tx-sender "STUDENT_REGISTERED" name "STUDENT" "LOW"))
        (ok (map-set Students tx-sender {
            name: name,
            institution: institution,
            total-received: u0,
            status: "pending",
            milestones-completed: u0,
            verified: false,
            verification-time: u0,
            verification-admin: contract-owner,
            last-activity: block-height,
            academic-year: academic-year,
            program: program
        }))
    )
)

(define-public (update-student-metrics
    (student-address principal)
    (gpa uint)
    (attendance-rate uint)
    (extra-curricular uint)
    (academic-awards uint)
    (research-projects uint))
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (asserts! (is-some (map-get? Students student-address)) ERR-NOT-FOUND)
        (asserts! (<= gpa u400) ERR-INVALID-GPA)
        (asserts! (<= attendance-rate u100) ERR-INVALID-PARAMS)
        (try! (log-activity tx-sender "METRICS_UPDATED" "Student metrics updated" "STUDENT" "LOW"))
        (ok (map-set StudentMetrics student-address
            {
                gpa: gpa,
                attendance-rate: attendance-rate,
                extra-curricular: extra-curricular,
                academic-awards: academic-awards,
                research-projects: research-projects,
                last-update: block-height,
                updated-by: tx-sender
            }))
    )
)

;; ============================================
;; Public Functions - Scholarship Management
;; ============================================

(define-public (create-scholarship 
    (student-address principal) 
    (milestone-count uint)
    (fund-recovery-address principal)
    (category (string-ascii 50)))
    (let
        (
            (scholarship-id (+ (var-get admin-action-counter) u1))
            (amount (stx-get-balance tx-sender))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (verify-amount amount) ERR-INVALID-AMOUNT)
            (asserts! (is-some (map-get? Students student-address)) ERR-NOT-FOUND)
            (asserts! (get verified (unwrap! (map-get? Students student-address) ERR-NOT-FOUND)) 
                     ERR-STUDENT-NOT-VERIFIED)
            
            (var-set admin-action-counter scholarship-id)
            (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
            (try! (update-donor-metrics tx-sender amount))
            (try! (log-activity tx-sender "SCHOLARSHIP_CREATED" category "SCHOLARSHIP" "MEDIUM"))
            
            (ok (map-set Scholarships scholarship-id
                {
                    donor: tx-sender,
                    student: student-address,
                    amount: amount,
                    released-amount: u0,
                    milestone-count: milestone-count,
                    status: "active",
                    creation-time: block-height,
                    last-update: block-height,
                    emergency-contact: tx-sender,
                    fund-recovery-address: fund-recovery-address,
                    template-id: none,
                    category: category
                }))
        )
    )
)

;; ============================================
;; Public Functions - Template Management
;; ============================================

(define-public (create-scholarship-template
    (name (string-ascii 50))
    (description (string-ascii 200))
    (total-amount uint)
    (milestone-count uint)
    (duration-blocks uint)
    (requirements (string-ascii 200))
    (category (string-ascii 50))
    (required-gpa uint))
    (let
        (
            (template-id (+ (var-get admin-action-counter) u1))
        )
        (begin
            (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
            (asserts! (verify-amount total-amount) ERR-INVALID-AMOUNT)
            (asserts! (<= required-gpa u400) ERR-INVALID-GPA)
            
            (var-set admin-action-counter template-id)
            (try! (log-activity tx-sender "TEMPLATE_CREATED" name "TEMPLATE" "MEDIUM"))
            
            (ok (map-set ScholarshipTemplates template-id
                {
                    name: name,
                    description: description,
                    total-amount: total-amount,
                    milestone-count: milestone-count,
                    duration-blocks: duration-blocks,
                    requirements: requirements,
                    creator: tx-sender,
                    creation-time: block-height,
                    template-status: "active",
                    category: category,
                    required-gpa: required-gpa,
                    success-rate: u0
                }))
        )
    )
)

(define-public (create-scholarship-from-template
    (template-id uint)
    (student-address principal)
    (fund-recovery-address principal))
    (let
        (
            (template (unwrap! (map-get? ScholarshipTemplates template-id) ERR-NOT-FOUND))
            (scholarship-id (+ (var-get admin-action-counter) u1))
            (student-metrics (unwrap! (map-get? StudentMetrics student-address) ERR-NOT-FOUND))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (is-eq (get template-status template) "active") ERR-INACTIVE-STATUS)
            (asserts! (>= (get gpa student-metrics) (get required-gpa template)) ERR-REQUIREMENTS-NOT-MET)
            (asserts! (>= (stx-get-balance tx-sender) (get total-amount template)) ERR-INSUFFICIENT-FUNDS)
            
            (var-set admin-action-counter scholarship-id)
            (try! (stx-transfer? (get total-amount template) tx-sender (as-contract tx-sender)))
            (try! (update-donor-metrics tx-sender (get total-amount template)))
            (try! (log-activity tx-sender "SCHOLARSHIP_FROM_TEMPLATE" (get name template) "SCHOLARSHIP" "MEDIUM"))
            
            (ok (map-set Scholarships scholarship-id
                {
                    donor: tx-sender,
                    student: student-address,
                    amount: (get total-amount template),
                    released-amount: u0,
                    milestone-count: (get milestone-count template),
                    status: "active",
                    creation-time: block-height,
                    last-update: block-height,
                    emergency-contact: tx-sender,
                    fund-recovery-address: fund-recovery-address,
                    template-id: (some template-id),
                    category: (get category template)
                }))
        )
    )
)

;; ============================================
;; Public Functions - Milestone Management
;; ============================================

(define-public (add-milestone 
    (scholarship-id uint)
    (milestone-id uint)
    (description (string-ascii 200))
    (amount uint)
    (gpa-requirement uint)
    (attendance-requirement uint)
    (extra-activities-requirement uint))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) ERR-NOT-FOUND))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (is-eq tx-sender (get donor scholarship)) ERR-NOT-AUTHORIZED)
            (asserts! (verify-amount amount) ERR-INVALID-PARAMS)
            (asserts! (<= gpa-requirement u400) ERR-INVALID-GPA)
            (asserts! (<= attendance-requirement u100) ERR-INVALID-PARAMS)
            
            (try! (log-activity tx-sender "MILESTONE_ADDED" description "MILESTONE" "LOW"))
            
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                {
                    description: description,
                    amount: amount,
                    completed: false,
                    verified: false,
                    completion-time: u0,
                    verification-time: u0,
                    verifier: tx-sender,
                    evidence-hash: 0x00,
                    performance-metrics: {
                        gpa-requirement: gpa-requirement,
                        attendance-requirement: attendance-requirement,
                        extra-activities-requirement: extra-activities-requirement
                    }
                }))
        )
    )
)

(define-public (complete-milestone 
    (scholarship-id uint)
    (milestone-id uint)
    (evidence-hash (buff 32)))
    (let
        (
            (scholarship (unwrap! (map-get? Scholarships scholarship-id) ERR-NOT-FOUND))
            (milestone (unwrap! (map-get? Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}) 
                ERR-NOT-FOUND))
            (student-metrics (unwrap! (map-get? StudentMetrics (get student scholarship)) ERR-NOT-FOUND))
        )
        (begin
            (asserts! (is-contract-enabled) ERR-CONTRACT-PAUSED)
            (asserts! (is-eq tx-sender (get student scholarship)) ERR-NOT-AUTHORIZED)
            (asserts! (not (get completed milestone)) ERR-ALREADY-EXISTS)
            
            ;; Verify performance requirements
            (asserts! (>= (get gpa student-metrics) 
                         (get gpa-requirement (get performance-metrics milestone))) 
                     ERR-REQUIREMENTS-NOT-MET)
            (asserts! (>= (get attendance-rate student-metrics) 
                         (get attendance-requirement (get performance-metrics milestone))) 
                     ERR-REQUIREMENTS-NOT-MET)
            (asserts! (>= (get extra-curricular student-metrics) 
                         (get extra-activities-requirement (get performance-metrics milestone))) 
                     ERR-REQUIREMENTS-NOT-MET)
            
            (try! (log-activity tx-sender "MILESTONE_COMPLETED" 
                (get description milestone) "MILESTONE" "MEDIUM"))
            
            (ok (map-set Milestones 
                {scholarship-id: scholarship-id, milestone-id: milestone-id}
                (merge milestone {
                    completed: true,
                    completion-time: block-height,
                    evidence-hash: evidence-hash
                })))
        )
    )
)

;; ============================================
;; Read-Only Functions
;; ============================================

(define-read-only (get-contract-status)
    (var-get contract-enabled)
)

(define-read-only (get-student-info (student-address principal))
    (map-get? Students student-address)
)

(define-read-only (get-scholarship-info (scholarship-id uint))
    (map-get? Scholarships scholarship-id)
)

(define-read-only (get-milestone-info (scholarship-id uint) (milestone-id uint))
    (map-get? Milestones {scholarship-id: scholarship-id, milestone-id: milestone-id})
)

(define-read-only (get-donor-profile (donor-address principal))
    (map-get? DonorProfiles donor-address)
)

(define-read-only (get-institution-info (institution-name (string-ascii 100)))
    (map-get? VerifiedInstitutions institution-name)
)

(define-read-only (get-template-info (template-id uint))
    (map-get? ScholarshipTemplates template-id)
)

(define-read-only (get-student-metrics (student-address principal))
    (map-get? StudentMetrics student-address)
)

(define-read-only (is-amount-valid (amount uint))
    (verify-amount amount)
)

(define-read-only (get-activity-log (activity-id uint))
    (map-get? ActivityLog activity-id)
)

;; ============================================
;; Emergency Functions
;; ============================================

(define-public (pause-contract)
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (var-set contract-enabled false)
        (try! (log-activity tx-sender "CONTRACT_PAUSED" 
            "Emergency pause activated" "ADMIN" "HIGH"))
        (ok true)
    )
)

(define-public (resume-contract)
    (begin
        (asserts! (is-admin tx-sender) ERR-NOT-AUTHORIZED)
        (var-set contract-enabled true)
        (try! (log-activity tx-sender "CONTRACT_RESUMED" 
            "Contract resumed" "ADMIN" "HIGH"))
        (ok true)
    )
)

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
            
            (try! (log-activity tx-sender "EMERGENCY_RECOVERY" 
                "Emergency fund recovery executed" "ADMIN" "HIGH"))
            
            (ok true)
        )
    )
)
