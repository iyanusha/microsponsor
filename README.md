# MicroSponsor

Decentralized micro-scholarship platform built on Stacks. Connects donors with students through milestone-based scholarships with transparent fund tracking.

## Stack

- **Smart Contract**: Clarity on Stacks (Bitcoin L2)
- **Frontend**: Next.js 15 + Tailwind CSS
- **Wallet**: @stacks/connect

## Quick Start

```bash
# Smart contract development
clarinet console

# Run tests
clarinet test

# Frontend
cd microsponsor-frontend
npm install
npm run dev
```

## Contract Functions

### Student Management
- `register-student` - Register with verified institution
- `verify-student` - Admin verifies student (required for scholarships)
- `deactivate-student` - Admin deactivates student
- `update-student-metrics` - Update academic performance

### Scholarship Flow
- `create-scholarship` - Donor creates funded scholarship
- `add-milestone` - Donor adds milestone with requirements
- `complete-milestone` - Student submits milestone evidence
- `verify-milestone` - Admin verifies and releases funds

### Administration
- `add-administrator` / `remove-administrator`
- `register-institution` - Verify educational institutions
- `create-scholarship-template` - Reusable scholarship templates
- `pause-contract` / `resume-contract` - Emergency controls
- `emergency-fund-recovery` - Recover unreleased funds

## Project Structure

```
microsponsor/
  contracts/          Clarity smart contracts
  tests/              Contract test suite
  settings/           Network configuration
  microsponsor-frontend/
    src/
      components/     React components
      pages/          Next.js pages
      utils/          Contract helpers
```

## License

MIT
