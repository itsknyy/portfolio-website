// ================= ICON INITIALIZATION =================

// Wait until the full HTML document is loaded
// This prevents JS from running before elements exist
document.addEventListener('DOMContentLoaded', () => {
  // If Lucide icon library is loaded, replace <i data-lucide=""> with SVG icons
  if (window.lucide) lucide.createIcons();
});

// ================= FADE-IN SCROLL ANIMATION =================

// IntersectionObserver watches elements when they enter the viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // Check if element is visible on screen
    if (entry.isIntersecting) {
      // Add 'visible' class to trigger CSS animation
      entry.target.classList.add('visible');

      // If section has an <h2>, apply extra reveal effect
      const h2 = entry.target.querySelector('h2');
      if (h2) h2.classList.add('revealed');
    }
  });
}, {
  // Trigger animation when 20% of element is visible
  threshold: 0.2
});

// Apply observer to all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ================= TERMINAL COMMAND DATA =================

// List of fake terminal commands shown to user
const commands = [
  'aws sts get-caller-identity',
  'aws ec2 describe-instances',
  'docker ps',
  'docker images',
  'terraform init',
  'terraform plan',
  'kubectl get nodes',
  'kubectl get pods -A'
];

// Terminal DOM elements
const cmdEl = document.getElementById('command'); // Text being typed
const terminal = document.getElementById('terminal'); // Terminal container

// ================= TERMINAL STATE VARIABLES =================

let lastCommand = null;        // Prevents repeating same command
let terminalRunning = false;  // Controls terminal start/stop
let typingInterval = null;    // Stores typing timer
let currentIndex = 0;         // Tracks current character index

// ================= RANDOM COMMAND PICKER =================

function getRandomCommand() {
  let cmd;

  // Keep picking until command is different from last one
  do {
    cmd = commands[Math.floor(Math.random() * commands.length)];
  } while (cmd === lastCommand);

  lastCommand = cmd;
  return cmd;
}

// ================= TYPEWRITER EFFECT =================

function typeCommand(text, done) {
  // Run typing animation at interval
  typingInterval = setInterval(() => {

    // Stop typing if terminal is not active
    if (!terminalRunning) return;

    // Add one character at a time
    cmdEl.textContent += text[currentIndex++];

    // When command finishes typing
    if (currentIndex >= text.length) {
      clearInterval(typingInterval);
      typingInterval = null;

      // Pause before clearing and typing next command
      setTimeout(() => {
        currentIndex = 0;
        cmdEl.textContent = '';
        done && done(); // Callback to continue loop
      }, 1400);
    }
  }, 190); // Typing speed (ms per character)
}

// ================= TERMINAL LOOP =================

function runTerminal() {
  // Prevent multiple loops running at same time
  if (terminalRunning) return;

  terminalRunning = true;

  // Type random command, then repeat
  typeCommand(getRandomCommand(), () => {
    setTimeout(runTerminal, 4200);
  });
}

// ================= TERMINAL VISIBILITY OBSERVER =================

// Start terminal animation only when visible on screen
const termObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Start terminal animation
      runTerminal();
    } else {
      // Stop animation when user scrolls away
      terminalRunning = false;
      if (typingInterval) clearInterval(typingInterval);
    }
  });
}, {
  // Terminal must be 50% visible to start
  threshold: 0.5
});

// Observe the terminal element
termObserver.observe(terminal);