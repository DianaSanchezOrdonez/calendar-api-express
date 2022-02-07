import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { EncodeDataDto } from '../dtos/requests/endode-data.dto'
import {
  decodeEventData,
  encodeEventData,
  generateAuthUrl,
  refreshToken,
} from '../services/auth.service'

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

export const encodeData = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const input = plainToClass(EncodeDataDto, req.body)
  const encode = await encodeEventData(input)

  return res.status(200).json(encode)
}

export const decodeData = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const decode = await decodeEventData(req.query.hash as string)

  return res.status(200).json(decode)
}
