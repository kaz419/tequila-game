document.addEventListener('DOMContentLoaded', () => {
    // 画面要素
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');

    // セットアップ要素
    const nextButton = document.getElementById('next-button');
    const startGameButton = document.getElementById('start-game-button');
    const playerCountSection = document.getElementById('player-count-section');
    const playerNameSection = document.getElementById('player-name-section');
    const nameInputsDiv = document.getElementById('name-inputs');

    // 新しい要素の取得
    const playerCountDisplay = document.getElementById('player-count-display');
    const decreaseButton = document.getElementById('decrease-player-count');
    const increaseButton = document.getElementById('increase-player-count');

    // ゲーム要素
    const currentPlayerSpan = document.getElementById('current-player');
    const bellImage = document.getElementById('bell-image');
    const messageArea = document.getElementById('message-area');
    const resetGameButton = document.getElementById('reset-game-button');
    const bellSound = document.getElementById('bell-sound');
    const backToTopButton = document.getElementById('back-to-top');

    // ゲームの状態変数
    let playerCount = 2; // 初期値を2に設定
    let playerNames = [];
    let currentPlayerIndex = 0;
    let tapCount = 0; // ベルが鳴るまでのタップ回数ではなく、総タップ回数
    let isDouble = false;

    playerCountDisplay.textContent = playerCount; // 表示を更新

    // 「次へ」ボタンの処理
    nextButton.addEventListener('click', () => {
        if (playerCount < 2 || playerCount > 10) {
            alert('2人から10人の間で選んでください。');
            return;
        }

        generateNameInputs(playerCount);

        playerCountSection.style.display = 'none';
        playerNameSection.style.display = 'block';
    });

    // 人数増減ボタンの処理
    decreaseButton.addEventListener('click', () => {
        if (playerCount > 2) {
            playerCount--;
            playerCountDisplay.textContent = playerCount;
        }
    });

    increaseButton.addEventListener('click', () => {
        if (playerCount < 10) {
            playerCount++;
            playerCountDisplay.textContent = playerCount;
        }
    });

    // 名前入力欄を生成する関数
    const generateNameInputs = (count) => {
        nameInputsDiv.innerHTML = ''; // 既存の入力欄をクリア
        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.placeholder = `プレイヤー${i + 1}の名前`;
            input.value = `プレイヤー${i + 1}`; // デフォルト値を設定
            nameInputsDiv.appendChild(input);
        }
    };

    // 「ゲーム開始」ボタンの処理 (名前入力後)
    startGameButton.addEventListener('click', () => {
        playerNames = [];
        let allNamesEntered = true;
        for (let i = 0; i < playerCount; i++) {
            const nameInput = document.getElementById(`player-name-${i}`);
            if (nameInput && nameInput.value.trim() !== '') {
                playerNames.push(nameInput.value.trim());
            } else {
                allNamesEntered = false;
                break;
            }
        }

        if (!allNamesEntered) {
            alert('すべてのプレイヤー名を入力してください。');
            return;
        }

        setupGame();

        // 画面切り替え
        setupScreen.classList.remove('active');
        gameScreen.classList.add('active');
    });

    // ゲームのセットアップ
    const setupGame = () => {
        currentPlayerIndex = 0;
        tapCount = 0;
        messageArea.textContent = '';
        resetGameButton.style.display = 'none';
        bellImage.style.cursor = 'pointer';
        bellImage.classList.remove('shake'); // アニメーションをリセット

        // カスタマイズされたダブル発生確率を設定
        isDouble = Math.random() * 100 < parseInt(document.querySelector('input[name="doubleChance"]:checked').value);

        updateTurnInfo();
    };

    // ベルのタップ処理
    bellImage.addEventListener('click', () => {
        // ベルが鳴る確率に基づいて判定
        const bellRingProbability = parseInt(document.querySelector('input[name="bellProbability"]:checked').value);
        const shouldRing = Math.random() * 100 < bellRingProbability;

        if (shouldRing) {
            handleWin();
        } else {
            // 次のプレイヤーへ
            currentPlayerIndex = (currentPlayerIndex + 1) % playerCount;
            updateTurnInfo();
        }
    });

    // 当たった時の処理
    const handleWin = () => {
        try {
            bellSound.currentTime = 0;
            bellSound.play();
        } catch (error) {
            console.error("Failed to play sound:", error);
            // エラーが発生した場合でもゲームは続行
        }
        bellImage.classList.add('shake'); // ベルを揺らすアニメーションを追加

        let message = `${playerNames[currentPlayerIndex]}さん、テキーラ！`;

        if (isDouble) {
            message = `なんとダブル！ ${message}`;
            // 少し遅れて2回目のベル
            setTimeout(() => {
                try {
                    bellSound.currentTime = 0;
                    bellSound.play();
                } catch (error) {
                    console.error("Failed to play second sound:", error);
                }
            }, 300);
        }

        messageArea.textContent = message;
        bellImage.style.cursor = 'default';
        resetGameButton.style.display = 'block';
    };

    // ターン表示の更新
    const updateTurnInfo = () => {
        currentPlayerSpan.textContent = playerNames[currentPlayerIndex];
    };

    // リセットボタンの処理
    resetGameButton.addEventListener('click', setupGame);

    // TOPへ戻る処理
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault(); // リンクのデフォルト動作をキャンセル
        gameScreen.classList.remove('active');
        setupScreen.classList.add('active');
        playerCountSection.style.display = 'block'; // 人数選択画面を表示
        playerNameSection.style.display = 'none'; // 名前入力画面を非表示
    });
});