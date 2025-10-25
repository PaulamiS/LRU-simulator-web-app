// LRU Algorithm Core Logic

let pageReferences = [];
let frameCount = 4;
let executionLog = [];
let pageFaultsCount = 0;

function parsePageReferences(refString) {
  return refString.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
}

function simulateLRU() {
  let memory = [];
  let recentIndices = new Map();
  pageFaultsCount = 0;
  executionLog = [];

  for (let i = 0; i < pageReferences.length; i++) {
    const currentPage = pageReferences[i];
    let pageFaultOccurred = false;

    if (!memory.includes(currentPage)) {
      pageFaultOccurred = true;
      pageFaultsCount++;
      if (memory.length < frameCount) {
        memory.push(currentPage);
      } else {
        let lruPage = memory[0];
        let minIndex = recentIndices.get(lruPage) ?? -1;
        for (const page of memory) {
          const lastUsed = recentIndices.get(page) ?? -1;
          if (lastUsed < minIndex) {
            minIndex = lastUsed;
            lruPage = page;
          }
        }
        const replaceIndex = memory.indexOf(lruPage);
        memory[replaceIndex] = currentPage;
      }
    }
    recentIndices.set(currentPage, i);

    executionLog.push({
      step: i,
      currentPage,
      memory: [...memory],
      pageFaultOccurred,
      pageFaultCount: pageFaultsCount,
    });
  }
}
