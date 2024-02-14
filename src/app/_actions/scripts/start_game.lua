
local roomId = ARGV[1]

local stateObjectKey = KEYS[1] .. roomId

local roomState = redis.call("HGET", stateObjectKey, "state")
if roomState == "WAITING" then
    redis.call("HSET", stateObjectKey, "state", "PLAYING")
    redis.call("HSET", stateObjectKey, "turn", 0)
    return 1
end
return 0







