import BaseModel from './BaseModel'

export type MemberModelType = {
  id: number
  name: string
  title?: string
  avatar?: string
}

export default class Member extends BaseModel<MemberModelType> {
  constructor(model: MemberModelType) {
    super(model)
  }
}
