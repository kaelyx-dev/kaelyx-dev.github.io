<script setup>
import { onMounted, ref } from 'vue'
import sanitise from '../../utilities/sanitise'

let consoleCommand = ref()
let consoleInput = ref()
let consoleOutputLines = ref([])

onMounted(() => {
    consoleInput.value.focus()
})

const commands = {
    clear: {
        command: (() => {
            consoleOutputLines.value = []
            return
        }),
        help: "This command clears the output"
    },
    hello: {command: (() => `Hello World`), help: "Outputs a hello world string"},
    help : {
        command: (() => {
            const commandKeys = Object.keys(commands)
            const longest = Math.max(...commandKeys.map(e => e.length))
            return `Commands: \n <ul> ${commandKeys.map(e => `<li>${(e + " ").padEnd(longest+2, "─")} ${commands[e].help} </li>`).join("")} </ul>`
        }), 
        help:"Outputs all available commands"},
    echo : {
        command:input => {
            const output = sanitise(input)
            return output.length > 0 ? output : "Invalid Parameter"
        },
        help: "Returns what you print"
    }
}

const commandExists = command => commands[command] != undefined
const parseArgCommand = command => {
    const _a = command.split(" ")
    const _c = _a.shift()
    return [_c.trim().toLowerCase(), _a.length > 0 ? _a.join(" ") : undefined]
}

const handle = unprocessedCommand => {
    let [command, args] = parseArgCommand(unprocessedCommand)
    if (commandExists(command)) {
        return commands[command].command(args)
    } else return `Unknown Command`
}

const clearInput = () => {
    consoleCommand.value = ""
}
const getCommand = () => consoleInput.value.value;
const addToScreen = output => consoleOutputLines.value.push(output);

const onPressEnter = () => {
    let command = getCommand()
    clearInput()

    let result = handle(command.toLowerCase().trim())
    if(result) addToScreen(""+result)
}

</script>
<template>
    <ul id="consoleCommandOutputList">
        <li v-for="line in consoleOutputLines" v-html="line">
        </li>
    </ul>
    <input type="text" v-model="consoleCommand" ref="consoleInput" @keyup.enter="onPressEnter"/>
</template>