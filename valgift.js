 // ENVELOPE → MODAL (one modal, two views: puzzle + success)
        const envelopeStage = document.getElementById('envelopeStage');
        const envelope = document.getElementById('envelope');
        const puzzleGrid = document.getElementById('puzzleGrid');
        const puzzleView = document.getElementById('puzzleView');
        const successView = document.getElementById('successView');
        
        envelope.addEventListener('click', () => {
            envelope.style.pointerEvents = 'none';
            const heart = envelope.querySelector('.envelope-heart');
            heart.classList.add('hidden');
            setTimeout(() => {
                envelope.classList.add('opening');
                setTimeout(() => {
                    envelopeStage.classList.add('envelope-stage-fade-out');
                    setTimeout(() => {
                        envelopeStage.style.display = 'none';
                        document.body.classList.add('show-modal');
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => puzzleView.classList.add('visible'));
                        });
                    }, 450);
                }, 700);
            }, 380);
        });
        
        let tiles = [];
        
        // 3x3 puzzle: pieces 1–9, empty piece is 3 (top-right).
        const EMPTY_PIECE = 3;
        const solution = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // empty (3) at index 2 = top-right
        let currentState = [...solution];
        
        function initPuzzle() {
            scramblePuzzle();
            renderPuzzle();
        }
        
        function scramblePuzzle() {
            // TESTING NOTE: Use "i < 1" instead of "i < 10" so that the puzzle is one move away from completion
            for (let i = 0; i < 10; i++) {
                const emptyIndex = currentState.indexOf(EMPTY_PIECE);
                const validMoves = getValidMoves(emptyIndex);
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                [currentState[emptyIndex], currentState[randomMove]] = [currentState[randomMove], currentState[emptyIndex]];
            }
        }
        
        function getValidMoves(emptyIndex) {
            const validMoves = [];
            const row = Math.floor(emptyIndex / 3);
            const col = emptyIndex % 3;
            
            if (row > 0) validMoves.push(emptyIndex - 3);
            if (row < 2) validMoves.push(emptyIndex + 3);
            if (col > 0) validMoves.push(emptyIndex - 1);
            if (col < 2) validMoves.push(emptyIndex + 1);
            
            return validMoves;
        }
        
        function renderPuzzle() {
            puzzleGrid.innerHTML = '';
            tiles = [];
            
            currentState.forEach((piece, index) => {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';
                
                if (piece === EMPTY_PIECE) {
                    tile.classList.add('empty');
                    // No image: empty space is transparent until puzzle is solved
                } else {
                    tile.style.backgroundImage = `url('images/tile-${piece}.png')`;
                    tile.onclick = () => moveTile(index);
                }
                
                puzzleGrid.appendChild(tile);
                tiles.push(tile);
            });
        }
        
        function moveTile(index) {
            const emptyIndex = currentState.indexOf(EMPTY_PIECE);
            const validMoves = getValidMoves(emptyIndex);
            
            if (validMoves.includes(index)) {
                [currentState[emptyIndex], currentState[index]] = [currentState[index], currentState[emptyIndex]];
                renderPuzzle();
                
                // Check if solved
                if (isPuzzleSolved()) {
                    setTimeout(onPuzzleSolved, 300);
                }
            }
        }
        
        function isPuzzleSolved() {
            return currentState.every((tile, index) => tile === solution[index]);
        }
        
        function onPuzzleSolved() {
            const puzzleContainer = document.getElementById('puzzleContainer');
            const puzzleGridWrap = document.getElementById('puzzleGridWrap');
            const puzzleRevealText = document.getElementById('puzzleRevealText');
            const puzzleFullImageOverlay = document.getElementById('puzzleFullImageOverlay');
            const emptyTile = puzzleGrid.querySelector('.puzzle-tile.empty');
            if (emptyTile) emptyTile.style.backgroundImage = "url('images/tile-3.png')";
            puzzleContainer.classList.add('completed');
            puzzleGrid.classList.add('merging');
            setTimeout(() => {
                puzzleFullImageOverlay.classList.add('show');
                setTimeout(() => {
                    puzzleGridWrap.classList.add('revealing');
                    puzzleRevealText.classList.add('show');
                }, 250);
            }, 280);
        }
        
        function createSparkles(x, y) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = x + (Math.random() - 0.5) * 50 + 'px';
                    sparkle.style.top = y + (Math.random() - 0.5) * 50 + 'px';
                    sparkle.style.background = ['#f093fb', '#f5576c', '#ffd700'][Math.floor(Math.random() * 3)];
                    document.body.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1000);
                }, i * 50);
            }
        }
        
        initPuzzle();
        
        const container = document.querySelector('.container');
        document.getElementById('yesBtn').addEventListener('click', () => {
            runConfettiFor(10000);
            container.classList.add('container--success');
            puzzleView.classList.remove('visible');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => successView.classList.add('visible'));
            });
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            window.location.reload();
        });
        
        function runConfettiFor(ms) {
            const end = Date.now() + ms;
            function tick() {
                if (Date.now() < end) {
                    createConfetti();
                    setTimeout(tick, 80);
                }
            }
            tick();
        }
        
        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.background = ['#f093fb', '#f5576c', '#ffd700', '#4facfe', '#FFDAE9'][Math.floor(Math.random() * 5)];
            const duration = 2 + Math.random() * 2;
            confetti.style.animation = `confetti-fall ${duration}s linear`;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), (duration + 0.5) * 1000);
        }