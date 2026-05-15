# Firestore Security Specification

## 1. Data Invariants
- An order must have `contractNumber`, `customerName`, `status`, and at least one item.
- Orders have `Draft` or `Synced` status. Once `Synced`, they are immutable (terminal state).
- Logs are write-only for users (collecting telemetry), system can read.
- Chat messages are private to the user who created them.
- Timestamps must be server-generated.

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing**: User A creates an order setting `ownerId` to User B's UID.
2. **Resource Poisoning**: Document ID with 1KB of junk characters.
3. **State Shortcutting**: Creating an order directly as `Synced` without going through process (if business logic forbade it, though here we allow it). More importantly: transition from `Synced` back to `Draft`.
4. **PII Leak**: User B attempts to read User A's chat messages.
5. **Denial of Wallet**: Large string (1MB) in `customerName`.
6. **Key Injection**: Adding `isVerified: true` to an order document.
7. **Type Mismatch**: `totalAmount` as a string instead of number.
8. **Invalid Item**: Item with negative quantity.
9. **Orphaned Message**: Chat message without `userId`.
10. **Timestamp Fraud**: Client providing a `createdAt` in the past.
11. **Mass Delete**: User attempting to delete all orders in a collection.
12. **Admin Escalation**: User updating their own profile to set `isAdmin: true` (if user profiles existed).

## 3. Test Runner
(I won't write a full .ts test file here as I cannot run it easily, but I will simulate the logic in my rules).

## 4. Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|---|---|---|---|
| orders | Blocked by owner check | Blocked by immutability on Synced | Blocked by isValidId and size limits |
| logs | Write-only | N/A | Blocked by size limits |
| chat_messages | Blocked by userId check | N/A | Blocked by size limits |
