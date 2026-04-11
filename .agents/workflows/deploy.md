---
description: How to deploy Clarix changes to production (clarix.digital)
---

// turbo-all

## CRITICAL RULES — READ BEFORE EVERY TASK
- Project folder: C:\Users\Vishal Birla\.gemini\antigravity\scratch\clarix
- Live domain: https://clarix.digital
- Vercel project: clarix-digital (prj_wFJN2Q9EE9Qa6xj0b7piQHiI3Wah5)
- .vercel/project.json MUST always point to clarix-digital — NEVER clarix-ai
- GitHub repo: https://github.com/vishalbirla700/clarix-digital (branch: main)
- ALWAYS deploy via terminal after every file change. Never leave changes undeployed.

## Deploy Workflow (MANDATORY after every change)

1. Stage all changes
```
git add -A
```

2. Commit with descriptive message
```
git commit -m "fix: description of what was changed"
```

3. Push to GitHub
```
git push origin main
```

4. Deploy to production (clarix.digital)
```
vercel --prod --yes
```

5. Verify live site loaded the change
```
(Invoke-WebRequest -Uri "https://www.clarix.digital/CHANGED_PAGE.html" -UseBasicParsing).Content -split "`n" | Where-Object { $_ -match "CHANGED_TEXT" } | Select-Object -First 2
```

## Important Notes
- GitHub auto-deploy is NOT connected — always run vercel --prod --yes
- Never deploy to clarix-ai project — that is NOT the live domain
- All asset versions use ?v=20260411e for cache busting
- About this setup: 2 Vercel projects exist (clarix-ai and clarix-digital). Only clarix-digital serves clarix.digital
