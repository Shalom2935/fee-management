// e:\Users\User\Documents\Shalom\Documents\Comptable SJD\fee-management\config\constants.ts
export const SCHOOLS_LIST = [
  "SJP",
  "SJMB",
  "SJHS",
  "SJSL"
  // Add all your school names here
] as const; // Using 'as const' makes it a readonly tuple with literal types

export const PERIODS_LIST = [
  { value: "today", label: "Aujourd'hui" },
  { value: "this-week", label: "Cette semaine" },
  { value: "this-month", label: "Ce mois" },
  { value: "last-3-months", label: "3 derniers mois" },
] as const;

export const FIELDS_LIST = [
  "TC", "GIT", "GME", "GCI", "GP", "GMI", "BIF", "CCA", "SC", "MC", "RH", "IE", "EDD", "BM", "RIM", "AO", "BGM", "A", "SI", "DT", "CL", "DFL", "DH", "DS", "DM"
] as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

