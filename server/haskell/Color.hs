module Color where

data Color where
  White :: Color
  Black :: Color
  deriving (Show)

flipColor :: Color -> Color
flipColor White = Black
flipColor Black = White
