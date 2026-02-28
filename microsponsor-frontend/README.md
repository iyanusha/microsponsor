# MicroSponsor Frontend

Next.js 16 frontend for the MicroSponsor scholarship platform on Stacks.

## Setup

```bash
cp .env.example .env.local
# Fill in your contract address and network
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` | `testnet` or `mainnet` | `testnet` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | deployer testnet addr |
| `NEXT_PUBLIC_APP_NAME` | App name shown in wallet | `MicroSponsor` |
| `NEXT_PUBLIC_APP_URL` | App URL for wallet auth | `http://localhost:3000` |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | Student / donor overview |
| `/scholarships/create` | Create a new scholarship |
| `/scholarships/[id]` | Scholarship detail + milestones |
| `/students/register` | Register as a student |
| `/students/[address]` | Student profile |

## Deploy

Push to GitHub and connect to Vercel. Set the root directory to
`microsponsor-frontend` and add the env vars in the Vercel dashboard.
