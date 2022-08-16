--Intro

--Make sure to make a pos.dat file with format below
-- {
--     Pos = {
--         x = 1,
--         y = 2,
--         z = 3,
--     },
--     Dir = 1,
-- }

-- Dir Refrences
-- -x = 1, West
-- -z = 2, North
-- +x = 3, East
-- +z = 4, South
-- +y = 5  Up
-- -y = 6  Down

--Intro
--Refrences

DirRef = {
    [1] = "-x", [2] = "-z", [3] = "+x", [4] = "+z",
    ["-x"] = 1, ["-z"] = 2, ["+x"] = 3, ["+z"] = 4,

    [5] = "+y", [6] = "-y",
    ["+y"] = 5, ["-y"] = 6,
}

DirVector = {
    [1] = vector.new(-1, 0, 0),
    [2] = vector.new(0, 0, -1),
    [3] = vector.new(1, 0, 0),
    [4] = vector.new(0, 0, 1),
    [5] = vector.new(0, 1, 0),
    [6] = vector.new(0, -1, 0),
}

--Refrences
--Position savers

function Update()
    --Updates the turtlePosition File
    local Tab = {}
    Tab.Pos = Pos
    Tab.Dir = Dir
    file = fs.open("turtlePosition.txt", "w")
    file.write(textutils.serialise(Tab))
    file.close()
end

--Position savers
--Checks

function CheckFuel(Needed)
    --Checks fuel level 1 fuel per block
    --If needed is nil it will default to 1
    if not Needed then
        Needed = 1
    end

    return turtle.getFuelLevel() >= Needed
end

--Checks
--Movement functions

function DirMove(MoveDir) --local
    --Updates positon bases on dir given
    Pos = Pos + DirVector[MoveDir]
    Update()
end

function MoveFnc(Call, RealDir) --local
    if not CheckFuel() then
        return false, "Fuel"
    end
    if not Call() then
        return false, "Cant"
    end

    if not RealDir then
        DirMove(Dir)
    else
        DirMove(RealDir)
    end
    return true, Pos
end

function Forward()
    return table.unpack({ MoveFnc(turtle.forward) })
end

function Back()
    return table.unpack({ MoveFnc(turtle.back, ClampDir(Dir + 2)) })
end

function Up()
    return table.unpack({ MoveFnc(turtle.up, 5) })
end

function Down()
    return table.unpack({ MoveFnc(turtle.down, 6) })
end

function Right()
    if not turtle.turnRight() then
        return false, "Cant"
    end
    return ChangeDir(1)
end

function Left()
    if not turtle.turnLeft() then
        return false, "Cant"
    end
    return ChangeDir(-1)
end

--Movement functions
--Direction functions

-- Dir
-- -x = 1,West
-- -z = 2,North
-- +x = 3,East
-- +z = 4,South
-- +y = 5
-- -y = 6

function TurnTo(Val)
    if (type(Val)) == "string" then
        Val = DirRef[Val]
    end
    if (ClampDir(Dir + 1) == Val) then
        Right()
    end
    while not (Dir == Val) do
        Left()
    end
end

function ChangeDir(c)
    Dir = ClampDir(Dir + c)
    Update()
    return true
end

--Direction functions
--Get value functions

function GetDir()
    return Dir
end

function GetPos()
    return Pos
end

--Get value functions
--Misc functions local

function Clamp(x, min1, max1)
    x = x - min1
    max1 = max1 - min1 + 1
    return (x - max1 * math.floor(x / max1)) + min1
end

function ClampDir(x)
    return Clamp(x, 1, 4)
end

--Misc functions local
--Init

function ReadFile()
    local file = fs.open("pos.dat", "r")
    if (not file) then
        error("pos.dat not pressent")
    else
        local Tab = textutils.unserialise(file.readAll())
        Dir = Tab.Dir
        Pos = Tab.Pos
        if (not Dir or not Pos or not type(Pos) == "table" or not type(Dir) == "number") then
            error("pos.dat format incorrect")
        end
        file.close()
    end
end

local fileread, err = pcall(ReadFile)
if (not fileread) then
    error("Error opening or reading pos.dat\n\npos.dat required format:\n" ..
        textutils.serialise({ Dir = 1, Pos = vector.new(1, 2, 3) }))
end
Update()

--Init

function GetWS()
    local ws, err = http.websocket("ws://localhost:5500",
        { type = "computer", computerid = tostring(os.getComputerID()), pos = textutils.serialiseJSON(Pos),
            dir = tostring(Dir) })
    if (not ws) then
        sleep(1)
        return GetWS()
    end
    return ws
end

function ProccessCall(fncString)
    local loadfnc, loaderr = load("return " .. fncString, "any", "t", _ENV);
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
