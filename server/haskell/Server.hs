{-# language OverloadedStrings #-}

module Main where

import Data.Text (Text)
import Network.WebSockets

main :: IO ()
main = do
  putStrLn "Listening on 127.0.0.1:9999"
  runServer "127.0.0.1" 9999 app

app :: PendingConnection -> IO ()
app conn = do
  putStrLn "Client Connected"
  putStrLn (show (pendingRequest conn))
  connected <- acceptRequest conn
  sendText connected "Hi"

sendText :: Connection -> Text -> IO ()
sendText = sendTextData
