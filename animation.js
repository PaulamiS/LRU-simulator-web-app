// Animation and canvas rendering logic

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const popup = document.getElementById('popup');

let currentStep = 0;
let timer = null;
let animationSpeed = 500;
let isPlaying = false;

/*function showPopup(message) {
  popup.textContent = message;
  popup.classList.remove('popup-hidden');
  popup.classList.add('popup-visible');
  clearTimeout(popup.hideTimer);
  popup.hideTimer = setTimeout(() => {
    popup.classList.remove('popup-visible');
    popup.classList.add('popup-hidden');
  }, 1500);
}*/
function showPopup(message, isHit) {
  popup.textContent = message;
  popup.classList.remove('popup-visible', 'popup-hidden', 'popup-success', 'popup-fault');

  popup.classList.add('popup-visible');

  if (isHit) {
    popup.classList.add('popup-success');  // green color for hits
  } else {
    popup.classList.add('popup-fault');    // red color for faults
  }

  clearTimeout(popup.hideTimer);
  popup.hideTimer = setTimeout(() => {
    popup.classList.remove('popup-visible');
    popup.classList.add('popup-hidden');
  }, 1500);
}


function drawStep(step) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1e2a78';
  ctx.font = '22px Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
  ctx.fillText('LRU Page Replacement Simulation', 20, 30);
  ctx.font = '18px Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
  ctx.fillText(`Step: ${step.step + 1} / ${executionLog.length}`, 20, 70);
  ctx.fillText(`Reference Page: ${step.currentPage}`, 20, 100);
  ctx.fillText(`Page Faults So Far: ${step.pageFaultCount}`, 20, 130);

  // Frame slots
  const frameSlotWidth = 90;
  const frameSlotHeight = 50;
  const startX = 20;
  const startY = 180;
  ctx.font = '18px Segoe UI, Tahoma';
  ctx.strokeStyle = '#1e2a78';
  ctx.lineWidth = 3;

  ctx.fillStyle = '#264d73';
  ctx.fillText('Frames:', startX, startY - 30);

  for (let i = 0; i < frameCount; i++) {
    const x = startX + i * (frameSlotWidth + 20);
    ctx.fillStyle = '#8ea0d9';
    ctx.fillRect(x, startY, frameSlotWidth, frameSlotHeight);
    ctx.strokeRect(x, startY, frameSlotWidth, frameSlotHeight);
    if (i < step.memory.length) {
      const page = step.memory[i];
      ctx.fillStyle = '#fff';
      ctx.fillText(`Page ${page}`, x + 15, startY + 32);
    }
  }

  showPopup(step.pageFaultOccurred ? 'Page Fault!' : 'Page Hit');
}

function playAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  disableControlsOnPlay();
  timer = setInterval(() => {
    if (currentStep < executionLog.length) {
      drawStep(executionLog[currentStep]);
      currentStep++;
    } else {
      pauseAnimation();
      enableControlsOnEnd();
    }
  }, animationSpeed);
}

function pauseAnimation() {
  isPlaying = false;
  clearInterval(timer);
  timer = null;
  enableControlsOnPause();
}

function stepForward() {
  if (currentStep < executionLog.length) {
    drawStep(executionLog[currentStep]);
    currentStep++;
  }
}

function stepBack() {
  if (currentStep > 1) {
    currentStep -= 2;
    if (currentStep < 0) currentStep = 0;
    drawStep(executionLog[currentStep]);
    currentStep++;
  } else if (currentStep === 1) {
    currentStep = 0;
    drawStep(executionLog[currentStep]);
    currentStep++;
  }
}

function disableControlsOnPlay() {
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  stepBackBtn.disabled = true;
  stepForwardBtn.disabled = true;
}

function enableControlsOnPause() {
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stepBackBtn.disabled = false;
  stepForwardBtn.disabled = false;
}

function enableControlsOnEnd() {
  playBtn.disabled = true;
  pauseBtn.disabled = true;
  stepBackBtn.disabled = false;
  stepForwardBtn.disabled = false;
  exportBtn.disabled = false;
  exportTraceBtn.disabled = false;
}
if (step.pageFaultOccurred) {
  showPopup('Page Fault!', false); // false indicates fault - red popup
} else {
  showPopup('Page Hit', true); // true indicates hit - green popup
}
