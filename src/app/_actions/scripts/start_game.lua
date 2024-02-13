
local roomId = ARGV[1]
local player1 = ARGV[2]
local player2 = ARGV[3]
local player3 = ARGV[4]
local player4 = ARGV[5]

local orderListKey = KEYS[1] .. roomId
local playerSetKey = KEYS[2] .. roomId
local stateObjectKey = KEYS[3] .. roomId

local roomState = redis.call("HGET", stateObjectKey, "state")
if roomState == "WAITING" then
    redis.call("HSET", stateObjectKey, "state", "PLAYING")
    redis.call("RPUSH", orderListKey, player1)
    redis.call("SADD", playerSetKey, player1)
    
    if player2 ~= "null" then
        redis.call("RPUSH", orderListKey, player2)
        redis.call("SADD", playerSetKey, player2)
    end
    if player3 ~= "null" then
        redis.call("RPUSH", orderListKey, player3)
        redis.call("SADD", playerSetKey, player3)
    end
    if player4 ~= "null" then
        redis.call("RPUSH", orderListKey, player4)
        redis.call("SADD", playerSetKey, player4)
    end

    redis.call("HSET", stateObjectKey, "turn", 0)
    return 1
end
return 0







