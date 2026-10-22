import express from "express";
import cors from "cors";
import properties from "./data/properties.js";
import { calculateProfitProjection } from "./utils/profitCalculator.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// -------- Helper --------
function toCr(rupees) {
  return rupees / 10000000;
}

// -------- Routes --------

// Get list of cities & areas (for dropdowns)
app.get("/api/meta", (req, res) => {
  const cities = [...new Set(properties.map((p) => p.city))].sort();
  const areasByCity = {};
  cities.forEach((city) => {
    areasByCity[city] = [
      ...new Set(properties.filter((p) => p.city === city).map((p) => p.area))
    ].sort();
  });
  const propertyTypes = [...new Set(properties.map((p) => p.type))];
  res.json({ cities, areasByCity, propertyTypes });
});

// Search / filter properties
app.get("/api/properties", (req, res) => {
  const { city, area, minBudget, maxBudget, type, bhk } = req.query;

  let results = properties;

  if (city) results = results.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  if (area) results = results.filter((p) => p.area.toLowerCase().includes(area.toLowerCase()));
  if (type) results = results.filter((p) => p.type.toLowerCase() === type.toLowerCase());
  if (bhk) results = results.filter((p) => p.bhk === Number(bhk));
  if (minBudget) results = results.filter((p) => p.price >= Number(minBudget));
  if (maxBudget) results = results.filter((p) => p.price <= Number(maxBudget));

  // Attach a quick 5-year profit summary to each card so the results list is useful at a glance
  const withSummary = results.map((p) => {
    const { projections } = calculateProfitProjection(p, 5);
    const fiveYear = projections[4];
    return {
      ...p,
      quickProjection: {
        year: fiveYear.year,
        estimatedValue: fiveYear.projectedValue,
        estimatedProfitPct: fiveYear.profitPct
      }
    };
  });

  res.json({ count: withSummary.length, results: withSummary });
});

// Get single property with full profit projection + nearby details
app.get("/api/properties/:id", (req, res) => {
  const property = properties.find((p) => p.id === req.params.id);
  if (!property) return res.status(404).json({ error: "Property not found" });

  const { projections, recommendation } = calculateProfitProjection(property, 10);

  res.json({
    ...property,
    priceInCr: Number(toCr(property.price).toFixed(2)),
    profitProjection: projections,
    sellRecommendation: recommendation
  });
});

app.get("/", (req, res) => {
  res.send("India Real Estate Investment Finder API is running.");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
