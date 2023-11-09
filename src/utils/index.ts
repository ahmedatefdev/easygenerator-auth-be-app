export function isValidHexOrUint8Array(input: string | Uint8Array): boolean {
  return (
    (input instanceof Uint8Array && input.length === 12) ||
    (typeof input === 'string' && /^[0-9a-fA-F]{24}$/.test(input))
  );
}
