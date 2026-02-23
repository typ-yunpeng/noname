// Noname Game UI - 动态生成脚本

// 创建DOM元素的辅助函数
function createDiv(className, parent, content) {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    if (content) {
        div.innerHTML = content;
    }
    if (parent) {
        parent.appendChild(div);
    }
    return div;
}

// 创建卡牌元素
function createCard(name, suit, parent) {
    const card = createDiv('card', parent);
    createDiv('background', card, name);
    createDiv('name', card, name);
    createDiv('info', card, suit);
    return card;
}

// 创建玩家元素
function createPlayer(position, name, hp, maxHp, identityColor, identityText, avatarUrl, equips) {
    const player = createDiv('player', null);
    player.dataset.position = position;
    
    // 头像
    const avatar = createDiv('avatar', player);
    avatar.style.backgroundImage = `url('${avatarUrl}')`;
    
    // 血量
    const hpDiv = createDiv('hp', player);
    for (let i = 0; i < maxHp; i++) {
        const hpPoint = createDiv(i < hp ? '' : 'lost', hpDiv);
    }
    
    // 身份
    const identity = createDiv('identity', player);
    identity.dataset.color = identityColor;
    createDiv('', identity, identityText);
    
    // 名字
    createDiv('name', player, name);
    
    // 装备
    if (equips && equips.length > 0) {
        const equipsDiv = createDiv('equips', player);
        equips.forEach((equip, index) => {
            const equipCard = createDiv(`equip${index + 1} card`, equipsDiv);
            createDiv('background', equipCard, equip);
        });
    }
    
    // 判定区
    createDiv('judges', player);
    
    // 标记区
    createDiv('marks', player);
    
    return player;
}

// 创建手牌
function createHandCards(cards) {
    const handCardsDiv = createDiv('handcards', null);
    handCardsDiv.id = 'handcards1';
    
    cards.forEach(card => {
        createCard(card.name, card.suit, handCardsDiv);
    });
    
    return handCardsDiv;
}

// 初始化游戏界面
function initGame() {
    // 获取window元素
    const windowDiv = document.getElementById('window');
    
    // 创建系统栏
    const systemDiv = createDiv('', windowDiv);
    systemDiv.id = 'system';
    
    const systemInner = createDiv('', systemDiv);
    createDiv('menubutton', systemInner, '系统');
    createDiv('menubutton', systemInner, '设置');
    createDiv('menubutton', systemInner, '帮助');
    
    // 创建竞技场
    const arenaDiv = createDiv('', windowDiv);
    arenaDiv.id = 'arena';
    arenaDiv.dataset.number = '4';
    
    // 创建游戏日志
    const arenaLogDiv = createDiv('', arenaDiv);
    arenaLogDiv.id = 'arenalog';
    createDiv('', arenaLogDiv, '游戏开始');
    
    // 创建圆盘菜单
    const roundMenuDiv = createDiv('roundarenabutton menubutton round', arenaDiv);
    roundMenuDiv.id = 'roundmenu';
    for (let i = 0; i < 15; i++) {
        createDiv('', roundMenuDiv);
    }
    
    // 创建玩家1 (位置1)
    const player1 = createPlayer(
        '1',
        '刘备',
        2,
        4,
        'zhu',
        '主',
        'https://via.placeholder.com/130x160/4a90e2/ffffff?text=玩家1',
        ['青', '青', '青', '青']
    );
    arenaDiv.appendChild(player1);
    
    // 创建玩家2 (位置2)
    const player2 = createPlayer(
        '2',
        '曹操',
        3,
        4,
        'fan',
        '反',
        'https://via.placeholder.com/130x160/e74c3c/ffffff?text=玩家2',
        ['青', '青']
    );
    arenaDiv.appendChild(player2);
    
    // 创建玩家3 (位置3)
    const player3 = createPlayer(
        '3',
        '孙权',
        1,
        4,
        'zhong',
        '忠',
        'https://via.placeholder.com/130x160/2ecc71/ffffff?text=玩家3',
        ['青']
    );
    arenaDiv.appendChild(player3);
    
    // 创建自己 (位置0)
    const meDiv = createDiv('', arenaDiv);
    meDiv.id = 'me';
    
    const player0 = createPlayer(
        '0',
        '关羽',
        3,
        4,
        'zhu',
        '主',
        'https://via.placeholder.com/130x160/9b59b6/ffffff?text=我',
        ['青', '青', '青']
    );
    meDiv.appendChild(player0);
    
    // 创建手牌
    const handCards = [
        { name: '杀', suit: '♠' },
        { name: '闪', suit: '♥' },
        { name: '桃', suit: '♦' },
        { name: '杀', suit: '♣' },
        { name: '闪', suit: '♠' }
    ];
    const handCardsDiv = createHandCards(handCards);
    meDiv.appendChild(handCardsDiv);
    
    // 创建mebg
    createDiv('', arenaDiv, '').id = 'mebg';
    
    // 创建历史记录
    const historyBarDiv = createDiv('shadowed', windowDiv);
    historyBarDiv.id = 'historybar';
    
    const historyItem1 = createDiv('', historyBarDiv);
    const historyAvatar1 = createDiv('avatar', historyItem1);
    const historyAvatarBg1 = createDiv('avatarbg', historyAvatar1);
    historyAvatarBg1.style.backgroundImage = "url('https://via.placeholder.com/42x42/4a90e2/ffffff?text=刘')";
    createDiv('', historyAvatar1, '刘');
    
    const historyItem2 = createDiv('', historyBarDiv);
    createCard('杀', '', historyItem2);
    
    // 创建时间显示
    const timeDiv = createDiv('', windowDiv);
    timeDiv.id = 'time';
    createDiv('', timeDiv, '回合: 1');
    createDiv('', timeDiv, '时间: 00:00');
    
    // 添加交互事件
    addInteractions();
}

// 添加交互功能
function addInteractions() {
    // 玩家点击事件
    document.querySelectorAll('.player').forEach(player => {
        player.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // 卡牌点击事件
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('selected');
        });
    });
    
    // 系统按钮点击事件
    document.querySelectorAll('.menubutton').forEach(button => {
        button.addEventListener('click', function() {
            alert('点击了: ' + this.textContent);
        });
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 取消选择
            document.querySelectorAll('.selected').forEach(el => {
                el.classList.remove('selected');
            });
        }
    });
}

// 更新时间
function updateTime() {
    const timeDiv = document.getElementById('time');
    if (timeDiv) {
        const now = new Date();
        const minutes = Math.floor(now.getTime() / 60000);
        const seconds = now.getSeconds();
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeDiv.children[1].textContent = `时间: ${timeStr}`;
    }
}

// 添加日志
function addLog(message) {
    const arenaLogDiv = document.getElementById('arenalog');
    if (arenaLogDiv) {
        const logEntry = createDiv('', arenaLogDiv, message);
        logEntry.style.animation = 'game_start 0.5s';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // 每秒更新时间
    setInterval(updateTime, 1000);
    
    // 模拟游戏日志
    setTimeout(() => addLog('刘备 回合开始'), 2000);
    setTimeout(() => addLog('刘备 使用 杀'), 3000);
    setTimeout(() => addLog('曹操 受到 1 点伤害'), 4000);
});

// 导出函数供外部使用
window.gameUI = {
    init: initGame,
    addLog: addLog,
    createPlayer: createPlayer,
    createCard: createCard
};