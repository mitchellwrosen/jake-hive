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
import Tuple

type RowNum = Int
type ColNum = Int

-- Invariant: The board is a rectangle
-- TODO: Add bool field
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
removeTile :: RowNum -> ColNum -> Board -> (Tile, Board)
removeTile r c (MakeBoard board) = mapSnd MakeBoard (removeTile_ r c board)

removeTile_ :: RowNum -> ColNum -> [[Cell]] -> (Tile, [[Cell]])
removeTile_ _ _ [] = error "Empty board!"
removeTile_ 0 c (row:rows) =
  mapSnd (\row' -> row' : rows) (removeTileFromRow c row)
removeTile_ r c (row:rows) =
  mapSnd (\rows' -> row : rows') (removeTile_ (r-1) c rows)

removeTileFromRow :: ColNum -> [Cell] -> (Tile, [Cell])
removeTileFromRow _ [] = error "Empty row!"
removeTileFromRow 0 (cell:cells) =
  mapSnd (\cell' -> cell' : cells) (removeTileFromCell cell)
removeTileFromRow n (cell:cells) =
  mapSnd (\cells' -> cell : cells') (removeTileFromRow (n-1) cells)

removeTileFromCell :: Cell -> (Tile, Cell)
removeTileFromCell [] = error "Empty cell!"
removeTileFromCell (tile:tiles) = (tile, tiles)

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
