export type ResolvedResult = {
  user?: Record<string, string | number | object>;
  data: object;
};

export interface IProviderOption {
  fetchProfile?: boolean;
  onResolved(result: ResolvedResult): void;
  onRejected(error: Error): void;
}
