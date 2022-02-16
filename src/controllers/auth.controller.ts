import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { EncodeDataDto } from '../dtos/requests/endode-data.dto'
import { HashDataDto } from '../dtos/requests/hash-data.dto'
import {
  createAuthLink,
  decodeEventData,
  encodeEventData,
  addNewUser,
} from '../services/auth.service'
import { logger } from '../helpers/logger.helper'

export const generateAuthLink = (req: Request, res: Response) => {
  const googleAuthUrl = createAuthLink()

  return res.status(200).send(googleAuthUrl)
}

export const createNewUser = async (req: Request, res: Response) => {
  logger.info('env', process.env.REDIRECT_URL)
  const user = await addNewUser(req.body)

  return res.status(200).send(user)
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
  const input = plainToClass(HashDataDto, req.body)
  const decode = await decodeEventData(input)

  return res.status(200).json(decode)
}

export const googleLogin = async (req: Request, res: Response) => {
  // const data = await googleAuth(req.session)
  // return res.status(201).json(data)
  return res.status(201)
}
