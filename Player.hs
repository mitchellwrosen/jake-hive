module Player where

import Color
import Bug

data Player where
  MakePlayer :: Color -> [Bug] -> Player
  deriving (Show)

initialPlayer :: Color -> Player
initialPlayer color = MakePlayer color initialBugSupply
