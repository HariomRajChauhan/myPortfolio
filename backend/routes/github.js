import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const CACHE_TTL = 10 * 60 * 1000;
let cache = { repositories: null, expiresAt: 0 };

const mapRepository = (repository) => ({
  id: repository.id,
  name: repository.name,
  description: repository.description,
  htmlUrl: repository.html_url,
  homepage: repository.homepage,
  language: repository.language,
  topics: repository.topics || [],
  stars: repository.stargazers_count,
  forks: repository.forks_count,
  updatedAt: repository.updated_at,
  createdAt: repository.created_at,
  isPrivate: repository.private,
  archived: repository.archived,
});

router.get('/repositories', asyncHandler(async (req, res) => {
  if (cache.repositories && cache.expiresAt > Date.now()) {
    return res.json({ repositories: cache.repositories, cached: true });
  }

  const username = process.env.GITHUB_USERNAME || 'HariomRajChauhan';
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'hariom-portfolio-api',
  };

  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`, { headers });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    const error = new Error(details.message || 'Unable to fetch GitHub repositories');
    error.status = response.status === 404 ? 404 : 502;
    throw error;
  }

  const repositories = (await response.json())
    .filter((repository) => !repository.fork && !repository.archived)
    .map(mapRepository);

  cache = { repositories, expiresAt: Date.now() + CACHE_TTL };
  return res.json({ repositories, cached: false });
}));

export default router;
