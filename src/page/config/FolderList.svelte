<script lang="ts">
  import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
  import { Button, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
  import Fa from 'svelte-fa';
  import { currentRootStore, folderStack } from './Config';

  export let folderList:chrome.bookmarks.BookmarkTreeNode[];
  
  const onSelectFolder = (folder:chrome.bookmarks.BookmarkTreeNode) => {
    return () => {
      currentRootStore.set(folder);
      folderStack.update(value => [...value, folder]);
    };
  };
</script>

<Table striped>
  <colgroup>
    <col>
    <col class="w-16">
  </colgroup>
  <TableBody>
    {#each folderList as folder }
    <TableBodyRow>
      <TableBodyCell class="pr-0">
        {folder.title}
      </TableBodyCell>
      <TableBodyCell class="pl-0 pr-8 w-16">
        <Button id="open-folder-button" class="w-8 h-8 p-1"
          on:click={onSelectFolder(folder)}
        >
          <Fa icon={faAngleRight} />
        </Button>
      </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>
