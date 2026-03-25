# Zero-Knowledge Compliance Proof in Banking  
**Using the Spartan Protocol**  

##  Context and Motivation  
In today’s banking environment, ensuring financial compliance while safeguarding user privacy is a significant challenge.  
French regulations, specifically **Article R221-2 of the Monetary and Financial Code** (amended by Decree No. 2020-93 of February 5, 2020) [(Légifrance, 2020)](https://www.legifrance.gouv.fr), establish strict balance limits for **Livret A** savings accounts:  

- **€22,950** for individuals  
- **€76,500** for associations  
- **Up to €100,000** for co-ownership associations with more than 100 units  

Exceeding these thresholds, except through interest capitalization, is prohibited. Consequently, banks must demonstrate compliance with these limits **without compromising sensitive client information**.  

Traditional auditing and regulatory processes often require disclosing individual balances and customer identities, which jeopardizes privacy. This creates a **compliance vs. confidentiality dilemma**:  

> How can a bank convincingly prove adherence to regulations without revealing private financial data?  

Our solution: **A privacy-preserving compliance mechanism using Spartan zkSNARKs**.  

---

##  Objectives of the Solution  
By leveraging **Spartan**, an efficient, general-purpose zero-knowledge SNARK protocol with **no trusted setup**, we enable banks to:  

-  Generate a **zero-knowledge proof** that no account exceeds the legal thresholds  
-  Ensure balances are **hashed** to prevent manipulation  
-  Keep both balances and identities **confidential**  
-  Allow **auditors** to independently verify proofs  
-  Guarantee proofs reflect **authentic and untampered data**  
-  Ensure **integrity and non-manipulation** of account data  

This approach aligns with **GDPR principles** and strengthens compliance assurance while preserving privacy.  

---

#  Spartan ZKP Microservice – BankGuard  

##  Recent Fixes  
- **Fixed:** `500 Unexpected end of JSON input` on GET requests  
- **Improved:** Split handlers by method (GET, POST)  
- **Added:** CORS headers, clearer error responses, and structured JSON output  

---

##  Quick Deployment on Railway  

### ** Prepare Code**  
Ensure the following files are at the root of your GitHub repo:  
- `Cargo.toml`  
- `Dockerfile`  
- `src/main.rs`  

### ** Deploy to Railway**  
1. Go to [Railway.app](https://railway.app)  
2. Create a new project → **Deploy from GitHub repo**  
3. Connect your repo → Railway auto-detects the Dockerfile and deploys automatically  

### ** Copy Your Live URL**  
Find it under:  
`Railway Dashboard → Your Service → Settings → Domains`  
