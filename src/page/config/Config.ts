import { writable } from 'svelte/store';

export const folderStack = writable<chrome.bookmarks.BookmarkTreeNode[]>([]);
export const currentRootStore = writable<chrome.bookmarks.BookmarkTreeNode>();
