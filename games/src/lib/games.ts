export const SPACE = ' ';
export type EmptyValue = ' ' | undefined | null;
export type Avatar = string;
export type Label = string;
export type Color = string;

export type Space = {
    avatar: Avatar | EmptyValue
    label?: Label
    color?: Color
};

export type Board = {
    delimiter: string
    pad: string
    maxLength: number
    rowLength: number
    spaces: Array<Space>
};

export interface Game {
    isWon(): [boolean, EmptyValue | Avatar]
    isPlayable(): boolean
    isEmpty(x: number): boolean
    state(): Board
    reset(): void
    move(avatar: Avatar, x: number): boolean
}