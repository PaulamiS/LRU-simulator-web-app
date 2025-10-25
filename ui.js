// UI interactions and glue code

const pageStringInput = document.getElementById('pageString');
const frameCountInput = document.getElementById('frameCount');
const startBtn = document.getElementById('startBtn');

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stepBackBtn = document.getElementById('stepBackBtn');
const stepForwardBtn = document.getElementById('stepForwardBtn');
const speedControl = document.getElementById('speedControl');

const statsOutput = document.getElementById('statsOutput');
const exportBtn = document.getElementById('exportBtn');
const exportTraceBtn = document.getElementById('exportTraceBtn');

function initSimulation() {
  pageReferences = parsePageReferences(pageStringInput.value.trim());
  frameCount = parseInt(frameCountInput.value);
  if (isNaN(frameCount) || frameCount < 1) frameCount = 4;
  currentStep = 0;
  pageFaultsCount = 0;
  executionLog = [];
  startBtn.disabled = true;

  simulateLRU();

  drawStep(executionLog[currentStep]);
  updateStatistics();

  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stepBackBtn.disabled = false;
  stepForwardBtn.disabled = false;
  exportBtn.disabled = true;
  exportTraceBtn.disabled = true;
}

function updateStatistics() {
  statsOutput.innerHTML = `
    <table aria-label="LRU page replacement statistics">
      <thead>
        <tr><th>Total Pages</th><th>Frames Available</th><th>Page Faults</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>${pageReferences.length}</td>
          <td>${frameCount}</td>
          <td>${pageFaultsCount}</td>
        </tr>
      </tbody>
    </table>
  `;
}

exportBtn.onclick = () => {
  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'lru_simulation.png';
  a.click();
};

exportTraceBtn.onclick = () => {
  const dataStr = JSON.stringify(executionLog, null, 2);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'execution_trace.json';
  a.click();
  URL.revokeObjectURL(url);
};

startBtn.onclick = initSimulation;
playBtn.onclick = playAnimation;
pauseBtn.onclick = pauseAnimation;
stepForwardBtn.onclick = stepForward;
stepBackBtn.onclick = stepBack;

speedControl.oninput = () => {
  animationSpeed = speedControl.value;
  if (isPlaying) {
    pauseAnimation();
    playAnimation();
  }
};
