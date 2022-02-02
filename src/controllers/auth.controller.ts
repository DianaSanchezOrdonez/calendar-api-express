import { Request, Response } from 'express'
import { generateAuthUrl, refreshToken } from '../services/auth.service'

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const authorizeUrl = await generateAuthUrl()

  return res.status(200).json(authorizeUrl)
  //.json(`Authorize this app by visiting this url: ${authorizeUrl}`)
}

export const getAuthCode = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  await refreshToken(req.query.code as string)

  return res.status(200).json({ code: req.query.code })
}