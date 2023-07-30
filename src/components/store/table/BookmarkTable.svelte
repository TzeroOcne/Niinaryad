<script lang="ts">
  import bookmarkService from '@features/bookmark/bookmark.service';
  import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, faBook, faBookmark, faSearch } from '@fortawesome/free-solid-svg-icons';
  import { initParams } from '@lib/app.store';
  import type { BookmarkDocType, PaginationInfo, TimerIDType } from '@types';
  import { Button, ButtonGroup, Input, Label, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import Fa from 'svelte-fa';
  import './bookmarktable.css';
  let dataList:BookmarkDocType[] = [];
  let filterValue = '';
  let filterRegex = new RegExp(filterValue, 'i');
  let filteredList:BookmarkDocType[] = [];
  let pageButtonList:PaginationInfo[] = [];
  let searchTimerId: TimerIDType;
  let perPage:number = 10;
  let minIndex = 1;
  let maxIndex = 3;
  let startIndex = minIndex;
  let endIndex = maxIndex;
  let currentIndex = Number(initParams.get('page') ?? 1);
  
  // const perPageOptions:SelectOptionType[] = [
  //   {
  //     name: 10,
  //     value: 10,
  //   },
  //   {
  //     name: 15,
  //     value: 15,
  //   },
  // ];
  
  function filterWith(filter:RegExp) {
    return function filterFunction({ title }:BookmarkDocType) {
      return filter.test(title);
    };
  }
  
  (async () => {
    dataList = await bookmarkService.getAll();
  })();
  
  $: {
    filteredList = dataList.filter(filterWith(filterRegex));
  }
  
  $: {
    if (searchTimerId) clearTimeout(searchTimerId);
    searchTimerId = setTimeout(() => {
      filterRegex = new RegExp(filterValue, 'i');
    }, 400);
  }
  
  $: {
    maxIndex = Math.ceil(filteredList.length / perPage);
  }
  
  $: {
    startIndex = Math.max(
      minIndex,
      Math.min(
        currentIndex - 1,
        maxIndex - 2,
      ),
    );
  }
  
  $: {
    endIndex = Math.min(
      maxIndex,
      Math.max(
        currentIndex + 1,
        minIndex + 2,
      ),
    );
  }
  
  $: if (currentIndex < minIndex) {
    currentIndex = minIndex;
  }
  
  $: if (maxIndex > minIndex && currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
  
  $: console.log(currentIndex);
  
  $: {
    const newPages:PaginationInfo[] = [];
    for (let index = startIndex; index <= endIndex; index++) {
      newPages.push({
        index,
      });
    }
    pageButtonList = newPages;
  }
  
  $: if (perPage < 1) {
    perPage = 1;
  }

  $: if (perPage > 100) {
    perPage = 100;
  }
</script>

<div id="query-bar" class="h-8 mb-8 flex">
  <Label class="grow pr-8">
    <Input type="search" bind:value={filterValue}>
      <Fa class="text-white" slot="left" icon={faSearch} />
    </Input>
  </Label>
  <Label>
    <!-- <Select class="py-0" placeholder="choose amount limit per page" items={perPageOptions} bind:value={perPage} /> -->
    <Input type="number" bind:value={perPage} />
  </Label>
</div>
<Table id="bookmark-table" striped>
  <colgroup>
    <col class="w-16">
    <col>
    <col class="w-32">
    <col class="w-16">
    <col class="w-1/3">
  </colgroup>
  <TableHead class="dark:text-white dark:bg-gray-500">
    <TableHeadCell/>
    <TableHeadCell>
      Title
    </TableHeadCell>
    <TableHeadCell class="text-right">
      Chapter
    </TableHeadCell>
    <TableHeadCell/>
    <TableHeadCell>
      Scanlator
    </TableHeadCell>
  </TableHead>
  <TableBody>
  {#each filteredList.slice((currentIndex - 1) * perPage, currentIndex * perPage)
    as { title, chapter, scanlator, chapterLink, titleLink }
  }
    <TableBodyRow class="border-none">
      <TableBodyCell class="align-top">
        <Button href={titleLink ?? '#'} class="box-content p-4 w-2 h-2">
          <Fa icon={faBook} />
        </Button>
      </TableBodyCell>
      <TableBodyCell class="align-top whitespace-break-spaces break-words">
        {title}
      </TableBodyCell>
      <TableBodyCell class="align-top text-right">
        {chapter}
      </TableBodyCell>
      <TableBodyCell class="align-top pl-0">
        <Button href={chapterLink ?? '#'} class="box-content p-4 w-2 h-2">
          <Fa icon={faBookmark} />
        </Button>
      </TableBodyCell>
      <TableBodyCell>
        {scanlator}
      </TableBodyCell>
    </TableBodyRow>
  {/each}
  </TableBody>
</Table>
<ButtonGroup class="pt-4">
  <Button on:click={() => { currentIndex = minIndex; }}>
    <Fa icon={faAngleDoubleLeft} />
  </Button>
  <Button on:click={() => { currentIndex--; }}>
    <Fa icon={faAngleLeft} />
  </Button>
  {#each pageButtonList as { index } }
  <Button on:click={() => { currentIndex = index; }}
    selected={ currentIndex === index }
  >
    {index}
  </Button>
  {/each}
  <Button on:click={() => { currentIndex++; }}>
    <Fa icon={faAngleRight} />
  </Button>
  <Button on:click={() => { currentIndex = maxIndex; }}>
    <Fa icon={faAngleDoubleRight} />
  </Button>
</ButtonGroup>