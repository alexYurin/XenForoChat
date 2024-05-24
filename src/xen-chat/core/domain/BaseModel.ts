export default abstract class BaseDomain<TModel> {
  public model: TModel

  constructor(model: TModel) {
    this.model = model
  }

  // public getModel() {
  //   return this.model
  // }

  public setModel(model: TModel) {
    this.model = model
  }

  public updateData(model: Partial<TModel>) {
    this.model = {
      ...this.model,
      ...model,
    }
  }
}
