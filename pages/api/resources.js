// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from 'node-fetch'

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405)
  }
  const response = await fetch(process.env.RODE_URL)
  const resp = await response.json()
  const resources = resp.resources.map(({name, uri}) => ({name, uri}))
  res.status(200).json(resources);
};
