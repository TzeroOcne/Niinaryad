<script lang="ts">
  import { loadFromFile } from '@features/bookmark/bookmark.service';
  import { keyConfigStore, keyFileStore } from '@lib/app.store';
  import { Fileupload, Label, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
  import './config.css';
  // const reader = new FileReader();
  let value = $keyFileStore;
  let files:FileList|undefined;
  
  const readFile = async (file:File) => {
    console.log(await loadFromFile(file));
  };

  $: if (files?.[0]) {
    const [ file ] = files;
    readFile(file);
  }
  
  $: {
    keyFileStore.set(value);
  }
</script>

<div id="config-container" class="mx-[25%]">
  <div class="text-xl font-bold">
    Load
  </div>
  <div>
    <Label>
      <span>Load Data From File:</span>
      <Fileupload bind:value bind:files class="mt-4 dark:text-white" accept=".json,.csv"/>
    </Label>
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
