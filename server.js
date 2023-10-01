const express = require("express");
const app = express();
const port = 16751;
const pgp = require("pg-promise")();
const connectionString = "postgres://vultradmin:AVNS_Rabadfom9NEw_4SmR3J@vultr-prod-4990d067-2053-4288-b464-7776b62c4fd6-vultr-prod-3594.vultrdb.com:16751/defaultdb"
// const connectionString = "postgres://postgres:1234@localhost:5432/test";
const db = pgp(connectionString);
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.post("/push/students", async (req, res) => {
  const { newStudentName, newStudentId } = req.body;

  if (!newStudentName || !newStudentId) {
    return res
      .status(400)
      .json({ error: "Both student name and ID are required." });
  }

  try {
    const insertQuery = `
      INSERT INTO students_Mohan_tested (student_name, student_id)
      VALUES ($1, $2)
      returning *`;
    const insertedStudent = await db.one(insertQuery, [
      newStudentName,
      newStudentId,
    ]);

    res.status(201).json({
      Id: insertedStudent.id,
      studentId: insertedStudent.student_id,
      studentName: insertedStudent.student_name,
      AC_num: insertedStudent.ac_num,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing student data." });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
