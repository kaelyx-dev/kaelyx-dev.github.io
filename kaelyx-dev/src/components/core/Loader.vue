<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  maxAnimationTime: {
    type: Number,
    default: 4000,
  },
  endWait: {
    type: Number,
    default: 800, 
  },
  randomTiming: {
    type: Boolean,
    default: true,
  },
  fadeOutDuration: {
    type: Number,
    default: 300,
  },
});

const emit = defineEmits(['complete'])

let timeoutIds = [];
const isVisible = ref(true);

const bootSequence = [
  { text: "> Boot Sequence Initiated" },
  { text: "> Initializing modules..." },
  { text: ">   Loading Coffee Module........OK!" },
  { text: ">   Locating Sacrasm Module......Not Found!" },
  { text: "> Loading configuration..." },
  { text: "> Setting up directory..." },
  { text: "> Fetching content..." },
  { text: "> Applying user preferences..." },
  { text: "> Finalizing setup..." },
  { text: "> Launch complete. Welcome!" },
];

const displayedLines = ref([]);

onMounted(() => {
  startBootSequence();
});

onUnmounted(() => {
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = [];
});

const startBootSequence = () => {
  let lineIndex = 0;
  const availableTime = props.maxAnimationTime - props.endWait;
  const baseTimePerLine = availableTime / bootSequence.length;

  let delays = [];
  if (props.randomTiming) {
    const multipliers = bootSequence.map(() => 0.5 + Math.random() * 1.0);
    const totalMultiplier = multipliers.reduce((sum, mult) => sum + mult, 0);
    delays = multipliers.map(
      (mult) => (mult / totalMultiplier) * availableTime
    );
  } else {
    delays = new Array(bootSequence.length).fill(baseTimePerLine);
  }

  const addNextLine = () => {
    if (lineIndex < bootSequence.length) {
      displayedLines.value.push(bootSequence[lineIndex]);

      setTimeout(() => {
        const terminal = document.querySelector(".terminal");
        if (terminal) {
          terminal.scrollTop = terminal.scrollHeight;
        }
      }, 10);

      lineIndex++;

      if (lineIndex < bootSequence.length) {
        const delay = delays[lineIndex - 1];

        const timeoutId = setTimeout(addNextLine, delay);
        timeoutIds.push(timeoutId);
      } else {
        const endTimeoutId = setTimeout(() => {
          isVisible.value = false;
          // Emit complete event after fade duration
          setTimeout(() => {
            emit('complete');
          }, props.fadeOutDuration);
        }, props.endWait);
        timeoutIds.push(endTimeoutId);
      }
    }
  };
  addNextLine();
};
</script>

<template>
  <Transition name="fade" appear>
    <div v-if="isVisible" class="terminal__wrapper">
      <div class="terminal ">
        <div class="terminal__content">
          <div
            v-for="(line, index) in displayedLines"
            :key="index"
            class="terminal__line"
            :style="{ color: line.color || '#fff' }"
          >
            {{ line.text }}
          </div>
          <div class="terminal__cursor">▋</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind('props.fadeOutDuration + "ms"') ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.terminal__wrapper {
  width: 100%;
  height: 100%;
  outline: 2px solid white;
}

.terminal {
  background: #000;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  line-height: 1.4;
  z-index: 9999;
}

.terminal__content {
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
}

.terminal__line {
  margin: 0;
  padding: 2px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal__cursor {
  color: #fff;
  animation: blink 1s infinite;
  display: inline-block;
  margin-left: 2px;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
