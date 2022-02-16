import { PrismaClient } from '.prisma/client'

export default async (prisma: PrismaClient) => {
  return Promise.all([
    prisma.user.create({
      data: {
        uuid: 'ckr0ymjo2000501l555pidjkm',
        fullName: 'Diana Ordoñez',
        email: 'diana@ravn.co',
        picture: 'https://lh3.googleusercontent.com/a-/AOh14GgYweRUWM43IUvPdEx79D0l0HlgbZkaEdRaOw_7=s96-c',
        refreshToken: '1//05EIC_gPU5XyQCgYIARAAGAUSNwF-L9Ir48K5GcSkfrrnBZdigSK_yDAdcUXW9-NeMf0P1FKpJhNqquWKXwStReRs67aiYHDnUbk',
      },
    }),
    prisma.user.create({
      data: {
        uuid: 'ckr1793g0000001l98bj0g7kx',
        fullName: 'Eduardo Manrique',
        email: 'ederiveroman@gmail.com',
        picture: 'https://lh3.googleusercontent.com/a-/AOh14GgYweRUWM43IUvPdEx79D0l0HlgbZkaEdRaOw_7=s96-c',
        refreshToken: '1//04A2HHM24xSmGCgYIARAAGAQSNwF-L9Ir9rTDH5wdU7tstE2crJc5zEOgJkl4xLFcg9WyB2ABIn33k5z-T5EtYlfdVM081-Give4',
      },
    }),
  ])
}
