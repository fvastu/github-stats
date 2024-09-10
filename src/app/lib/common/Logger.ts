const enableLogging = process.env.ENV_TYPE !== "test";

export class Logger {
  public static log(message: unknown): void {
    if (!enableLogging) return;
    console.log(message);
  }

  public static error(message: unknown): void {
    if (!enableLogging) return;

    console.error(message);
  }
  public static warn(message: unknown): void {
    if (!enableLogging) return;

    console.warn(message);
  }
}
