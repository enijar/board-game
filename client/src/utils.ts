export function asset(path: string): string {
  const url = path.replace(/^\/+/, "");
  return `${process.env.PUBLIC_PATH}${url}`;
}
