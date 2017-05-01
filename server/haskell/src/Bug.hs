module Bug where

data Bug where
  Ant :: Bug
  Spider :: Bug
  Grasshopper :: Bug
  Beetle :: Bug
  Queen :: Bug
  deriving (Eq, Show)

initialBugSupply :: [Bug]
initialBugSupply =
  [ Ant, Ant, Ant
  , Grasshopper, Grasshopper, Grasshopper
  , Spider, Spider
  , Beetle, Beetle
  , Queen
  ]
