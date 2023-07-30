<script lang="ts">
  import { locationStore } from '@lib/app.store';
  import niinaryLogo from '@public/niinary.svg';
  import type { HeaderItemType, LocationType } from '@types';
  import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
  import './header.css';

  const headerItemLeft:HeaderItemType[] = [
    {
      label: 'Home',
      location: 'home'
    }, {
      label: 'Config',
      location: 'config',
    }, {
      label: 'Store',
      location: 'store',
    }
  ];
  
  const setLocation = (location:LocationType) => {
    locationStore.set(location);
  };
</script>

<Navbar id="navbar" let:hidden let:toggle class="h-16">
  <NavBrand href="#" id="brand-container" class="h-8">
    <button on:click={() => setLocation('home')} class="h-full p-0 flex items-center border-none">
      <img id="brand-img" src={niinaryLogo} alt="" class="h-full m-0">
      <span class="pl-4">
        Niinaryad
      </span>
    </button>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl id="navitem-container" {hidden} class="z-50">
  {#each headerItemLeft as headerItem}
    <button on:click={() => setLocation(headerItem.location)}>
      <NavLi class="p-2">{headerItem.label}</NavLi>
    </button>
  {/each}
  </NavUl>
</Navbar>

<style>
  button {
    background-color: unset;
    width: 100%;
  }

  img#brand-img {
    filter: grayscale();
  }
</style>