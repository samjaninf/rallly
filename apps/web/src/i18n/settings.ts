import allLanguages from "@rallly/languages";
import type { InitOptions } from "i18next";

export const fallbackLng = "en";
export const languages = Object.keys(allLanguages);
export const defaultNS = "app";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS,
): InitOptions {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
