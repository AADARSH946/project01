# Bhoomi — India Property Investment Finder

A full-stack demo web app: search Indian residential properties by city,
locality and budget, and see an estimated future value, a suggested year
to sell, and nearby infrastructure (metro/highway projects, hospitals,
schools, road connectivity).

**This ships with realistic sample data for 6 cities (Ahmedabad, Mumbai,
Pune, Bangalore, Hyderabad, Delhi NCR / Noida-Gurugram) — it is not
connected to a live property listings feed.** See "Going further" below
for how to plug in real data.

---

## Project structure

```
real-estate-app/
  backend/          Node + Express API, serves property data & profit calculations
  frontend/         React + Vite + Tailwind website
```

## Prerequisites

- **Node.js 18+** and npm installed. Check with:
  ```
  node -v
  npm -v
  ```
  If you don't have it, download from https://nodejs.org (LTS version).

## How to run it (2 terminals in VS Code)

### 1. Start the backend

Open a terminal in VS Code (`` Ctrl+` ``):

```bash
cd real-estate-app/backend
npm install
npm start
```

You should see: `Backend running on http://localhost:5000`

Leave this terminal running. Test it worked by opening
http://localhost:5000/api/meta in a browser — you should see JSON.

### 2. Start the frontend

Open a **second** terminal (click the `+` in the VS Code terminal panel):

```bash
cd real-estate-app/frontend
npm install
npm run dev
```

You should see a local URL, typically `http://localhost:5173`.
Open that in your browser — that's the website.

Both servers need to stay running at the same time while you use the site.

---

## What it does

- **Search**: filter properties by city, locality, property type, BHK, and
  max budget.
- **Results grid**: each card shows a quick 5-year profit estimate.
- **Property detail page**:
  - 10-year value projection chart
  - A suggested sell year with reasoning
  - Nearby upcoming infrastructure projects (metro, highway, IT parks, etc.)
  - Nearby hospitals, schools, and road connectivity

## How the profit / sell-year estimate works

This is a **transparent rule-based heuristic**, not a trained ML model and
not financial advice — see `backend/utils/profitCalculator.js`:

1. Every property has a base annual appreciation rate for its locality
   (from historical trend, stored in the sample data).
2. Nearby infrastructure projects (metro, highway, airport, IT park, etc.)
   add a temporary "boost" to that rate in the ~1 year before and 2 years
   after their completion date, weighted by how close they are.
3. Value is compounded year-by-year for a 10-year horizon using the
   effective rate for each year.
4. The suggested sell year is the year right after the **last** major
   nearby catalyst finishes playing out — i.e. when growth is expected to
   settle back to the locality's baseline rate.

You can tune the boost weights, decay distance, and time windows at the
top of `profitCalculator.js`.

## Going further (replacing sample data with real data)

To make this production-real, you'd swap `backend/data/properties.js` for
a real data source, for example:
- A scraper or licensed data feed from 99acres / MagicBricks / Housing.com
- Government open data (e.g. RERA project registries, state land record
  portals) for verified project status and possession dates
- A proper database (Postgres/MongoDB) instead of an in-memory array, with
  the same shape of fields the frontend already expects
- A real appreciation-rate dataset per locality (e.g. from registered
  transaction/registry data) instead of the illustrative rates used here

The frontend and API contract won't need to change much — just the data
source behind `GET /api/properties` and `GET /api/properties/:id`.

## Tech stack

- **Backend**: Node.js, Express
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Recharts
- **Data**: in-memory sample dataset (no database required to run this demo)
