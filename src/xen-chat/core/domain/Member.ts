import BaseModel from './BaseModel'

export type MemberModelType = {
  id: number
  name: string
  title?: string
  avatar?: string
  link?: string
}

export default class Member extends BaseModel<MemberModelType> {
  constructor(model: MemberModelType) {
    super(model)
  }
}
