export type ThenArg<TPromise> = TPromise extends PromiseLike<infer TValue>
  ? ThenArg<TValue>
  : TPromise;

export type inferAsyncReturnType<TFunction extends (...args: any) => any> =
  ThenArg<ReturnType<TFunction>>;
