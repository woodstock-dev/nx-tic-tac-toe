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

export type Player = {
    avatar: Avatar
    name: string
}

export interface Game {
    maxPlayers(): number
    isWon(): [boolean, EmptyValue | Avatar]
    isPlayable(): boolean
    isEmpty(x: number): boolean
    isRegistrationComplete(): boolean
    state(): Board
    reset(): void
    register(avatar: Avatar): void
    move(avatar: Avatar, x: number): boolean
}