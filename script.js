document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const h2 = entry.target.querySelector('h2');
      if (h2) h2.classList.add('revealed');
    }
  });
}, { threshold:0.2 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

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

const cmdEl = document.getElementById('command');
const terminal = document.getElementById('terminal');

let lastCommand = null;
let terminalRunning = false;
let typingInterval = null;
let currentIndex = 0;

function getRandomCommand() {
  let cmd;
  do {
    cmd = commands[Math.floor(Math.random() * commands.length)];
  } while (cmd === lastCommand);
  lastCommand = cmd;
  return cmd;
}

function typeCommand(text, done) {
  typingInterval = setInterval(() => {
    if (!terminalRunning) return;

    cmdEl.textContent += text[currentIndex++];

    if (currentIndex >= text.length) {
      clearInterval(typingInterval);
      typingInterval = null;
      setTimeout(() => {
        currentIndex = 0;
        cmdEl.textContent = '';
        done && done();
      }, 1400);
    }
  }, 190);
}

function runTerminal() {
  if (terminalRunning) return;
  terminalRunning = true;

  typeCommand(getRandomCommand(), () => {
    setTimeout(runTerminal, 4200);
  });
}

const termObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runTerminal();
    } else {
      terminalRunning = false;
      if (typingInterval) clearInterval(typingInterval);
    }
  });
}, { threshold:0.5 });

termObserver.observe(terminal);
