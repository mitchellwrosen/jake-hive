module Game where

import Bug
import Board
import Color
import List
import Move

data Game where
  MakeGame
    :: Color -- Whose turn it is
    -> [Bug] -- White player's bugs
    -> [Bug] -- Black player's bugs
    -> Board
    -> Game
  deriving Show

-- Precondition: the move is valid
updateGame :: Move -> Game -> Game
updateGame move (MakeGame color whiteBugs blackBugs board) =
  case move of
    MoveTile (r1, c1) _ (r2, c2) ->
      let
        (tile, board') = removeTile r1 c1 board
        board'' = placeTile r2 c2 tile board'
      in
        MakeGame (flipColor color) whiteBugs blackBugs board''

    NewTile bug (row, col) ->
      let
        board' = placeTile row col (MakeTile color bug) board
        color' = flipColor color
        whiteBugs' =
          case color of
            White -> listDelete bug whiteBugs
            Black -> whiteBugs
        blackBugs' =
          case color of
            White -> blackBugs
            Black -> listDelete bug blackBugs
      in
        MakeGame color' whiteBugs' blackBugs' board'
