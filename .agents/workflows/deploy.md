---
description: how to deploy Clarix to production (clarix.digital)
---

# ⚠️ CRITICAL: Clarix uses Vercel CLI — NOT git push

This project is deployed via Vercel CLI directly from the local machine.
`git push` alone does NOT update the live site at clarix.digital.

## Deployment Steps

1. Make your code changes

2. (Optional) Save to git for version history
```
git add -A
git commit -m "your message"
git push origin main
```

// turbo
3. Deploy to production (ALWAYS run this after any change)
```
vercel --prod --yes
```

Run from: `C:\Users\Vishal Birla\.gemini\antigravity\scratch\clarix`

## Verification

After deploy, wait ~10 seconds then open:
- https://www.clarix.digital
- Hard refresh: Ctrl+Shift+R

## Notes
- Vercel account: vishalbirla700-5760
- Project: clarix-ai
- Domain: www.clarix.digital
- Razorpay key: rzp_live_Sau4ZwhVTCtodP (live mode, public key only)
- Settlement: T+2 business days to bank
