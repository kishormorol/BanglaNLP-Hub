const bengaliText = /\p{Script=Bengali}/u;

export const hasBangla = (text: string) => bengaliText.test(text);
