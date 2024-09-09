declare module "$assets/i18n/*.json" {
  export type Translation = string | Record<string, Translation> | Translation[];

  const translations: Record<string, Translation>;
  export default translations;
}
