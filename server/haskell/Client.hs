module Main where

import Data.Text (Text, unpack)
import Network.WebSockets

main :: IO ()
main = do
  putStrLn "Connecting to 127.0.0.1:9999/"
  runClient "127.0.0.1" 9999 "/" app

app :: Connection -> IO ()
app conn = do
  putStrLn "Connected to server"
  text <- receiveText conn
  putStrLn ("Server sent: " ++ unpack text)

receiveText :: Connection -> IO Text
receiveText = receiveData
