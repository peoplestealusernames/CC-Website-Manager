local ws, err = http.websocket("ws://localhost:5500")

while true do
    local msg = ws.recive()
    local loadfnc, loaderr = load(msg)
    if loadfnc then
        ws.send(
            pcall(loadfnc)
        )
    end
end
