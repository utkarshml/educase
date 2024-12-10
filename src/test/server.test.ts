import request from 'supertest';
import { School } from '../model/school';
import { app, server } from '../server';
import sequelize from '../config/db';
import { calculateDistance } from '../controller/schoolController';

describe('addSchool Endpoint Tests', () => {
  beforeAll(async () => {
    // Ensure the database connection is active before tests
    await sequelize.authenticate();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await School.destroy({ where: {} });
  });

  afterAll(async () => {
    // Close server and database connection after all tests
    await server.close();
    await sequelize.close();
  });

  it('should add a new school successfully', async () => {
    const schoolData = {
      school_id: 1,
      name: 'Test School',
      address: '123 Main St',
      latitude: 37.7749,
      longitude: -122.4194,
    };

    const response = await request(app)
      .post('/addSchool')
      .send(schoolData)
      .expect(200);

    // Validate response
    expect(response.body.message).toBe('School added successfully');
    expect(response.body.data.school_id).toBe(schoolData.school_id);

    // Validate database entry
    const school = await School.findByPk(response.body.data.school_id);
    expect(school).toBeDefined();
    expect(school?.dataValues.name).toBe(schoolData.name);
    expect(school?.dataValues.address).toBe(schoolData.address);
    expect(school?.dataValues.latitude).toBe(schoolData.latitude);
    expect(school?.dataValues.longitude).toBe(schoolData.longitude);
  });

  it('should return a 400 error for missing fields', async () => {
    const schoolData = {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
    };

    const response = await request(app)
      .post('/addSchool')
      .send(schoolData)
      .expect(400);

    // Validate response
    expect(response.body.error).toBe('All fields are required');
  });

  it('should return a 400 error if the school already exists', async () => {
    const schoolData = {
      school_id: 1,
      name: 'Test School',
      address: '123 Main St',
      latitude: 37.7749,
      longitude: -122.4194,
    };

    // Add the school to simulate it already exists
    await School.create(schoolData);

    const response = await request(app)
      .post('/addSchool')
      .send(schoolData)
      .expect(400);

    // Validate response
    expect(response.body.error).toBe('School already exists');
  });

  it('should handle invalid latitude and longitude values', async () => {
    const schoolData = {
      school_id: 1,
      name: 'Invalid School',
      address: 'Invalid Address',
      latitude: 'invalid_latitude',
      longitude: 'invalid_longitude',
    };

    const response = await request(app)
      .post('/addSchool')
      .send(schoolData)
      .expect(400);

    // Validate response
    expect(response.body.error).toBe('Invalid latitude or longitude');
  });

  it('should add multiple unique schools successfully', async () => {
    const schools = [
      {  school_id: 2, name: 'School A', address: 'Address A', latitude: 12.345, longitude: 67.890 },
      {  school_id: 3, name: 'School B', address: 'Address B', latitude: -45.678, longitude: 123.456 },
    ];

    for (const schoolData of schools) {
      const response = await request(app)
        .post('/addSchool')
        .send(schoolData)
        .expect(200);

      // Validate response
      expect(response.body.message).toBe('School added successfully');
      expect(response.body?.data.school_id).toBeDefined();

      // Validate database entry
      const school = await School.findByPk(response.body?.data.school_id);
      expect(school).toBeDefined();
      expect(school?.dataValues.name).toBe(schoolData.name);
      expect(school?.dataValues.address).toBe(schoolData.address);
      expect(school?.dataValues.latitude).toBe(schoolData.latitude);
      expect(school?.dataValues.longitude).toBe(schoolData.longitude);
    }
  });
  it('should return a list of schools sorted by distance', async () => {
    const school4 = await School.create({
      school_id: 4,
      name: 'School 1',
      address: '123 Main St',
      latitude: 37.7749,
      longitude: -122.4194,
    });

    const school5 = await School.create({
      school_id: 5,
      name: 'School 2',
      address: '456 Elm St',
      latitude: 37.7859,
      longitude: -122.4364,
    });

    const school6 = await School.create({
      school_id: 6,
      name: 'School 3',
      address: '789 Oak St',
      latitude: 37.7963,
      longitude: -122.4574,
    });

    const response = await request(app)
      .get('/listSchools')
      .query({ latitude: 37.7749, longitude: -122.4194 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);

    const sortedSchools = response.body.sort((a : School, b: School) => {
      const distanceA = calculateDistance(37.7749, -122.4194, a.latitude, a.longitude);
      const distanceB = calculateDistance(37.7749, -122.4194, b.latitude, b.longitude);
      return distanceA - distanceB;
    });

    expect(response.body).toEqual(sortedSchools);
  });
  it('should return an error if latitude and longitude are not provided', async () => {
    const response = await request(app).get('/listSchools');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Latitude and longitude are required' });
  });
  it('should return an error if schools cannot be fetched', async () => {
    jest.spyOn(School, 'findAll').mockRejectedValue(new Error('Failed to fetch schools'));

    const response = await request(app)
      .get('/listSchools')
      .query({ latitude: 37.7749, longitude: -122.4194 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch schools' });
  });

});
