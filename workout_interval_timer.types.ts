import { type CSSProperties, type InputEventHandler, type MouseEventHandler, type RefObject } from "react"

export interface NumberInputProperties {
    ref: RefObject<HTMLInputElement | null>;
    min: number;
    max: number;
    onInput: InputEventHandler<HTMLInputElement>;

}
export interface RangeInputProperties {
    ref: RefObject<HTMLInputElement | null>;
    min: number;
    max: number;
    onMouseMove: MouseEventHandler<HTMLInputElement>;
}

export interface ButtonProperties {
    children: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    style?: CSSProperties;
}


export interface SingleSettingProperties {
    title: string;
    ref: RefObject<HTMLInputElement | null>;
    ref_num: RefObject<HTMLInputElement | null>;
    min: number;
    max: number;
    onInput: InputEventHandler<HTMLInputElement>;
    onMouseMove: MouseEventHandler<HTMLInputElement>;
}