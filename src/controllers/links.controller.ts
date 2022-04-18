import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { EncodeDataDto } from '../dtos/links/requests/endode-data.dto'
import { LinksService } from '../services/links.service'
import { HashDataDto } from '../dtos/links/requests/hash-data.dto'

export const encodeEventData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dto = plainToClass(EncodeDataDto, req.body)
  console.log('dto controller', dto)
  await dto.isValid()

  const result = await LinksService.encodeEventData(dto)

  res.status(200).json(result)
}

export const decodeEventData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dto = plainToClass(HashDataDto, req.body)
  console.log("decode controller", req.body)
  await dto.isValid()

  const result = await LinksService.decodeEventData(dto)

  res.status(200).json(result)
}
