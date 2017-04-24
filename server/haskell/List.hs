module List where

mapList :: (a -> b) -> [a] -> [b]
mapList f [] = []
mapList f (x:xs) = f x : mapList f xs

makeListOfLength :: Int -> a -> [a]
makeListOfLength 0 _ = []
makeListOfLength n x = x : makeListOfLength (n-1) x

listLast :: [a] -> Maybe a
listLast [] = Nothing
listLast (x:[]) = Just x
listLast (_:xs) = listLast xs
