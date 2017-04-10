module List where

mapList :: (a -> b) -> [a] -> [b]
mapList f [] = []
mapList f (row:rows) = f row : mapList f rows

makeListOfLength :: Int -> a -> [a]
makeListOfLength 0 _ = []
makeListOfLength n x = x : makeListOfLength (n-1) x
