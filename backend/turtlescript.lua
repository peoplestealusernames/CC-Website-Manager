local ws, err = http.websocket("ws://localhost:5500")

if (not ws) then
    return err
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

while true do
    local msg = ws.receive()
    ws.send(
        ProccessCall(msg)
    )
end
