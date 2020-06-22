import { Request, Response } from 'express'

export async function createNote(req: Request, res: Response) {
  const { noteTypeId, fieldData, deckId } = req.body

  const note = await req.prisma.note.create({
    data: {
      type: { connect: { id: noteTypeId } },
      deck: { connect: { id: deckId } },
      fieldData: {
        create: fieldData.map((data: any) => ({
          fieldName: data.fieldName,
          value: data.value
        }))
      }
    },
    include: {
      fieldData: true
    }
  })

  res.json({
    data: note
  })
}

export async function getNotes(req: Request, res: Response) {
  const notes = await req.prisma.note.findMany({
    include: {
      fieldData: true
    }
  })

  res.json({
    data: notes
  })
}
