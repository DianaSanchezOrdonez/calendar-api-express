import { Request, Response } from 'express'
import { getUserByEmail } from '../services/users.service'

export const getUser = async (req: Request, res: Response) => {
  console.log('query', req.query.email)
  const user = await getUserByEmail(req.query.email as string)

  return res.status(200).json(user)
}
