        // ===== LEVEL CONFIGURATION =====
        const LEVEL_CONFIG = [
            { level: 1, time: 15, nodes: 5, decoys: 2, speed: 3000, name: 'Tutorial' },
            { level: 2, time: 12, nodes: 5, decoys: 3, speed: 2500, name: 'Apprentice' },
            { level: 3, time: 10, nodes: 5, decoys: 3, speed: 2000, name: 'Skilled' },
            { level: 4, time: 10, nodes: 6, decoys: 4, speed: 1800, name: 'Advanced' },
            { level: 5, time: 9, nodes: 6, decoys: 4, speed: 1500, name: 'Expert' },
            { level: 6, time: 8, nodes: 7, decoys: 5, speed: 1300, name: 'Master' },
            { level: 7, time: 8, nodes: 7, decoys: 6, speed: 1100, name: 'Elite' },
            { level: 8, time: 7, nodes: 8, decoys: 6, speed: 900, name: 'Legendary' },
            { level: 9, time: 6, nodes: 8, decoys: 7, speed: 700, name: 'Impossible' },
            { level: 10, time: 5, nodes: 10, decoys: 4, speed: 500, name: 'Godlike' }
        ];

        // ===== GAME STATE =====
        let gameTimer;
        let currentLevel = 1;
        let maxUnlockedLevel = 1;
        let completedLevels = new Set();
        let prestigeCount = 0;
        let totalCompletions = 0;
        let timeRemaining = 15;
        let nodesRemaining = 5;
        let nodeSpeed = 3000;
        let decoyCount = 2;

        // Load progress from localStorage
        function loadProgress() {
            const saved = localStorage.getItem('chocolateHeistProgress');
            if (saved) {
                const data = JSON.parse(saved);
                maxUnlockedLevel = data.maxUnlockedLevel || 1;
                completedLevels = new Set(data.completedLevels || []);
                currentLevel = data.currentLevel || 1;
                prestigeCount = data.prestigeCount || 0;
                totalCompletions = data.totalCompletions || 0;
            }
        }

        // Save progress to localStorage
        function saveProgress() {
            const data = {
                maxUnlockedLevel,
                completedLevels: Array.from(completedLevels),
                currentLevel,
                prestigeCount,
                totalCompletions
            };
            localStorage.setItem('chocolateHeistProgress', JSON.stringify(data));
        }

        // ===== DOM ELEMENTS =====
        const landingScreen = document.getElementById('landingScreen');
        const gameScreen = document.getElementById('gameScreen');
        const alarmScreen = document.getElementById('alarmScreen');
        const successScreen = document.getElementById('successScreen');
        const masterScreen = document.getElementById('masterScreen');
        const bypassButton = document.getElementById('bypassButton');
        const tryAgainButton = document.getElementById('tryAgainButton');
        const nextLevelButton = document.getElementById('nextLevelButton');
        const levelSelectButton = document.getElementById('levelSelectButton');
        const prestigeButton = document.getElementById('prestigeButton');
        const freePlayButton = document.getElementById('freePlayButton');
        const mainMenuButton = document.getElementById('mainMenuButton');
        const timerDisplay = document.getElementById('timer');
        const nodesDisplay = document.getElementById('nodesLeft');
        const gameLevelDisplay = document.getElementById('gameLevelDisplay');
        const currentLevelDisplay = document.getElementById('currentLevelDisplay');
        const levelProgressDisplay = document.getElementById('levelProgressDisplay');
        const completedLevelSpan = document.getElementById('completedLevel');
        const levelGrid = document.getElementById('levelGrid');
        const masterBadge = document.getElementById('masterBadge');
        const totalCompletionsSpan = document.getElementById('totalCompletions');
        const prestigeLevelSpan = document.getElementById('prestigeLevel');
        const instructionsButton = document.getElementById('instructionsButton');
        const instructionsModal = document.getElementById('instructionsModal');
        const closeInstructions = document.getElementById('closeInstructions');
        const startPlayingButton = document.getElementById('startPlayingButton');

        // ===== AUDIO PLACEHOLDERS =====
        function playSound(type) {
            console.log(`🔊 Sound: ${type}`);
            // Placeholder for actual audio integration
        }

        // ===== INITIALIZE LEVEL GRID =====
        function initializeLevelGrid() {
            levelGrid.innerHTML = '';
            LEVEL_CONFIG.forEach(config => {
                const btn = document.createElement('button');
                btn.className = 'level-button';
                btn.textContent = config.level;
                btn.dataset.level = config.level;
                
                if (config.level <= maxUnlockedLevel) {
                    btn.classList.add('unlocked');
                }
                
                if (completedLevels.has(config.level)) {
                    btn.classList.add('completed');
                }
                
                if (config.level === currentLevel) {
                    btn.classList.add('current');
                }
                
                if (config.level <= maxUnlockedLevel) {
                    btn.addEventListener('click', () => {
                        currentLevel = config.level;
                        updateLevelDisplay();
                        playSound('select');
                    });
                }
                
                levelGrid.appendChild(btn);
            });
        }

        // ===== UPDATE LEVEL DISPLAY =====
        function updateLevelDisplay() {
            currentLevelDisplay.textContent = currentLevel;
            levelProgressDisplay.textContent = `${completedLevels.size}/${LEVEL_CONFIG.length} COMPLETED`;
            
            // Show master badge if all levels completed
            if (completedLevels.size === LEVEL_CONFIG.length) {
                masterBadge.classList.remove('hidden');
            } else {
                masterBadge.classList.add('hidden');
            }
            
            initializeLevelGrid();
        }

        // ===== LOAD LEVEL SETTINGS =====
        function loadLevelSettings() {
            const config = LEVEL_CONFIG[currentLevel - 1];
            timeRemaining = config.time;
            nodesRemaining = config.nodes;
            nodeSpeed = config.speed;
            decoyCount = config.decoys;
        }

        // ===== START GAME =====
        bypassButton.addEventListener('click', () => {
            playSound('start');
            landingScreen.classList.add('hidden');
            gameScreen.style.display = 'block';
            loadLevelSettings();
            startGame();
        });

        function startGame() {
            gameLevelDisplay.textContent = currentLevel;
            timerDisplay.textContent = timeRemaining;
            nodesDisplay.textContent = nodesRemaining;
            
            // Create security nodes
            createNodes();
            
            // Create decoy nodes
            createDecoys();
            
            // Start timer
            let time = timeRemaining;
            gameTimer = setInterval(() => {
                time--;
                timerDisplay.textContent = time;
                
                if (time <= 3) {
                    timerDisplay.classList.add('timer-critical');
                    playSound('beep');
                }
                
                if (time <= 0) {
                    clearInterval(gameTimer);
                    triggerAlarm();
                }
            }, 1000);
        }

        // ===== CREATE SECURITY NODES =====
        function createNodes() {
            const config = LEVEL_CONFIG[currentLevel - 1];
            for (let i = 0; i < config.nodes; i++) {
                setTimeout(() => {
                    const node = document.createElement('div');
                    node.className = 'security-node';
                    node.innerHTML = '🔴';
                    
                    // Random position
                    const margin = 100;
                    node.style.left = Math.random() * (window.innerWidth - margin * 2) + margin + 'px';
                    node.style.top = Math.random() * (window.innerHeight - margin * 2) + margin + 'px';
                    
                    node.addEventListener('click', () => {
                        playSound('click');
                        node.remove();
                        nodesRemaining--;
                        nodesDisplay.textContent = nodesRemaining;
                        
                        if (nodesRemaining === 0) {
                            clearInterval(gameTimer);
                            heistSuccess();
                        }
                    });
                    
                    gameScreen.appendChild(node);
                    moveNode(node);
                }, i * 200);
            }
        }

        // ===== MOVE NODES =====
        function moveNode(node) {
            const moveInterval = setInterval(() => {
                if (!document.body.contains(node)) {
                    clearInterval(moveInterval);
                    return;
                }
                
                const margin = 100;
                const newX = Math.random() * (window.innerWidth - margin * 2) + margin;
                const newY = Math.random() * (window.innerHeight - margin * 2) + margin;
                
                node.style.transition = `all ${nodeSpeed / 1000}s ease`;
                node.style.left = newX + 'px';
                node.style.top = newY + 'px';
            }, nodeSpeed);
        }

        // ===== CREATE DECOY NODES =====
        function createDecoys() {
            for (let i = 0; i < decoyCount; i++) {
                setTimeout(() => {
                    const decoy = document.createElement('div');
                    decoy.className = 'decoy-node';
                    decoy.innerHTML = '🔵';
                    
                    // Random position
                    const margin = 100;
                    decoy.style.left = Math.random() * (window.innerWidth - margin * 2) + margin + 'px';
                    decoy.style.top = Math.random() * (window.innerHeight - margin * 2) + margin + 'px';
                    
                    decoy.addEventListener('click', () => {
                        playSound('alarm');
                        clearInterval(gameTimer);
                        triggerAlarm();
                    });
                    
                    gameScreen.appendChild(decoy);
                    moveNode(decoy);
                }, i * 300);
            }
        }

        // ===== TRIGGER ALARM =====
        function triggerAlarm() {
            playSound('alarm');
            gameScreen.style.display = 'none';
            alarmScreen.classList.add('show');
            
            // Clear all nodes
            document.querySelectorAll('.security-node, .decoy-node').forEach(n => n.remove());
        }

        // ===== HEIST SUCCESS =====
        function heistSuccess() {
            playSound('success');
            gameScreen.style.display = 'none';
            
            // Mark level as completed
            completedLevels.add(currentLevel);
            totalCompletions++;
            
            // Unlock next level if applicable
            if (currentLevel < LEVEL_CONFIG.length && maxUnlockedLevel === currentLevel) {
                maxUnlockedLevel = currentLevel + 1;
            }
            
            // Check if all levels completed for the first time in this run
            if (completedLevels.size === LEVEL_CONFIG.length && currentLevel === 10) {
                // Show master screen instead
                showMasterScreen();
            } else {
                // Show regular success screen
                successScreen.classList.add('show');
                
                // Update completion info
                completedLevelSpan.textContent = currentLevel;
                
                // Show/hide next level button
                if (currentLevel < LEVEL_CONFIG.length) {
                    nextLevelButton.style.display = 'inline-block';
                } else {
                    nextLevelButton.style.display = 'none';
                }
            }
            
            // Save progress
            saveProgress();
            
            // Clear all nodes
            document.querySelectorAll('.security-node, .decoy-node').forEach(n => n.remove());
        }

        // ===== SHOW MASTER SCREEN =====
        function showMasterScreen() {
            masterScreen.classList.add('show');
            totalCompletionsSpan.textContent = totalCompletions;
            prestigeLevelSpan.textContent = prestigeCount;
        }

        // ===== TRY AGAIN =====
        tryAgainButton.addEventListener('click', () => {
            alarmScreen.classList.remove('show');
            landingScreen.classList.remove('hidden');
            timerDisplay.classList.remove('timer-critical');
            updateLevelDisplay();
            playSound('select');
        });

        // ===== NEXT LEVEL =====
        nextLevelButton.addEventListener('click', () => {
            currentLevel++;
            successScreen.classList.remove('show');
            landingScreen.classList.remove('hidden');
            updateLevelDisplay();
            playSound('select');
        });

        // ===== LEVEL SELECT =====
        levelSelectButton.addEventListener('click', () => {
            successScreen.classList.remove('show');
            landingScreen.classList.remove('hidden');
            updateLevelDisplay();
            playSound('select');
        });

        // ===== PRESTIGE (NEW GAME+) =====
        prestigeButton.addEventListener('click', () => {
            if (confirm('Start New Game+? This will reset all level progress but increase your Prestige Level!')) {
                prestigeCount++;
                completedLevels.clear();
                maxUnlockedLevel = 1;
                currentLevel = 1;
                saveProgress();
                masterScreen.classList.remove('show');
                landingScreen.classList.remove('hidden');
                updateLevelDisplay();
                playSound('start');
            }
        });

        // ===== FREE PLAY MODE =====
        freePlayButton.addEventListener('click', () => {
            masterScreen.classList.remove('show');
            landingScreen.classList.remove('hidden');
            updateLevelDisplay();
            playSound('select');
        });

        // ===== MAIN MENU =====
        mainMenuButton.addEventListener('click', () => {
            masterScreen.classList.remove('show');
            landingScreen.classList.remove('hidden');
            updateLevelDisplay();
            playSound('select');
        });

        // ===== INSTRUCTIONS MODAL =====
        instructionsButton.addEventListener('click', () => {
            instructionsModal.classList.add('show');
            playSound('select');
        });

        closeInstructions.addEventListener('click', () => {
            instructionsModal.classList.remove('show');
            playSound('select');
        });

        startPlayingButton.addEventListener('click', () => {
            instructionsModal.classList.remove('show');
            playSound('select');
        });

        // Close modal when clicking outside
        instructionsModal.addEventListener('click', (e) => {
            if (e.target === instructionsModal) {
                instructionsModal.classList.remove('show');
                playSound('select');
            }
        });

        // ===== INITIALIZE =====
        loadProgress();
        updateLevelDisplay();

        console.log('🍫 The Chocolate Heist - Level System initialized!');
        console.log('🔊 Audio placeholders ready - add your sound files!');
        console.log(`📊 Progress: Level ${currentLevel}, ${completedLevels.size}/${LEVEL_CONFIG.length} completed`);
        console.log(`🏆 Prestige Level: ${prestigeCount}`);
