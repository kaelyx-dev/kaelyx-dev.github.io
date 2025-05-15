<script setup>
import { onMounted, ref } from 'vue'
import sanitise from '../../utilities/sanitise'
import { useDirectoryStore } from '@/stores/DirectoryStore'
import { parsePath } from '../../utilities/console'

let consoleCommand = ref()
let consoleInput = ref()
let consoleOutputLines = ref([])

const directory = useDirectoryStore()
let cwd = ref("/")

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
    },
    cwd : {
        command: () => cwd.value,
        help: "Prints the current working directory"
    },
    ls : {
        command: () => {
            const d = directory.findDirectory(cwd.value)
            let output = `${Object.keys(d.folders).map(e => `/${e}`).join(" ")} ${Object.keys(d.files).map(e => `${d.files[e].name}.${d.files[e].filetype}`).join(" ")}`
            return output
        },
        help: "Lists files in the current directory"
    },
    cd : {
        command: input => {
            input = parsePath(cwd.value, input)
            let res = directory.findDirectory(input)
            if(!res) return `Cannot fild the directory specified: ${sanitise(input)}`
            cwd.value = res.link || "/"
            return ""
        },
        help: "Change directory"
    },
    open : {
        command: input => {
            input = parsePath(cwd.value, input)
            let res = directory.findFile(input)
            if(!res) return "Could not find file..."
            directory.setActivePage(res)
            return ""
        },
        help: "opens a file on the site"
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
const addToScreen = output => `${consoleOutputLines.value.push(output)}`;

const onPressEnter = () => {
    let command = getCommand()
    clearInput()

    let result = handle(command.trim())
    if(result) addToScreen(""+result)
}

</script>
<template>
    <ul id="consoleCommandOutputList">
        <li v-for="line in consoleOutputLines" v-html="line">
        </li>
    </ul>
    <p><span>user@kaelyx.site:{{cwd}}$</span></p><input type="text" v-model="consoleCommand" ref="consoleInput" @keyup.enter="onPressEnter"/>
</template>