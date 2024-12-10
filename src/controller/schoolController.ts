import { Request, Response } from 'express';
import { School } from '../model/school';

// Function to add a new school
export const addSchool = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { school_id , name, address, latitude, longitude } = req.body;

  // Validate inputs
  if ( !school_id ||!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }
  const existingSchool = await School.findByPk(school_id);

  if (existingSchool) {
    return res.status(400).json({ error: 'School already exists' });
  }
    const newSchool = await School.create({
      school_id,
      name,
      address,
      latitude,
      longitude
    });
 
    return  res.status(200).json({
      message : "School added successfully",
      data : newSchool
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add school' });
  }
};

export const listSchools = async (req: Request, res: Response): Promise<Response>  => {
 const latitude = parseFloat(req.query.latitude?.toString() ?? '');
 const longitude = parseFloat(req.query.longitude?.toString() ?? '');
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const schools = await School.findAll();
     
    const sortedSchools = schools.sort((a : School, b : School) => {
      const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });

    return res.json(sortedSchools);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch schools' });
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadius = 6371; // in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
};
