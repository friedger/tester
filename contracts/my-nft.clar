(impl-trait 'ST16KQ2VQSSJFGQJPNYC04P1SGVP77C760AJH38F2.nft-trait.nft-trait)

(define-map clams {clam-id: uint}
  {name: (string-ascii 20),
  image: uint,
  timestamp: uint}
)

{name: "text", image: "number-index", timestamp: "block-height"}
(define-read-only (get-meta-data (clam-id uint))
    (map-get? clams {clam-id: clam-id}))


(define-non-fungible-token nft-clams uint)
(define-data-var next-id uint u1)

(define-private (get-time)
   (unwrap-panic (get-block-info? time (- block-height u1))))


{action: "create"}
(define-public (create-clam (name (string-ascii 20)) (image uint))
    (let ((clam-id (var-get next-id)))
      (if (is-ok (nft-mint? nft-clams clam-id tx-sender))
        (begin
          (var-set next-id (+ clam-id u1))
          (map-set clams {clam-id: clam-id}
          {
            name: name,
            image: image,
            timestamp: (get-time)
          })
          (ok clam-id))
        err-clam-exists)))

(define-constant err-clam-exists (err u409)) ;; conflict

(define-private (err-nft-mint (code uint))
  (if (is-eq u1 code)
    err-clam-exists
    (err code)))

(define-map err-strings (response uint uint) (string-ascii 32))
(map-insert err-strings err-clam-exists "clam-exists")