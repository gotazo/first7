import { biblicalNames } from "./names";

import { prefixes } from "./data/prefixes";
import { roots } from "./data/roots";
import { suffixes } from "./data/suffixes";

export function generateBiblicalName(
  gender = "all"
) {

  let filtered = biblicalNames;

  if (gender !== "all") {

    filtered = filtered.filter(
      (n) => n.gender === gender
    );

  }

  return filtered[
    Math.floor(
      Math.random() * filtered.length
    )
  ];

}

function random<T>(arr: T[]): T {

  return arr[
    Math.floor(
      Math.random() * arr.length
    )
  ];

}

export function generateBiblicalStyleName() {

  const prefix =
    random(prefixes);

  const root =
    random(roots);

  const suffix =
    random(suffixes);

  return `${prefix}${root}${suffix}`;

}