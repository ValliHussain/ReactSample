// server/routes.js
const express = require("express");
const pool = require("./db");

const router = express.Router();

// Generate dummy data for customers table
router.post("/generate-data", async (req, res) => {
  try {
    // Generate 50 dummy records
    await pool.query(`INSERT INTO customers (customer_name, age, phone, location, created_at)
                      SELECT
                        md5(random()::text),
                        floor(random() * 100),
                        md5(random()::text),
                        md5(random()::text),
                        now() - '1 year'::interval * random() * 365
                      FROM generate_series(1, 50)`);
    res.status(201).json({ message: "Data generated successfully" });
  } catch (error) {
    console.error("Error generating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch customers from the database with pagination and search functionality
router.get("/customers", async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", sortBy = "date" } = req.query;
    const offset = (page - 1) * limit;
    const order = sortBy === "date" ? "created_at" : "created_at::time";
    const query = `
      SELECT
        sno, customer_name, age, phone, location,
        to_char(created_at, 'YYYY-MM-DD') AS date,
        to_char(created_at, 'HH24:MI:SS') AS time
      FROM customers
      WHERE customer_name ILIKE $1 OR location ILIKE $1
      ORDER BY ${order}
      LIMIT $2 OFFSET $3`;
    const { rows } = await pool.query(query, [`%${search}%`, limit, offset]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
