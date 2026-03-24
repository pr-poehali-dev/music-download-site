CREATE TABLE IF NOT EXISTS t_p36769415_music_download_site.tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  genre VARCHAR(100),
  duration VARCHAR(20),
  cover_url TEXT,
  audio_url TEXT,
  year INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
