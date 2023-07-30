const indexURL = chrome.runtime.getURL('index.html');

chrome.storage.sync.onChanged.addListener((changes) => {
  console.log(changes);
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({
    url: indexURL,
  }, result => {
    if (result.length > 0) {
      if (result.filter(({ active }) => active).length > 0) return;
      const [{ id }] = result;
      chrome.tabs.update(id, {
        active: true,
      });
      return;
    }
    chrome.tabs.create({
      active: true,
      url: indexURL,
    });
  });
});