{-# language OverloadedStrings #-}

module Main where

import Control.Concurrent (threadDelay)
import Control.Exception (onException)
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

  count <- modifyReadIORef countRef (\c -> c + 1)

  let action :: IO ()
      action = do
        sendText conn (intToText count)

        forever (do
          putStrLn "Sending ping"

          sendPing conn ("" :: Text)

          putStrLn "Sent ping"

          threadDelay (1*1000*1000))

      cleanup :: IO ()
      cleanup = modifyIORef countRef (\c -> c - 1)

  onException action cleanup

modifyReadIORef :: IORef a -> (a -> a) -> IO a
modifyReadIORef ref f = do
  a <- readIORef ref
  writeIORef ref (f a)
  pure a

forever :: IO a -> IO a
forever action = do
  action
  forever action

intToText :: Int -> Text
intToText n = pack (show n)

sendText :: Connection -> Text -> IO ()
sendText = sendTextData
