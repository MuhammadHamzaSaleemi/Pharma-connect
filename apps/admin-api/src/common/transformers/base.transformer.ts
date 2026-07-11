export abstract class BaseTransformer<TEntity, TResponse> {
  abstract transform(entity: TEntity): TResponse;

  transformMany(entities: TEntity[]): TResponse[] {
    return entities.map((entity) => this.transform(entity));
  }
}
