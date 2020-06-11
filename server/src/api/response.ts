export const Status = {
  FOUND: 200
}

export class ApiResponse {
  data: Record<string, any>
  status: number

  constructor (data: Record<string, any>, status: number = Status.FOUND) {
    this.data = data
    this.status = status
  }
}
