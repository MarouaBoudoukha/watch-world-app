// seed.js
//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('./db.sqlite');
const db = require('./lib/db.js').default;

db.serialize(() => {
  // Clear the users table to avoid duplicate entries
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error("Error clearing users table:", err);
      return;
    }
    console.log("Users table cleared.");

    // Insert a company user
    db.run(
      "INSERT INTO users (world_id, role) VALUES ('dummy_company_world_id', 'company')",
      function (err) {
        if (err) {
          console.error('Error inserting company user:', err);
          return;
        }
        const companyId = this.lastID;
        console.log('Inserted company user with id:', companyId);

        // Insert sample videos
        const videos = [
          { title: 'Sample Video 1', description: 'This is a sample video description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', reward: 0.1, status: 'published' },
          { title: 'Sample Video 2', description: 'Another sample video description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', reward: 0.2, status: 'published' },
          { title: 'Sample Video 3', description: 'Sample video N3 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', reward: 0.05, status: 'published' },
          { title: 'Sample Video 4', description: 'Sample video N4 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', reward: 0.03, status: 'published' },
          { title: 'Sample Video 5', description: 'Sample video N5 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', reward: 0.15, status: 'published' },
          { title: 'Sample Video 6', description: 'Sample video N6 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', reward: 0.09, status: 'published' },
          { title: 'Sample Video 7', description: 'Sample video N7 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', reward: 0.17, status: 'published' },
          { title: 'Sample Video 8', description: 'Sample video N8 description.', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', reward: 0.08, status: 'published' }
        ];

        let videosInserted = 0;
        videos.forEach(video => {
          db.run(
            "INSERT INTO videos (company_id, title, description, url, reward, status) VALUES (?, ?, ?, ?, ?, ?)",
            [companyId, video.title, video.description, video.url, video.reward, video.status],
            (err) => {
              if (err) {
                console.error('Error inserting video:', err);
              } else {
                console.log(`Inserted video: ${video.title}`);
              }
              videosInserted++;
              // Close the connection only after processing all videos
              if (videosInserted === videos.length) {
                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err);
                  } else {
                    console.log('Database connection closed.');
                  }
                });
              }
            }
          );
        });
      }
    );
  });
});