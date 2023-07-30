<script lang="ts">
  import BookmarkService from '@features/bookmark/bookmark.service';
  import { dbIsOpen } from '@lib/app.store';
  import type { Store } from '@types';
  import { TabItem, Tabs } from 'flowbite-svelte';
  import { onDestroy } from 'svelte';
  import { collectionStore } from './Collection';
  export let storeList:Store[] = [
    {
      name: 'bookmark',
      label: 'Bookmark',
      service: BookmarkService,
    },
    {
      name: 'event_log',
      label: 'Event',
      service: BookmarkService,
    },
  ];
  
  onDestroy(() => {
    collectionStore.set(undefined);
  });
</script>

{#if $dbIsOpen }
<Tabs class="m-2">
  {#each storeList as { name, label, service } }
  <TabItem open={name === ($collectionStore ?? 'bookmark')} class="h-4 contents" title={label}
    on:click={() => collectionStore.set(name)}
  >
    <svelte:component this={service.display} />
  </TabItem>
  {/each}
</Tabs>
{/if}