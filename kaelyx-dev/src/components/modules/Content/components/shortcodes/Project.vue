<script setup>
import ProjectTechStack from './ProjectTechStack.vue';


// accepts props for project name, short description, teck stack, project link, project live link (if it exists)
const props = defineProps({
  projectName: String,
  shortDescription: String,
  techStack: Array,
  projectLink: String,
  liveLink: String
});
</script>
<template>

// TODO Needs Styled and checked
<div class="project-card">
    <h2 class="project-title">{{ props.projectName }}</h2>
    <p class="project-description">{{ props.shortDescription }}</p>
    <div class="project-tech-stack">
        <strong>Tech Stack:</strong>
        <ProjectTechStack :list="props.techStack" />
    </div>
    <div class="project-links">
        <a :href="props.projectLink" target="_blank" rel="noopener" class="project-link">Source Code</a>
        <a v-if="props.liveLink" :href="props.liveLink" target="_blank" rel="noopener" class="project-live-link">Live Demo</a>
    </div>
</div>

</template>