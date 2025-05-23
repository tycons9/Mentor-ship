import pool from '../config/db.js';
import path from 'path';



export const createProfile = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      bio,
      location,
      occupation,
      education,
      skills,
      interests,
      experience
    } = req.body;

    const profile_image = req.file ? req.file.filename : null;

    const parsedSkills = skills ? JSON.stringify(skills) : null;
    const parsedInterests = interests ? JSON.stringify(interests) : null;
    const parsedExperience = experience ? JSON.stringify(experience) : null;

    const [result] = await pool.execute(
      `INSERT INTO profiles 
        (user_id, full_name, bio, profile_image, location, occupation, education, skills, interests, experience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        full_name,
        bio,
        profile_image,
        location,
        occupation,
        education,
        parsedSkills,
        parsedInterests,
        parsedExperience
      ]
    );

    res.status(201).json({ message: 'Profile created', profileId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};



export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};


export default { createProfile, getProfileByUserId };
