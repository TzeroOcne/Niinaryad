<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
  import { currentRootStore, folderStack } from './Config';
  
  const onSelectBreadcrumb = (index:number) => {
    return () => {
      currentRootStore.set($folderStack[index]);
      folderStack.update(value => {
        const result = value.slice(0, index + 1);
        console.log(result);
        return result;
      });
    };
  };
</script>

<div class="h-16 overflow-x-auto overflow-y-clip">
  <Breadcrumb>
    {#each $folderStack as folder, index }
    <BreadcrumbItem>
      <Button id="breadcrumb-button" class="bg-transparent border-none whitespace-nowrap"
        on:click={onSelectBreadcrumb(index)}
      >
        {folder.title === '' ? 'Root' : folder.title}
      </Button>
    </BreadcrumbItem>
    {/each}
  </Breadcrumb>
</div>
