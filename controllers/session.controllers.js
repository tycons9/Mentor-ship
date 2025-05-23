import pool from "../config/db.js"; 

export const createSession = async (req, res) => {
  const { student_id, mentor_id, session_date, session_time } = req.body;

  if (!student_id || !mentor_id || !session_date || !session_time) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const [[student]] = await pool.execute("SELECT id FROM users WHERE id = ? AND role = 'student'", [student_id]);
const [[mentor]] = await pool.execute("SELECT id FROM users WHERE id = ? AND role = 'mentor'", [mentor_id]);

if (!student || !mentor) {
  return res.status(400).json({ error: "Invalid student or mentor ID" });
  
}


  try {
    const [result] = await pool.execute(
      "INSERT INTO sessions (student_id, mentor_id, session_date, session_time) VALUES (?, ?, ?, ?)",
      [student_id, mentor_id, session_date, session_time]
    );

    res.status(201).json({
      message: "Session created successfully",
      sessionId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

