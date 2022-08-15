function GetWS(headers)
    local ws, err = http.websocket("ws://localhost:5500", headers)
    if (not ws) then
        sleep(1)
        return GetWS()
    end
    return ws
end

function ProccessCall(fncString)
    local loadfnc, loaderr = load(fncString);
    if (not loadfnc) then
        loadfnc, loaderr = load("return " .. fncString);
    end
    if (not loadfnc) then
        return false, loaderr;
    end
    return pcall(loadfnc);
end

function ReciveLoop(ws)
    while true do
        local msg = ws.receive()
        ws.send(
            ProccessCall(msg)
        )
    end
end

local id = tostring(os.getComputerID())

while true do
    local res, ws = pcall(GetWS, { type = "computer", computerid = id })
    pcall(ReciveLoop, ws)
end
