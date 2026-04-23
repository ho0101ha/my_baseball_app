export const GameResult = {
    WIN:"WIN",
    LOSS:"LOSS",
    DRAW:"DRAW"
} as const

export type GameResultType = (typeof GameResult)[keyof typeof GameResult];