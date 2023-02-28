import {getContext, setContext} from 'svelte';

type RegisterItemTypeFunc = (ref: HTMLButtonElement) => void;

const registerItemSymbol = Symbol();
export function getRegisterItemFunc(): RegisterItemTypeFunc {
  return getContext(registerItemSymbol);
}
export function setRegisterItemFunc(registerItem: RegisterItemTypeFunc) {
  setContext(registerItemSymbol, registerItem);
}
