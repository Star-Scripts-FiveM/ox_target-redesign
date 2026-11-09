-- Target design editor: /targetdesign opens a picker, choice is saved per player (KVP).
local state = require 'client.state'

local KVP = 'ox_target:design'
local DESIGNS = {
    'gta6', 'classic', 'minimal', 'neon', 'solid',
    'outline', 'retro', 'cyber', 'gold', 'ice', 'crimson', 'pill',
}
local valid = {}
for i = 1, #DESIGNS do valid[DESIGNS[i]] = true end

local default = GetConvar('ox_target:design', 'gta6')
if not valid[default] then default = 'gta6' end

local command = GetConvar('ox_target:designCommand', 'targetdesign')
local current = GetResourceKvpString(KVP)
if not current or not valid[current] then current = default end

local editorOpen = false

RegisterNUICallback('getDesign', function(_, cb)
    cb(current)
end)

RegisterNUICallback('saveDesign', function(data, cb)
    cb(1)
    if type(data) == 'table' and valid[data.design] then
        current = data.design
        SetResourceKvp(KVP, current)
    end
end)

local function closeEditor()
    if not editorOpen then return end
    editorOpen = false
    SetNuiFocus(false, false)
    SendNuiMessage(json.encode({ event = 'setDesign', design = current }))
end

RegisterNUICallback('closeEditor', function(_, cb)
    cb(1)
    closeEditor()
end)

RegisterCommand(command, function()
    if editorOpen or state.isActive() then return end

    editorOpen = true
    SetNuiFocus(true, true)
    SendNuiMessage(json.encode({ event = 'openEditor', design = current, designs = DESIGNS }))
end, false)

AddEventHandler('onResourceStop', function(resource)
    if resource == cache.resource and editorOpen then
        SetNuiFocus(false, false)
    end
end)
