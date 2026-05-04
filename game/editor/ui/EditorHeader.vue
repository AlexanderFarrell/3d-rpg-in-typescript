<script setup lang="ts">
import { EditorEvents } from '../core/events';
</script>

<template>
    <div id="editor_header">
        <button @click="EditorEvents.emit('home')">Home</button>
        <button @click="EditorEvents.emit('new')">New</button>
        <button @click="EditorEvents.emit('save')">Save</button>
        <button @click="EditorEvents.emit('load')">Load</button>
    </div>
</template>

<style>

</style>