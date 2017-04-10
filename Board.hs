module Board
  ( Board
  , Tile(MakeTile)
  , Cell
  , RowNum
  , ColNum
  , initialBoard
  , placeTile
  , removeTile
  , growDown
  , growLeft
  , growRight
  , growUp
  ) where

import Bug
import Color
import List

type RowNum = Int
type ColNum = Int

-- Invariant: The board is a rectangle
data Board where
  MakeBoard :: [[Cell]] -> Board
  deriving Show

type Cell = [Tile]

data Tile where
  MakeTile :: Color -> Bug -> Tile
  deriving (Show)

initialBoard :: Board
initialBoard = MakeBoard [[[]]]

--------------------------------------------------------------------------------
-- Board dimensions

boardRows :: Board -> Int
boardRows (MakeBoard rows) = length rows

boardCols :: Board -> Int
boardCols (MakeBoard []) = 0
boardCols (MakeBoard (row:_)) = length row

--------------------------------------------------------------------------------
-- Placing a tile

-- Place a tile on a Board at a specific row and column.
--
-- Precondition: row/col must be valid.
-- Precondition: the placement must be valid per the rules of the game.
placeTile :: RowNum -> ColNum -> Tile -> Board -> Board
placeTile r c tile (MakeBoard board) = MakeBoard (placeTile_ r c tile board)

placeTile_ :: RowNum -> ColNum -> Tile -> [[Cell]] -> [[Cell]]
placeTile_ _ _ _ [] = error "Empty board!"
placeTile_ 0 c tile (row:rows) = placeTileOnRow c tile row : rows
placeTile_ r c tile (row:rows) = row : placeTile_ (r-1) c tile rows

placeTileOnRow :: ColNum -> Tile -> [Cell] -> [Cell]
placeTileOnRow _ _ [] = error "Empty row!"
placeTileOnRow 0 tile (cell:cells) = (tile:cell) : cells
placeTileOnRow n tile (cell:cells) = cell : placeTileOnRow (n-1) tile cells

--------------------------------------------------------------------------------
-- Remove a tile

-- Remove a tile from a board at a specific row and column.
--
-- Precondition: row/col must be valid.
removeTile :: RowNum -> ColNum -> Board -> Board
removeTile r c (MakeBoard board) = MakeBoard (removeTile_ r c board)

removeTile_ :: RowNum -> ColNum -> [[Cell]] -> [[Cell]]
removeTile_ _ _ [] = error "Empty board!"
removeTile_ 0 c (row:rows) = removeTileFromRow c row : rows
removeTile_ r c (row:rows) = row : removeTile_ (r-1) c rows

removeTileFromRow :: ColNum -> [Cell] -> [Cell]
removeTileFromRow _ [] = error "Empty row!"
removeTileFromRow 0 (cell:cells) = removeTileFromCell cell : cells
removeTileFromRow n (cell:cells) = cell : removeTileFromRow (n-1) cells

removeTileFromCell :: Cell -> Cell
removeTileFromCell [] = error "Empty cell!"
removeTileFromCell (_:tiles) = tiles

--------------------------------------------------------------------------------
-- Growing the board

growLeft :: Board -> Board
growLeft (MakeBoard board) = MakeBoard (mapList growRowLeft board)

growRowLeft :: [Cell] -> [Cell]
growRowLeft row = []:row

growRight :: Board -> Board
growRight (MakeBoard board) = MakeBoard (mapList growRowRight board)

growRowRight :: [Cell] -> [Cell]
growRowRight [] = [[]]
growRowRight (cell:cells) = cell : growRowRight cells

growUp :: Board -> Board
growUp board@(MakeBoard rows) =
  let
    numCols :: Int
    numCols = boardCols board
  in
    MakeBoard (makeListOfLength numCols [] : rows)

growDown :: Board -> Board
growDown board@(MakeBoard rows) =
  let
    numCols :: Int
    numCols = boardCols board

    newRow :: [Cell]
    newRow = makeListOfLength numCols []
  in
    MakeBoard (rows ++ [newRow])
