<script lang="ts">
  import { loadFromFile } from '@features/bookmark/bookmark.service';
  import { chromeAPI, keyConfigStore, keyFileStore } from '@lib/app.store';
  import { Label, Spinner, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
  import { currentRootStore, folderStack } from './Config';
  import FolderBreadcrumb from './FolderBreadcrumb.svelte';
  import FolderList from './FolderList.svelte';
  import './config.css';
  let value = $keyFileStore;
  let files:FileList|undefined;
  let currentChildren:chrome.bookmarks.BookmarkTreeNode[];
  
  const refreshChildren = async () => {
    if (chromeAPI?.bookmarks && $currentRootStore?.id) {
      currentChildren = await chromeAPI.bookmarks.getChildren($currentRootStore.id);
    } else {
      currentChildren = [];
    }
  };
  
  currentRootStore.subscribe(async () => {
    refreshChildren();
  });
  
  const readFile = async (file:File) => {
    console.log(await loadFromFile(file));
  };
  
  const onChildrenChanged = async (id:string) => {
    if (chromeAPI?.bookmarks) {
      const [{ parentId }] = await chromeAPI.bookmarks.get(id);
      if (parentId === $currentRootStore?.id) {
        refreshChildren();
      }
    }
  };
  
  const onParentChanged = async (id:string) => {
    if (id === $currentRootStore?.id) {
      refreshChildren();
    }
  };
  
  const onParentAffected = async (_id:string, {
    parentId, oldParentId
  }:{ parentId?:string, oldParentId?:string }) => {
    if (parentId === $currentRootStore?.id && oldParentId === $currentRootStore?.id) {
      refreshChildren();
    }
  };
  
  if (chromeAPI?.bookmarks) {
    chromeAPI.bookmarks.onChanged.addListener(onChildrenChanged);
    chromeAPI.bookmarks.onCreated.addListener(onParentAffected);
    chromeAPI.bookmarks.onRemoved.addListener(onParentAffected);
    chromeAPI.bookmarks.onMoved.addListener(onParentAffected);
    chromeAPI.bookmarks.onChildrenReordered.addListener(onParentChanged);
  }

  $: if (files?.[0]) {
    const [ file ] = files;
    readFile(file);
  }
  
  $: {
    keyFileStore.set(value);
  }
  
  $: if (chromeAPI?.bookmarks) (async () => {
    const [ rootBookmark ] = await chromeAPI.bookmarks.get('0');
    currentRootStore.set(rootBookmark);
    folderStack.set([ rootBookmark ]);
  })();
</script>

<div id="config-container" class="mx-[25%]">
  <!-- <div class="text-xl font-bold">
    Load
  </div>
  <div>
    <Label>
      <span>Load Data From File:</span>
      <Fileupload bind:value bind:files class="mt-4 dark:text-white" accept=".json,.csv"/>
    </Label>
  </div> -->
  <div class="text-xl font-bold">
    Bookmarks
  </div>
  <div>
    <FolderBreadcrumb />
    <Label class="my-4">
      <div>Choose Bookmarks Folder To Load</div>
    </Label>
    <div id="folder-list-container" class="text-left font-mono whitespace-break-spaces my-4">
      {#if $currentRootStore}
      <FolderList folderList={currentChildren ?? []} />
      {:else}
      <Spinner />
      {/if}
    </div>
  </div>
  {#if $keyConfigStore?.project_id}
  <Table striped>
    <colgroup>
      <col class="w-1/3">
      <col class="w-2/3">
    </colgroup>
    <TableBody>
      <TableBodyRow>
        <TableBodyCell>Project ID:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.project_id}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Type:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.type}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Private Key ID:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.private_key_id}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Private Key:</TableBodyCell>
        <TableBodyCell>
          <div>
            {$keyConfigStore.private_key}
          </div>
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Token URL:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.token_uri}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Auth Provider Cert URL:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.auth_provider_x509_cert_url}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Auth Provider URL:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.auth_uri}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Client ID:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.client_id}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Client Cert URL:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.client_x509_cert_url}</div></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Client E-Mail:</TableBodyCell>
        <TableBodyCell><div>{$keyConfigStore.client_email}</div></TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
  {/if}
</div>

<style>
  * {
    text-align: left;
  }
</style>
