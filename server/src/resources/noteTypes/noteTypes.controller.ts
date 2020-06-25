import { Request, Response } from 'express'

export async function createNoteType(req: Request, res: Response) {
  const { name, fields, templates, userId } = req.body

  const noteType = await req.prisma.noteType.create({
    data: {
      name,
      fields,
      templates,
      user: { connect: { id: userId } }
    }
  })

  res.json({
    data: noteType
  })
}

export async function getNoteTypes(req: Request, res: Response) {
  const noteTypes = await req.prisma.noteType.findMany()

  res.json({
    data: noteTypes
  })
}
