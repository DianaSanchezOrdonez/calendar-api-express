import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { EncodeDataDto } from '../dtos/requests/endode-data.dto'
import { HashDataDto } from '../dtos/requests/hash-data.dto'
import {
  createAuthLink,
  decodeEventData,
  encodeEventData,
  signUpNewUser,
} from '../services/auth.service'
import { AccessCodeDto } from '../dtos/requests/access-code.dto'

export const generateAuthLink = (req: Request, res: Response) => {
  const googleAuthUrl = createAuthLink()

  return res.status(200).send(googleAuthUrl)
}

export const signUp = async (req: Request, res: Response) => {
  const input = plainToClass(AccessCodeDto, req.body)
  const user = await signUpNewUser(input)

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
