<script setup lang="ts">
import { ref } from 'vue';
import { EditorEvents } from '../core/events';

const isCreatePromptOpen = ref(false)
const newProjectName = ref("");
const errorMessage = ref("");

function createProject() {
    if (newProjectName.value )
    (window as any).electronAPI.projects.create(newProjectName.value);
}
</script>

<template>
    <div id="editor_header">
        <button @click="EditorEvents.emit('home')">Home</button>
        <button @click="isCreatePromptOpen = !isCreatePromptOpen">New</button>
        <button @click="EditorEvents.emit('save')">Save</button>
        <button @click="EditorEvents.emit('load')">Load</button>
    </div>
    <form v-if="isCreatePromptOpen" @submit.prevent="createProject()">
        <h1>Create New Project</h1>
        <label>Project Name:</label>
        <input type="text" v-model="newProjectName">
        <div>{{ errorMessage }}</div>
        <button type="submit">Create</button>
    </form>
</template>

<style>

</style>
