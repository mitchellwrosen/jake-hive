module Move where

import Board
import Bug

type Path
  = [(RowNum, ColNum)]

data Move where
  MoveTile
    :: (RowNum, ColNum) -- Starting cell
    -> Path             -- In-between cells
    -> (RowNum, ColNum) -- Destination cell
    -> Move

  NewTile :: Bug -> (RowNum, ColNum) -> Move

  deriving Show
