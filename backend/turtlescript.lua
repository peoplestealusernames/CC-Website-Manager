function GetWS()
    local ws, err = http.websocket("ws://localhost:5500",
        { type = "computer", computerid = tostring(os.getComputerID()) })
    if (not ws) then
        sleep(1)
        return GetWS()
    end
    return ws
end

function ProccessCall(fncString)
    local loadfnc, loaderr = load("return " .. fncString);
    if (not loadfnc) then
        loadfnc, loaderr = load(fncString);
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
            textutils.serialiseJSON { ProccessCall(msg) }
        )
    end
end

while true do
    local res, ws = pcall(GetWS)
    pcall(ReciveLoop, ws)
end
