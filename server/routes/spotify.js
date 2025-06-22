import express from 'express';
import axios from 'axios';

const router = express.Router();

let spotifyToken = null;
let tokenExpiry = null;

async function getSpotifyToken() {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return spotifyToken;
  } catch (error) {
    console.error('Spotify token error:', error);
    return null;
  }
}

router.get('/search', async (req, res) => {
  const { artist, track } = req.query;

  if (!artist || !track) {
    return res.status(400).json({ error: '아티스트와 트랙명이 필요합니다.' });
  }

  try {
    const token = await getSpotifyToken();
    if (!token) {
      return res.status(500).json({ error: 'Spotify 인증 실패' });
    }

    const searchQuery = `artist:${artist} track:${track}`;
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        q: searchQuery,
        type: 'track',
        limit: 1,
        market: 'KR'
      }
    });

    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      const track = tracks[0];
      return res.json({
        spotify_url: track.external_urls.spotify,
        preview_url: track.preview_url,
        popularity: track.popularity,
        album: track.album.name,
        release_date: track.album.release_date
      });
    } else {
      return res.json({ error: '곡을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).json({ error: 'Spotify 검색 실패' });
  }
});

router.get('/recommendations', async (req, res) => {
  const { emotion } = req.query;

  const emotionSeeds = {
    happy: { valence: 0.8, energy: 0.7, danceability: 0.6 },
    sad: { valence: 0.2, energy: 0.3, acousticness: 0.6 },
    angry: { valence: 0.3, energy: 0.8, loudness: 0.7 },
    anxious: { valence: 0.4, energy: 0.4, instrumentalness: 0.5 },
    neutral: { valence: 0.5, energy: 0.5, danceability: 0.5 }
  };

  try {
    const token = await getSpotifyToken();
    if (!token) {
      return res.status(500).json({ error: 'Spotify 인증 실패' });
    }

    const seeds = emotionSeeds[emotion] || emotionSeeds.neutral;
    
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        seed_genres: 'pop,k-pop,indie',
        limit: 5,
        market: 'KR',
        target_valence: seeds.valence,
        target_energy: seeds.energy,
        target_danceability: seeds.danceability,
        target_acousticness: seeds.acousticness,
        target_instrumentalness: seeds.instrumentalness,
        target_loudness: seeds.loudness
      }
    });

    const tracks = response.data.tracks.map(track => ({
      name: track.name,
      artist: track.artists[0].name,
      spotify_url: track.external_urls.spotify,
      preview_url: track.preview_url,
      album: track.album.name,
      popularity: track.popularity
    }));

    res.json({ recommendations: tracks });
  } catch (error) {
    console.error('Spotify recommendations error:', error);
    res.status(500).json({ error: 'Spotify 추천 실패' });
  }
});

export default router;