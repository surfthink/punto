

local roomId = ARGV[1]
local players = ARGV[2] -- this is a string of player names separated by commas
-- colors should probably be hard coded in
local colors = ARGV[3]
-- possible cards should probably be hard coded in
local possibleCards = ARGV[4]

local orderListKey = KEYS[1] .. roomId
local playerSetKey = KEYS[2] .. roomId
local stateObjectKey = KEYS[3] .. roomId

local roomState = redis.call("HGET", stateObjectKey, "state")
if roomState == "WAITING" then
    redis.call("HSET", stateObjectKey, "state", "PLAYING")
    redis.call("LPUSH", orderListKey, players)
    redis.call("SADD", playerSetKey, players)
    redis.call("HSET", stateObjectKey, "turn", 0)
    return "inside"
end
return "outside"







