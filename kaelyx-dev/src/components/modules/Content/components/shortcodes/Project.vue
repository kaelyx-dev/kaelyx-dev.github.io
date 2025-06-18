<script setup>
import { computed } from 'vue';
import ProjectTechStack from './ProjectTechStack.vue';
import Button from '@/components/core/Button.vue';


// accepts props for project name, short description, teck stack, project link, project live link (if it exists)
const props = defineProps({
  name: String,
  desc: String,
  techstack: String,
  projectlink: String,
  livelink: String,
  doclink: String
});

const techStack = computed(() => props?.techstack?.split(","))
const technology = computed(() => "Technolog" + (techStack.value.length == 1 || !techStack ? "y" : "ies"))

</script>
<template>
    <div class="project-card">
        <div class="project-card__header">
            <h1>{{ props.name || "Project Unknown" }}</h1>
        </div>
        <div class="project-card__body">
            <div class="project-card__overview-title">
                <span>Project Overview:</span>
            </div>
            <div class="project-card__desc">
                <div class="project-card__section-title">
                    <span >Short Description:</span>
                </div>
                <div class="project-card__section-content">
                    <span>{{ props.desc }}</span>
                </div>
            </div>
            <div class="project-card__techstack">
                <div class="project-card__section-title">
                    <span>{{ technology }}</span>
                </div>
                <div class="project-card__section-content">
                    <ProjectTechStack :list="techStack"/>
                </div>
            </div>
            <div class="project-card__links">
                <div class="project-card__section-title">
                    <span>Links:</span>
                </div>
                <ul>
                    <li v-if="props.projectlink" class="project-card__link">
                        <Button :button="{colour: 'random', link: props.projectlink, text: 'Project' }" />
                    </li>
                    <li v-if="props.livelink" class="project-card__link">
                        <Button :button="{colour: 'random', link: props.livelink, text: 'Live' }" />
                    </li>
                    <li v-if="props.doclink" class="project-card__link">
                        <Button :button="{colour: 'random', link: props.doclink, text: 'Docs' }" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>