<script lang="ts">
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import { appCounter, decreaseAppCounter, increaseAppCounter } from '@lib/app.store';
  import niinaryLogo from '@public/niinary.svg';
  import viteLogo from '@public/vite.svg';
  import { Footer } from 'flowbite-svelte';
  import Fa from 'svelte-fa';
  import svelteLogo from '../../assets/svelte.svg';
  import './home.css';
  let files:FileList;

  $: if (files) {
    for (const file of files) {
      console.log(file.text());
    }
  }
</script>

<div>
  <div>
    <img src={niinaryLogo} alt="Svelte Logo"
      class="
        logo h-32 inline
      "
    />
  </div>
  <h1 class="text-[#7300ff] font-bold">Niinaryad</h1>
  
  <div>
    <div class="py-4">
      App Counter: {$appCounter}
    </div>
    <div class="pb-4">
      <button on:click={decreaseAppCounter}>Decrease</button>
      <button on:click={increaseAppCounter}>Increase</button>
    </div>
  </div>
  
  <div>
    <h1>Powered By</h1>
    <div class="flex items-center justify-center pt-8">
      <img class="h-16" src={svelteLogo} alt="svelte">
      <Fa class="text-4xl px-4" icon={faPlus} />
      <img class="h-16" src={viteLogo} alt="vite">
    </div>
  </div>

  <Footer class="bottom-0 absolute w-full rounded-none">
    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>
  </Footer>
</div>

<style>
  .logo {
    height: 7.5em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #7300ff);
  }
</style>
