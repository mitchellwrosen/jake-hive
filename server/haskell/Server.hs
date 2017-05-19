{-# language OverloadedStrings #-}

module Main where

import Data.IORef
import Data.Text (Text, pack)
import Network.WebSockets

type ServerState = IORef Int

main :: IO ()
main = do
  putStrLn "Listening on 127.0.0.1:9999"

  countRef <- newIORef 1

  runServer
    "127.0.0.1"
    9999
    (\pconn -> app countRef pconn)

app :: IORef Int -> PendingConnection -> IO ()
app countRef pconn = do
  putStrLn "Client Connected"
  putStrLn (show (pendingRequest pconn))

  conn <- acceptRequest pconn

  count <- readIORef countRef
  writeIORef countRef (count + 1)

  sendText conn (intToText count)

intToText :: Int -> Text
intToText n = pack (show n)

sendText :: Connection -> Text -> IO ()
sendText = sendTextData
