export async function timeout(ms: number = 0): Promise<void> {
  return new Promise((resolve: Function) => setTimeout(resolve, ms));
}
