module Hive where

type Board = [Row]

type Row = [Cell]

type Cell = [Tile]

initialBoard :: Board
initialBoard = [[[]]]

data Tile where
  MakeTile :: Color -> Bug -> Tile
  deriving (Show)

data Color where
  White :: Color
  Black :: Color
  deriving (Show)

data Bug where
  Ant :: Bug
  Spider :: Bug
  Grasshopper :: Bug
  Beetle :: Bug
  Queen :: Bug
  deriving (Show)

data Player where
  MakePlayer :: Color -> [Bug] -> Player
  deriving (Show)

initialBugSupply :: [Bug]
initialBugSupply =
  [ Ant, Ant, Ant
  , Grasshopper, Grasshopper, Grasshopper
  , Spider, Spider
  , Beetle, Beetle
  , Queen
  ]

initialPlayer :: Color -> Player
initialPlayer color =
  MakePlayer color initialBugSupply

type RowNum = Int
type ColNum = Int

placePiece :: RowNum -> ColNum -> Tile -> Board -> Board
placePiece _ _ _ [] = error "Empty board!"
placePiece 0 c tile (row:rows) = placePieceOnRow c tile row : rows
placePiece r c tile (row:rows) = row : placePiece (r-1) c tile rows

placePieceOnRow :: ColNum -> Tile -> Row -> Row
placePieceOnRow _ _ [] = error "Empty row!"
placePieceOnRow 0 tile (cell:cells) = (tile:cell) : cells
placePieceOnRow n tile (cell:cells) = cell : placePieceOnRow (n-1) tile cells
