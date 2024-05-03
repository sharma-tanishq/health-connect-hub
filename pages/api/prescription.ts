import { NextApiRequest, NextApiResponse } from 'next';
import connectmongo from '../../middleware/db';
import Doctor from '../../models/Doctor';
import User from '../../models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { userId, docId, token, prescription, change } = req.body;

      // If userId is provided, find the user and return their prescriptions
      if (userId) {
        const user = await User.findOne({ userId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ prescription: user.prescription });
      }

      // If docId, token, and change flag are provided, handle prescription changes
      if (docId && token && change !== undefined) {
        // Find the doctor by docId
        const doctor = await Doctor.findOne({ docId });
        if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
        }

        // Verify the token (password)
        if (doctor.password !== token) {
          return res.status(401).json({ error: 'Invalid token, Login Again' });
        }

        // If change is true and prescription is provided, update the user's prescription
        if (change === true && prescription) {
          const user = await User.findOne({ email: req.body.patientEmail });
          if (!user) {
            return res.status(404).json({ error: 'Patient not found' });
          }
          user.prescription = prescription;
          await user.save();
          return res.status(200).json({ message: 'Prescription updated successfully' });
        }

        // If change is false, return the user's prescription
        if (change === false) {
          const user = await User.findOne({ email: req.body.patientEmail });
          if (!user) {
            return res.status(404).json({ error: 'Patient not found' });
          }
          return res.status(200).json({ prescription: user.prescription });
        }
      }

      return res.status(400).json({ error: 'Invalid request' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in prescription API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default connectmongo(handler);