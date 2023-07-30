<script lang="ts">
  import { inChrome, inDev, initialLocation, locationStore } from '@lib/app.store';
  import { getLocationPage } from '@lib/location';
  import type { ComponentType } from 'svelte';
  import Extension from './components/extension/Extension.svelte';
  import Header from './components/header/Header.svelte';
  let page:ComponentType = getLocationPage(initialLocation);
  
  locationStore.subscribe(val => {
    page = getLocationPage(val);
  });
  
</script>

<main class="dark overflow-hidden">
  <Header />
  <content class="overflow-scroll">
    <svelte:component this={page} />

    {#if !inDev && inChrome}
    <Extension />
    {/if}
  </content>
  <!-- <div class="w-full whitespace-break-spaces break-words font-mono m-8 text-left font-bold">
    {$messageStore}
  </div> -->
</main>

<style>
  content {
    display: block;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 4rem);
  }
</style>
