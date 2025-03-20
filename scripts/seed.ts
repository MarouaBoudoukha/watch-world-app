const sqlite = require('sqlite3');
const { promisify } = require('util');

const seedDb = new sqlite.Database('./db.sqlite');
const run = promisify(seedDb.run.bind(seedDb));

// Sample data
const sampleUsers = [
  {
    world_id: 'sample_user_1',
    role: 'user',
    username: 'John Doe',
    profile_picture_url: 'https://via.placeholder.com/150',
    total_views: 0,
    total_earnings: 0,
    videos_watched: 0
  },
  {
    world_id: 'sample_company_1',
    role: 'company',
    company_name: 'Tech Corp',
    budget: 1000,
    logo_url: 'https://via.placeholder.com/150',
    is_registered: 1,
    total_views: 0
  }
];

const sampleVideos = [
  {
    company_id: 2, // Tech Corp
    title: 'Welcome to Tech Corp',
    description: 'Learn about our company culture and values',
    url: 'https://example.com/video1.mp4',
    reward: 0.05,
    status: 'active',
    views: 0
  },
  {
    company_id: 2,
    title: 'Our Products',
    description: 'Explore our latest product line',
    url: 'https://example.com/video2.mp4',
    reward: 0.10,
    status: 'active',
    views: 0
  }
];

async function seed() {
  try {
    // Drop existing tables
    await run('DROP TABLE IF EXISTS verified_actions');
    await run('DROP TABLE IF EXISTS videos');
    await run('DROP TABLE IF EXISTS users');

    // Create tables
    await run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      world_id TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      company_name TEXT,
      budget REAL DEFAULT 0,
      logo_url TEXT,
      is_registered BOOLEAN DEFAULT 0,
      username TEXT,
      profile_picture_url TEXT,
      total_views INTEGER DEFAULT 0,
      total_earnings REAL DEFAULT 0,
      videos_watched INTEGER DEFAULT 0
    )`);

    await run(`CREATE TABLE verified_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      signal TEXT,
      reward REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    await run(`CREATE TABLE videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      title TEXT,
      description TEXT,
      url TEXT,
      reward REAL,
      status TEXT DEFAULT 'pending',
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id) REFERENCES users(id)
    )`);

    // Insert users
    for (const user of sampleUsers) {
      await run(
        `INSERT INTO users (
          world_id, role, company_name, budget, logo_url, is_registered,
          username, profile_picture_url, total_views, total_earnings, videos_watched
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.world_id,
          user.role,
          user.company_name || null,
          user.budget || 0,
          user.logo_url || null,
          user.is_registered || 0,
          user.username || null,
          user.profile_picture_url || null,
          user.total_views || 0,
          user.total_earnings || 0,
          user.videos_watched || 0
        ]
      );
      console.log('User inserted successfully');
    }

    // Insert videos
    for (const video of sampleVideos) {
      await run(
        `INSERT INTO videos (
          company_id, title, description, url, reward, status, views
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          video.company_id,
          video.title,
          video.description,
          video.url,
          video.reward,
          video.status,
          video.views
        ]
      );
      console.log('Video inserted successfully');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    seedDb.close();
  }
}

seed();