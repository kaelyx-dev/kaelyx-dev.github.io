import { h } from 'vue'

import HelloWorld from "@module/Content/components/shortcodes/HelloWorld.vue"
import Icon from "@module/Content/components/shortcodes/Icon.vue"
import { useConfigStore } from '@/stores/ConfigStore'
import Link from '@module/Content/components/shortcodes/Link.vue'
import Image from '@module/Content/components/shortcodes/Image.vue'
import Console from '@module/Content/components/shortcodes/Console.vue'
import Project from '@module/Content/components/shortcodes/Project.vue'
import ProjectTechStack from '@module/Content/components/shortcodes/ProjectTechStack.vue'
import ArticleWidget from '@module/Content/components/shortcodes/ArticleWidget.vue'
import Share from '@module/Content/components/shortcodes/Share.vue'
import ReadTime from '@module/Content/components/shortcodes/ReadTime.vue'

const shortCodes = {
    // Content
    "HELLOWORLD": HelloWorld,
    "ICON": Icon,
    "LINK": Link,
    "IMAGE": Image,
    "PROJECT" : Project,
    "PROJECTTECHSTACK" : ProjectTechStack,
    "ARTICLEWIDGET" : ArticleWidget,
    "SHARE": Share,
    "READTIME": ReadTime,
    
    // Layout
    
    // Tools
    "CONSOLE" : Console,
}

//{{\s*(?<closer>\:)?(?<shortcode>\w+(?:\.(?<subcode>\w+)))(?<args>(?:\s+\w+=(?:"[^"]*"|\S+))*)\s*(?<opener>\:)?}}
//{{helloWorld.test:}}
//{{:helloWorld.test}}

//{{(?<layoutParent>\w+)(?:\.(?<layoutChild>\w+))}}(?<content>[\S\s]*){{\\\1\.?\2}}
//(?<opener>{{(?<layoutParent>\w+)(?:\.(?<layoutChild>\w+))}})(?:[\S\s]*)(?<closer>{{\/\2\.?\3}})
// (?<opener>{{\s*(?<layoutParent>\w+)(?:\.(?<layoutChild>\w+))\s*}})(?:[\S\s]*)(?<closer>{{\s*\/\2\.?\3\s*}})
// (?<opener>{{\s*(?<layoutParent>\w+)(?:\.(?<layoutChild>\w+))\s*(?<args>(?:\s*\w+=\w+)*)?\s*}})(?:[\S\s]*)(?<closer>{{\s*\/\2\.?\3\s*}})
// function parseNestedShortcodes(text) {
//   const stack = []
//   const tokens = tokenize(text) // Split into opening tags, closing tags, and content
//   for (const token of tokens) {
//     if (token.type === 'opening') {
//       stack.push(token)
//     } else if (token.type === 'closing') {
//       const opening = stack.pop()
//       // Match opening with closing, process content between
//     }
//   }
// }
const text = `
<!-- Title: Readme.md -->
<!-- Date: 24/04/2025 -->
<!-- Keywords: a,b,c,d,e-->
<!-- ShowPermalink: true-->

# This is an example file that exists in kaelyx.content

I have some content here

## TODO:
* Add an image to this file
* see how it loads
* do I need to use full paths or can i figure out relative paths

{{helloworld}}
{{layout.flex}}
x

y
{{/layout.flex}}

{{layout.flex style="horizontal" gap="10px"}}
  {{group.div}}
    test1
  {{/group.div}}
  {{group.div}}
    test2
  {{/group.div}}
{{/layout.flex}}

<h1></h1>
`;



function replaceLayoutBlocks(input) {
  const tokenRegex = /\{\{\s*(\/?)([\w.]+)([^}]*)\}\}/g;
  const stack = [];
  let output = '';
  let lastIndex = 0;

  let match;
  while ((match = tokenRegex.exec(input)) !== null) {
    const [fullToken, slash, tag, args] = match;
    const index = match.index;

    if (!slash) {
        console.log(args)
      stack.push({
        tag,
        startIndex: index,
        args: args.trim(),
        contentStart: index + fullToken.length,
      });
    } else {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          const opener = stack.splice(i, 1)[0];

          if (stack.length === 0) {
            output += input.slice(lastIndex, opener.startIndex);
          }

          const innerContent = input.slice(opener.contentStart, index);

          const className = tag.split('.').join(' ');
          const wrapped = `<div class="${className}">${innerContent}</div>`;

          if (stack.length === 0) {
            output += wrapped;
            lastIndex = index + fullToken.length;
          } else {
            input =
              input.slice(0, opener.startIndex) +
              wrapped +
              input.slice(index + fullToken.length);

            tokenRegex.lastIndex = opener.startIndex + wrapped.length;
          }

          break;
        }
      }
    }
  }

  // Append remaining text
  if (lastIndex < input.length) {
    output += input.slice(lastIndex);
  }

  return output;
}

console.log(replaceLayoutBlocks(text));


const regexPattern = () => {
    const config = useConfigStore()

    const s = config.getValue("content.shortcodes.syntax.start")
    const e = config.getValue("content.shortcodes.syntax.end")
    return new RegExp(`${_rE(s)}\\s*(?<shortcode>\\w+)(?<args>(?:\\s+\\w+=(?:"[^"]*"|\\S+))*)\\s*${_rE(e)}`,"g")
}

const _rE = str =>  str.split("").map(e => `\\${e}`).join("")

export const generateShortcodeMap = (text, removeUnknownShortcodes) => {
    const config = useConfigStore()

    if(!text || text.length <= 0) return ""
    let shortCodes = findAllShortCodes(text)
    const placeholderTagName = config.getValue("content.shortcodes.placeholder")

    shortCodes.forEach(shortcode => {

        if(shortcode.component) text = text.replace(shortcode.code, shortcode.placeholder)
        else if(removeUnknownShortcodes) text = text.replace(shortcode.code, "")

    })

    return {
        text: text,
        placeholder: placeholderTagName,
        map : shortCodes.filter(e => e)
    }
}

const findAllShortCodes = (text) => {
    return [...text.matchAll(regexPattern())].map((e, idx) => {
        let _id = `sc_${idx}_${Math.random().toString(16).slice(4)}`
        let name = e.groups["shortcode"]
        let _props = {}

        let _component = getComponent(name)

        if (e.groups['args']){
            const argRegex = /\b(\w+)=("([^"]*)"|(\S+))/g;
            let argMatch;
            while ((argMatch = argRegex.exec(e.groups['args'])) !== null) {
                _props[argMatch[1]] = argMatch[3] || argMatch[4];
            }
        } else _props = undefined

        return {
            id          : _id,
            name        : name,
            code        : e[0],
            props       : _props,
            component   : createHyperscriptObject(_component, _props),
            placeholder : generatePlaceholderNode(_id)
        }
    })
}

const createHyperscriptObject = (component, props) => (component) ? props ? h(component, props) : h(component) : undefined
const generatePlaceholderNode = id => {
    const placeholderTagName = useConfigStore().getValue("content.shortcodes.placeholder")
    return `<${placeholderTagName} data-id=\"${id}\"></${placeholderTagName}>`

}

export const findShortcode = (id, list) => list.find(e => e.id == id)

export const getComponent = componentName => {
    return shortCodes[Object.keys(shortCodes).filter(e => e.toUpperCase() == componentName.toUpperCase())[0]]
}