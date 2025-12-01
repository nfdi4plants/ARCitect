declare type Result<T> =
  | { ok: true }
  | { ok: false; error: T };
