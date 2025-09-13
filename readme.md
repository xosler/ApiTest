# Oppizi - API Test Automation

Automated API tests for the [Open Charge Map API](https://map.openchargemap.io/#/search) using **Cypress** and **Mochawesome** for reporting.

---

## Requirements

- **Node.js:** v20
- **NPM**: latest stable compatible with Node 20  



## Installation

**Clone the repository:**

```bash
git clone git@github.com:xosler/ApiTest.git
cd ApiTest
```


**Install the dependencies**
> ⚠️ For security, install packages from before the September 2025 NPM attack:
> ```bash
> npm install
> ```

---

## Run
First of all you need to create a local .env file, and put your auth key on the file.

**How to run**
```bash
npm run test
```

The reports will be created at the Reports folder