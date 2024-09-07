import { hasFieldType, isObjectNonNull } from "@freik/typechk";
import { ForwardedRef, MutableRefObject } from "react";

export function isMutableRefObject<T>(
  ref: ForwardedRef<T>,
): ref is MutableRefObject<T> {
  return (
    isObjectNonNull(ref) &&
    hasFieldType(ref, 'current', isObjectNonNull)
  );
}

export function secondsToTime(val: number): string {
  const expr = new Date(val * 1000).toISOString();
  if (val < 600) {
    return expr.substring(15, 19);
  } else if (val < 3600) {
    return expr.substring(14, 19);
  } else if (val < 36000) {
    return expr.substring(12, 19);
  } else {
    return expr.substring(11, 19);
  }
}

