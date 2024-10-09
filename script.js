let player = {
  gold: 200,
  score: 0,
  exp: 0,
  totalExp: 0, // 累積経験値を追加
  expToNextLevel: 200,
  level: 1,
  round: 1,
  hp: 100,
  maxHp: 100,
  life: 1,
  maxLife:3,
  antibiotics: { 'アンピシリン': 10, 'セファゾリン': 10, 'メロペネム': 10, 'バンコマイシン': 10, 'アジスロマイシン': 10, 'シプロフロキサシン': 0  },
  vaccines: { 'PCV': 0, 'Hibワクチン': 0 },
  labtest: {'グラム染色': 5, '培養':5, '同定':5, '感受性':5, '尿中抗原':1,'geneCheck':1, 'geneQuick':0, 'TDM':0},
  smallHealing: 0,
  mediumHealing: 0,
  fullHealing: 0,
  awareUsage: { 'access': 0, 'watch': 0, 'reserve': 0 },
  dascScore: 0,
  attackCount: 0,
}

//検査の実施状況
let labotest = {
  gramStainCount: 1,
  cultureCount: 2, //0は未培養、1は培養中、2は培養済（ただし同定が必要）
  identifyCount: 1,
  susceptibilityCount: 1,
  geneCount: 0, //0は未検査、1は検査中、2は検査済
  urinaryAntigenCount: 0,
  TDM: 0
}

// 病原体のリスト
let bacteriaList = [
  { 
    name: 'MSSA', 
    hp: 50, 
    maxHp: 50,
    attackPower: { min: 15, max: 25 }, // MSSAの攻撃力を15〜25の範囲に       
    resistance: { 
      'アンピシリン': { effective: false, damage: [0, 0] }, 
      'セファゾリン': { effective: true, damage: [20, 30] }, 
      'メロペネム': { effective: true, damage: [15, 30] }, 
      'バンコマイシン': { effective: true, damage: [10, 15] }, 
      'アジスロマイシン': { effective: false, damage: [0, 0] }, 
      'シプロフロキサシン': { effective: false, damage: [0, 0] }  
    },
    susceptibilityState: 'ABPC:R, CEZ:S, MEPM:S, VCM:S',
    amrLevel:1,
    reward: { gold: 10, exp: 10, score: 20 },
    minLevel: 1, // MSSAはレベル1から出現
    imgSrc: 'img/pathogen3.png',
    gramStain: 'グラム陽性ブドウ状球菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramPositive.png'      
  },
  { 
    name: 'MRSA', 
    hp: 70, 
    maxHp: 70,
    attackPower: { min: 10, max: 15 }, //  
    resistance: { 
      'アンピシリン': { effective: false, damage: [0, 0] }, 
      'セファゾリン': { effective: false, damage: [0, 0] }, 
      'メロペネム': { effective: false, damage: [0, 0] }, 
      'バンコマイシン': { effective: true, damage: [10, 15] }, 
      'アジスロマイシン': { effective: false, damage: [0, 0] }, 
      'シプロフロキサシン': { effective: false, damage: [0, 0] } 
    },
    susceptibilityState: 'ABPC:R, CEZ:R, MEPM:R, VCM:S',
    amrLevel:2,
    reward: { gold: 20, exp: 20, score: 30 },
    minLevel: 3, // MRSAはレベル3から出現
    imgSrc: 'img/pathogen4.png',
    gramStain: 'グラム陽性ブドウ状球菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramPositive.png'
  },
  { 
    name: '大腸菌', 
    hp: 60, 
    maxHp: 60,
    attackPower: { min: 15, max: 25 }, //  
    resistance: { 
      'アンピシリン': { effective: true, damage: [20, 30] }, 
      'セファゾリン': { effective: true, damage: [20, 30] }, 
      'メロペネム': { effective: true, damage: [20, 40] }, 
      'バンコマイシン': { effective: false, damage: [0, 0] }, 
      'アジスロマイシン': { effective: false, damage: [0, 0] }, 
      'シプロフロキサシン': { effective: true, damage: [5, 10] } 
    },
    susceptibilityState: 'ABPC:S, CEZ:S, MEPM:S, CPFX:S',
    amrLevel:1,
    reward: { gold: 10, exp: 10, score: 20 },
    minLevel: 1,
    imgSrc: 'img/pathogen10.png',
    gramStain: 'グラム陰性桿菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramNegative.png' 
  },
  { 
    name: 'ESBL産生菌', 
    hp: 80, 
    maxHp: 80,
    attackPower: { min: 15, max: 25 }, //  
    resistance: { 
      'アンピシリン': { effective: false, damage: [0, 0] }, 
      'セファゾリン': { effective: false, damage: [0, 0] }, 
      'メロペネム': { effective: true, damage: [20, 30] }, 
      'バンコマイシン': { effective: false, damage: [0, 0] }, 
      'アジスロマイシン': { effective: false, damage: [0, 0] }, 
      'シプロフロキサシン': { effective: false, damage: [0, 0] } 
    },
    susceptibilityState: 'ABPC:R, CEZ:R, MEPM:S, CPFX:S',
    amrLevel:4,
    reward: { gold: 20, exp: 20, score: 40 },
    minLevel: 4, // MRSAはレベル4から出現
    imgSrc: 'img/pathogen11.png',
    gramStain: 'グラム陰性桿菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramNegative.png' 
  },
  { 
    name: 'マイコプラズマ', 
    hp: 40, 
    maxHp: 40,
    attackPower: { min: 10, max: 15 }, //  
    resistance: { 
      'アンピシリン': { effective: false, damage: [0, 0] }, 
      'セファゾリン': { effective: false, damage: [0, 0] }, 
      'メロペネム': { effective: false, damage: [0, 0] }, 
      'バンコマイシン': { effective: false, damage: [0, 0] }, 
      'アジスロマイシン': { effective: true, damage: [30, 40] }, 
      'シプロフロキサシン': { effective: true, damage: [20, 30] } 
    },
    susceptibilityState: 'AZM:S, CPFX:S',
    amrLevel:1,
    reward: { gold: 10, exp: 10, score: 20 },
    minLevel: 2, // マイコプラズマはレベル2から出現
    imgSrc: 'img/pathogen16.png',
    gramStain: 'グラム染色で不明な病原体',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramNo.png' 
  },
  { 
    name: '肺炎球菌', 
    hp: 30, 
    maxHp: 60,
    attackPower: { min: 30, max: 45 }, // 
    resistance: { 
      'アンピシリン': { effective: true, damage: [30, 40] }, 
      'セファゾリン': { effective: true, damage: [20, 40] }, 
      'メロペネム': { effective: true, damage: [30, 40] }, 
      'バンコマイシン': { effective: true, damage: [20, 30] }, 
      'アジスロマイシン': { effective: false, damage: [0, 0] }, 
      'シプロフロキサシン': { effective: false, damage: [0, 0] } 
    },
    susceptibilityState: 'ABPC:S, CEZ:S, MEPM:S, VCM:S, CPFX:R',
    amrLevel:1,
    reward: { gold: 30, exp: 20, score: 40 },
    minLevel: 1, // 肺炎球菌はレベル1から出現
    imgSrc: 'img/pathogen2.png',
    gramStain: 'グラム陽性双球菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramPositive.png' 
  },
  { 
    name: 'Hib', 
    hp: 30, 
    maxHp: 60,
    attackPower: { min: 40, max: 50 }, //  
    resistance: { 
      'アンピシリン': { effective: true, damage: [30, 40] }, 
      'セファゾリン': { effective: false, damage: [0, 0] }, 
      'メロペネム': { effective: true, damage: [30, 40] }, 
      'バンコマイシン': { effective: false, damage: [0, 0] }, 
      'アジスロマイシン': { effective: true, damage: [10, 15] }, 
      'シプロフロキサシン': { effective: true, damage: [20, 30] } 
    },
    susceptibilityState: 'ABPC:S, CEZ:R, MEPM:S, AZM:S, CPFX:S',
    amrLevel:1,
    reward: { gold: 40, exp: 40, score: 50 },
    minLevel: 1, // Hibはレベル1から出現
    imgSrc: 'img/pathogen19.png',
    gramStain: 'グラム陰性小桿菌',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramNegative.png' 
  },
  { 
    name: 'レジオネラ',
    hp: 90,
    maxHp: 90,
    attackPower: { min: 20, max: 30 }, // レジオネラの攻撃力
    resistance: { 
      'アンピシリン': { effective: false, damage: [0, 0] }, 
      'セファゾリン': { effective: false, damage: [0, 0] }, 
      'メロペネム': { effective: false, damage: [0, 0] }, 
      'バンコマイシン': { effective: false, damage: [0, 0] }, 
      'アジスロマイシン': { effective: true, damage: [20, 30] },
      'シプロフロキサシン': { effective: true, damage: [30, 50] } // シプロフロキサシンが最も有効
    },
    susceptibilityState: 'AZM:S, CPFX:S',
    amrLevel:1,
    reward: { gold: 80, exp: 80, score: 80 }, // 報酬の設定
    minLevel: 5, // レベル5から出現
    imgSrc: 'img/pathogen17.png', // レジオネラの画像（仮）
    gramStain: 'グラム染色で不明な病原体',  // グラム染色所見を追加
    gramStainImgSrc: 'img/gramNo.png' 
  }
];

// 不明な病原体の画像パスを定義
let unknownBacteriaImgSrc = 'img/pathogen_UN1.png';  // 不明な病原体の画像パス

// VCMの使用をセット
let vcmUsed = 0;

// スタート時のバトル設定
function startBattle() {
  document.getElementById('player-hp').textContent = player.hp;
  document.getElementById('remaining-gold').textContent = player.gold;
  document.getElementById('round').textContent = player.round;
  const availableBacteria = bacteriaList.filter(bacteria => player.level >= bacteria.minLevel);
  currentBacteria = availableBacteria[Math.floor(Math.random() * availableBacteria.length)];

  /* テスト用に大腸菌のみとする（無効）
  currentBacteria = bacteriaList.find(bacteria => bacteria.name === '大腸菌');
  */

  if (player.level >= 5) {
    if (currentBacteria.name === '大腸菌' || currentBacteria.name === 'ESBL産生菌') {
      let randomValue = Math.random();
      let bacteriaAdAmrLevel;
      if (randomValue < 0.6) {
        bacteriaAdAmrLevel = 0;  // 60% chance for 0
      } else if (randomValue < 0.9) {
        bacteriaAdAmrLevel = 1;  // 30% chance for 1 (from 0.6 to 0.9)
      } else {
        bacteriaAdAmrLevel = 2;  // 10% chance for 2 (from 0.9 to 1.0)
      }

      currentBacteria.amrLevel += bacteriaAdAmrLevel;
      updateResistanceForEColi(currentBacteria);
    }
  }

  player.attackCount = 0;  // 攻撃回数もリセット
  labotest.geneCount = 0; //遺伝子検査をリセット
  labotest.TDM = 0; //TDMをリセット
  document.getElementById('antigen').textContent = '尿中抗原：未';
  document.getElementById('geneIdentify').textContent  = '';

  // ここで病原体の状態をリセット
  if (player.level >= 8) {
    // レベル8以上ではグラム染色不明で未培養
    labotest.gramStainCount = 0;
    labotest.cultureCount = 0;
    labotest.identifyCount = 0;
    labotest.susceptibilityCount = 0;    
    document.getElementById('enemy-name').textContent = '不明な病原体';
    document.getElementById('bacteria-image').src = unknownBacteriaImgSrc;  // 不明な病原体の画像を設定 
    document.getElementById('message-box1').textContent = '不明な病原体が現れた！';
    document.getElementById('susceptibility').textContent = '';
    alert('培養検査を実施して下さい。');
  }
  else if (player.level >= 6) {
    // レベル6以上ではグラム染色不明で培養中
    labotest.gramStainCount = 0;
    labotest.cultureCount = 1;
    labotest.identifyCount = 0;
    labotest.susceptibilityCount = 0;    
    document.getElementById('enemy-name').textContent = '不明な病原体';
    document.getElementById('bacteria-image').src = unknownBacteriaImgSrc;  // 不明な病原体の画像を設定 
    document.getElementById('message-box1').textContent = '不明な病原体が現れた！';
    document.getElementById('susceptibility').textContent = '';
    alert('培養結果がわかるまで経験的治療を行ってください。');
  } else if (player.level >= 4) {
    // レベル4ではグラム染色判明で培養中
    labotest.gramStainCount = 1;
    labotest.cultureCount = 1;
    labotest.identifyCount = 0;
    labotest.susceptibilityCount = 0;
    document.getElementById('enemy-name').textContent = currentBacteria.gramStain;
    document.getElementById('message-box1').textContent = `${currentBacteria.gramStain} が現れた！`;
    document.getElementById('bacteria-image').src = currentBacteria.gramStainImgSrc;
    document.getElementById('susceptibility').textContent = '';
  } 
  else {
    // レベル1の場合はすぐに敵の名前と画像を表示
    document.getElementById('enemy-name').textContent = currentBacteria.name;
    document.getElementById('bacteria-image').src = currentBacteria.imgSrc;
    document.getElementById('message-box1').textContent = `${currentBacteria.name} が現れた！`;
    document.getElementById('geneIdentify').textContent = '';
    document.getElementById('susceptibility').textContent = currentBacteria.susceptibilityState;
  }



  // 敵のHPと報酬を調整
  adjustEnemyHpAndReward(currentBacteria);

  // 画面の表示を更新
  document.getElementById('enemy-hp').textContent = `敵のHP: ${Math.round(currentBacteria.hp)}`;
  updateGauge(currentBacteria.hp, currentBacteria.maxHp);  // ゲージをリセット
  document.getElementById('message-box2').textContent = '攻撃を選択してください。';

  console.log('バトルが開始されました。');
}

// ライフの表示を更新する関数
function updateLifeDisplay() {
  const lifeDisplay = document.getElementById('life-display');
  lifeDisplay.innerHTML = '';  // 現在のライフ表示をクリア
  
  // 現在のライフの数だけ♡を表示
  for (let i = 0; i < player.life; i++) {
    const heart = document.createElement('span');
    heart.textContent = '❤️';  // 赤いハート
    lifeDisplay.appendChild(heart);
  }
}

// HPが0になった場合の処理
function checkPlayerHp() {
  if (player.hp <= 0) {
    player.life -= 1;  // ライフを1つ減らす

    if (player.life > 0) {
      player.hp = player.maxHp;  // ライフが残っている場合はHPを全回復
      alert('ライフを1つ失いました！HPが全回復しました！');
      updateLifeDisplay();  // ライフ表示を更新
      updatePlayerGauge(player.hp, player.maxHp);  // HPゲージを更新
    } else {
      // ライフが0になったらゲームオーバー
      alert('ゲームオーバーです！');
      disableAllButtons();
      setTimeout(() => location.reload(), 5000);  // ゲームリスタート
    }
  }
}





  // 最小値と最大値の範囲でランダムな値を生成する関数
  function getRandomAttackPower(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ここにワクチン効果ターン数を追跡する変数を宣言
  let hibVaccineEffectTurns = 0; // Hibワクチンの効果ターン数
  let pcvVaccineEffectTurns = 0; // PCVワクチンの効果ターン数

  function showBacteriaImage(bacteria) {
    const imgElement = document.getElementById('bacteria-image');
    imgElement.src = bacteria.imgSrc; // 参照された画像パスを設定
    imgElement.alt = bacteria.name; // alt属性に敵の名前を設定
  }  
  
  let currentBacteria = {
    name: '',
    gramStain: '',
    imgSrc: '',
    gramStainImgSrc: '',
  };
  let battleHistory = []; // バトル履歴を保存するための配列
  
// レベルアップの処理
function checkLevelUp() {
  if (player.exp >= player.expToNextLevel) {
      player.level += 1;
      player.expToNextLevel += 200;  // 次のレベルまでの経験値を増加

        // レベルアップボーナスの計算と追加
        const levelUpBonus = player.level * 10;  // レベル*10のボーナス
        player.gold += levelUpBonus;  // 小遣いにボーナスを追加
        alert(`レベルアップボーナス ${levelUpBonus} ゴールドを受け取りました！`);  // ボーナスをアラートで表示

      // レベルに応じたHP増加処理
      let hpDifference = 20;  // 20ずつ増加
      if (player.level >= 20) {
          hpDifference = 0;  // レベル20以上はHP増加なし
      } else if (player.level >= 10) {
          hpDifference = 10;  // レベル10以上では10ずつ増加
      }
      player.maxHp += hpDifference;
      console.log(`レベルアップ！ 現在のレベル: ${player.level}, 最大HP: ${player.maxHp}, 現在HP: ${player.hp}`);

      // レベルに応じた最大ライフの設定
      if (player.level >= 10) {
          player.maxLife = 5;  // レベル10以上で最大ライフを5に設定
      } else if (player.level >= 5) {
          player.maxLife = 4;  // レベル5〜9では最大ライフを4に設定
      }

      // ライフを増加させる処理
      if (player.level >= 2 && player.life < player.maxLife) {
          player.life += 1;  // ライフを1つ増やす
          alert('ライフが1つ増えました！');
          updateLifeDisplay();  // ライフ表示を更新
      }

      // プレイヤーのステータス表示を更新
      updatePlayerStats();  // レベル表示の更新など
  }
}


  
  // 購入履歴の初期化
  let purchaseHistory = [];
  
  // 購入履歴を記録する関数
  function logPurchase(description) {
    purchaseHistory.push(description);
  }
  
// 抗菌薬の残量を表示する関数
function updateAntibioticAndItemStatus() {
  const antibioticStatus = document.getElementById('antibiotic-status');
  antibioticStatus.innerHTML = `抗菌薬の残り: アンピシリン(${player.antibiotics['アンピシリン']}), セファゾリン(${player.antibiotics['セファゾリン']}), メロペネム(${player.antibiotics['メロペネム']}), バンコマイシン(${player.antibiotics['バンコマイシン']}), アジスロマイシン(${player.antibiotics['アジスロマイシン']}), シプロフロキサシン(${player.antibiotics['シプロフロキサシン']})`;

  const itemStatus = document.getElementById('item-status');
  itemStatus.innerHTML = `アイテムの残り: PCV(${player.vaccines['PCV']}), Hibワクチン(${player.vaccines['Hibワクチン']}), 小治の薬(${player.smallHealing}), 中治の薬(${player.mediumHealing}), 完治の薬(${player.fullHealing}), グラム染色(${player.labtest['グラム染色']}), 培養(${player.labtest['培養']}), 同定(${player.labtest['同定']}), 感受性(${player.labtest['感受性']}), 尿中抗原(${player.labtest['尿中抗原']}), geneCheck(${player.labtest['geneCheck']}), geneQuick(${player.labtest['geneQuick']}), TDM(${player.labtest['TDM']})`;
}
  
  // 購入履歴を更新して画面に表示する関数（お小遣いの残りも追加）
  function updatePurchaseHistory() {
    const historyList = document.getElementById('purchase-history');
    historyList.innerHTML = '';  // 現在の履歴をクリア
  
    purchaseHistory.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      historyList.appendChild(li);  // 履歴リストに新しい項目を追加
    });
  
    // お小遣いの残りを表示
    document.getElementById('remaining-gold').textContent = player.gold;
  
    // 抗菌薬とアイテムの残りを画面に表示
    updateAntibioticAndItemStatus();
  }
  
// アイテムを購入する関数
function buyItem(item) {
  // 抗菌薬セット10を購入
  if (item === '抗菌薬セット10' && player.gold >= 250) {
      // すべての抗菌薬を10ずつ増やす
      player.antibiotics['アンピシリン'] += 10;
      player.antibiotics['セファゾリン'] += 10;
      player.antibiotics['メロペネム'] += 10;
      player.antibiotics['バンコマイシン'] += 10;
      player.antibiotics['アジスロマイシン'] += 10;
      player.antibiotics['シプロフロキサシン'] += 10; // シプロフロキサシンも追加
      player.gold -= 250;  // セットの価格
      logPurchase('抗菌薬セット10を購入');
  }
  // 各抗菌薬を個別に購入
  else if (item === '抗菌薬各10') {
      const selectedAntibiotic = document.getElementById('single-antibiotic').value;  // 選ばれた抗菌薬を取得
      if (selectedAntibiotic === 'アンピシリン' && player.gold >= 50) {
          player.antibiotics['アンピシリン'] += 10;
          player.gold -= 50;  // アンピシリンの価格
          logPurchase('アンピシリンを10個購入');
      } else if (selectedAntibiotic === 'セファゾリン' && player.gold >= 30) {
          player.antibiotics['セファゾリン'] += 10;
          player.gold -= 30;  // セファゾリンの価格
          logPurchase('セファゾリンを10個購入');
      } else if (selectedAntibiotic === 'メロペネム' && player.gold >= 120) {
          player.antibiotics['メロペネム'] += 10;
          player.gold -= 120;  // メロペネムの価格
          logPurchase('メロペネムを10個購入');
      } else if (selectedAntibiotic === 'バンコマイシン' && player.gold >= 50) {
          player.antibiotics['バンコマイシン'] += 10;
          player.gold -= 50;  // バンコマイシンの価格
          logPurchase('バンコマイシンを10個購入');
      } else if (selectedAntibiotic === 'アジスロマイシン' && player.gold >= 60) {
          player.antibiotics['アジスロマイシン'] += 10;
          player.gold -= 60;  // アジスロマイシンの価格
          logPurchase('アジスロマイシンを10個購入');
      } else if (selectedAntibiotic === 'シプロフロキサシン' && player.gold >= 90) {
          player.antibiotics['シプロフロキサシン'] += 10;
          player.gold -= 90;  // シプロフロキサシンの価格
          logPurchase('シプロフロキサシンを10個購入');
      } else {
          alert('お小遣いが足りません！');
      }
  }
  // ワクチンを購入
  else if (item === 'PCV' && player.gold >= 100) {
      player.vaccines['PCV'] += 1;  // PCVを1つ増やす
      player.gold -= 100;
      logPurchase('PCVを購入');
  }
  else if (item === 'Hibワクチン' && player.gold >= 100) {
      player.vaccines['Hibワクチン'] += 1;  // Hibワクチンを1つ増やす
      player.gold -= 100;
      logPurchase('Hibワクチンを購入');
  }
  // 回復の薬を購入
  else if (item === '小治の薬' && player.gold >= 20) {
      player.smallHealing += 1;  // 小治の薬を1つ増やす
      player.gold -= 20;
      logPurchase('小治の薬を購入');
  } 
  else if (item === '中治の薬' && player.gold >= 30) {
      player.mediumHealing += 1;  // 中治の薬を1つ増やす
      player.gold -= 30;
      logPurchase('中治の薬を購入');
  } 
  else if (item === '完治の薬' && player.gold >= 50) {
      player.fullHealing += 1;  // 完治の薬を1つ増やす
      player.gold -= 50;
      logPurchase('完治の薬を購入');
  }
  // 検査アイテムを購入
  else if (item === 'グラム染色' && player.gold >= 100) {
      player.labtest['グラム染色'] += 5;  // グラム染色を5つ増やす
      player.gold -= 100;
      logPurchase('グラム染色を購入');
  }
  else if (item === '培養' && player.gold >= 100) {
    player.labtest['培養'] += 5;
    player.gold -= 100;
    logPurchase('培養を購入');
  } 
  else if (item === '同定' && player.gold >= 100) {
    player.labtest['同定'] += 5;
    player.gold -= 100;
    logPurchase('同定を購入');
  } 
  else if (item === '感受性' && player.gold >= 100) {
    player.labtest['感受性'] += 5;
    player.gold -= 100;
    logPurchase('感受性を購入');
  }
  else if (item === '尿中抗原' && player.gold >= 500) {
    player.labtest['尿中抗原'] += 2;
    player.gold -= 500;
    logPurchase('尿中抗原を購入');
  }  
  else if (item === 'geneCheck' && player.gold >= 1000) {
    player.labtest['geneCheck'] += 1;
    player.gold -= 1000;
    logPurchase('geneCheckを購入');
  }  
  else if (item === 'geneQuick' && player.gold >= 1500) {
    player.labtest['geneQuick'] += 1;
    player.gold -= 1500;
    logPurchase('geneQuickを購入');
  }
  else if (item === 'TDM' && player.gold >= 500) {
    player.labtest['TDM'] += 1;
    player.gold -= 500;
    logPurchase('TDMを購入');
  }     
  // 購入に失敗した場合の処理
  else {
      alert('お小遣いが足りません！');
  }

  // 購入履歴とプレイヤーステータスを更新
  updatePurchaseHistory();  // 購入履歴を更新
  updatePlayerStats();      // プレイヤーのステータスを更新
  console.log("現在のゴールド: " + player.gold); // プレイヤーのゴールドを表示
}
  
// プレイヤーのステータスを更新する関数
function updatePlayerStats() {
  document.getElementById('gold').textContent = player.gold;
  document.getElementById('score').textContent = player.score;
  document.getElementById('exp').textContent = player.exp; // 累積経験値を表示
  document.getElementById('player-level').textContent = player.level; // レベル表示の更新
  document.getElementById('round').textContent = player.round; //ラウンド表示の更新
}

// 平均DASCを計算する関数
function calculateAverageDASC() {
  const totalAntibioticUse = player.awareUsage.access + player.awareUsage.watch + player.awareUsage.reserve;

  if (totalAntibioticUse === 0) {
      return 0;  // 使用していない場合は平均は0
  }

  return (player.dascScore / totalAntibioticUse).toFixed(2);  // 平均DASCを計算
}

function updateAwareAndDasc() {
  const totalAntibioticUse = player.awareUsage.access + player.awareUsage.watch + player.awareUsage.reserve;

  // 分母（抗菌薬の総使用回数）が0の場合を防ぐ
  if (totalAntibioticUse === 0) {
    document.getElementById('aware-usage').textContent = '使用なし';
    document.getElementById('access-fill').style.width = '0%';
    document.getElementById('watch-fill').style.width = '0%';
    document.getElementById('reserve-fill').style.width = '0%';
    return;
  }

  // 各分類の割合を計算
  const accessPercentage = (player.awareUsage.access / totalAntibioticUse) * 100;
  const watchPercentage = (player.awareUsage.watch / totalAntibioticUse) * 100;
  const reservePercentage = (player.awareUsage.reserve / totalAntibioticUse) * 100;

  // 使用回数の表示
  document.getElementById('aware-usage').textContent =
    `Access: ${player.awareUsage.access} (${accessPercentage.toFixed(2)}%) | ` +
    `Watch: ${player.awareUsage.watch} (${watchPercentage.toFixed(2)}%) | ` +
    `Reserve: ${player.awareUsage.reserve} (${reservePercentage.toFixed(2)}%)`;

  // 各分類の比率をゲージに反映
  document.getElementById('access-fill').style.width = `${accessPercentage}%`;
  document.getElementById('watch-fill').style.width = `${watchPercentage}%`;
  document.getElementById('reserve-fill').style.width = `${reservePercentage}%`;

  // DASCスコアの表示を更新
  const averageDasc = calculateAverageDASC();  // 平均DASCを計算
  document.getElementById('dasc-summary').textContent = `DASC: ${player.dascScore} (平均DASC: ${averageDasc})`;
}

function healEnemyBasedOnItem(item) {
  let healPercentage;

  // 薬の種類に応じて回復量を設定
  if (item === '小治の薬') {
      healPercentage = 0.2; // 20%回復
  } else if (item === '中治の薬') {
      healPercentage = 0.5; // 50%回復
  } else if (item === '完治の薬') {
      healPercentage = 0.9; // 90%回復
  } else {
      return; // 他の薬の場合は何もしない
  }

  // 回復量を計算し、敵のHPに反映
  let healAmount = Math.floor(currentBacteria.maxHp * healPercentage * Math.random());
  currentBacteria.hp += healAmount;
  if (currentBacteria.hp > currentBacteria.maxHp) {
      currentBacteria.hp = currentBacteria.maxHp; // HPが最大値を超えないように
  }

  // 敵HPの表示を更新
  document.getElementById('enemy-hp').textContent = `敵のHP: ${currentBacteria.hp}`;
  updateGauge(currentBacteria.hp, currentBacteria.maxHp); // 敵HPゲージを更新

  // 回復メッセージを表示
  alert(`敵 も ${healAmount} 回復した！`);
}

// ワクチンや回復の薬を使用する関数
function useItem(item) {
  if (item === '小治の薬' && player.smallHealing > 0) {
      player.smallHealing -= 1;
      player.hp += 50; 
      if (player.hp > player.maxHp) player.hp = player.maxHp;
      document.getElementById('player-hp').textContent = player.hp;
      updatePlayerGauge(player.hp, player.maxHp);
      alert('小治の薬を使用しました！');
      healEnemyBasedOnItem(item);
  } else if (item === '中治の薬' && player.mediumHealing > 0) {
      player.mediumHealing -= 1;
      player.hp += 100; 
      if (player.hp > player.maxHp) player.hp = player.maxHp;
      document.getElementById('player-hp').textContent = player.hp;
      updatePlayerGauge(player.hp, player.maxHp);
      alert('中治の薬を使用しました！');
      healEnemyBasedOnItem(item);
  } else if (item === '完治の薬' && player.fullHealing > 0) {
      player.fullHealing -= 1;
      player.hp = player.maxHp; 
      document.getElementById('player-hp').textContent = player.hp;
      updatePlayerGauge(player.hp, player.maxHp);
      alert('完治の薬を使用しました！');
      healEnemyBasedOnItem(item);
  } else if (item === 'Hibワクチン' && player.vaccines['Hibワクチン'] > 0) {
      if (hibVaccineEffectTurns > 0) {
          alert('Hibワクチンの効果がまだ残っています！');
      } else {
          player.vaccines['Hibワクチン'] -= 1;
          hibVaccineEffectTurns = 5;
          alert('Hibワクチンを使用しました！Hibによる5回の攻撃が無効になります。');
      }
  } else if (item === 'PCV' && player.vaccines['PCV'] > 0) {
      if (pcvVaccineEffectTurns > 0) {
          alert('PCVワクチンの効果がまだ残っています！');
      } else {
          player.vaccines['PCV'] -= 1;
          pcvVaccineEffectTurns = 5;
          alert('PCVワクチンを使用しました！肺炎球菌による5回の攻撃が無効になります。');
      }
  } else if (item === 'グラム染色' && player.labtest['グラム染色'] > 0) {
    // 敵が判明していない場合のみグラム染色を使用可能にする
    if (labotest.identifyCount === 1) {
      alert('この病原体は既に判明しています。グラム染色は必要ありません！')
    }
    else if (labotest.gramStainCount === 0) {
      labotest.gramStainCount = 1;
      player.labtest['グラム染色'] -= 1; // グラム染色を1つ減らす
      alert(`グラム染色所見: ${currentBacteria.gramStain}`);      
      // 敵のグラム染色所見を表示
      document.getElementById('enemy-name').textContent = currentBacteria.gramStain;
      document.getElementById('message-box1').textContent = currentBacteria.gramStain;
      document.getElementById('bacteria-image').src = currentBacteria.gramStainImgSrc;
    } else {
      alert('この病原体のグラム染色は既に判明しています。グラム染色は必要ありません！')
    }
  } else if (item === '培養' &&  player.labtest['培養'] > 0) {
    if(labotest.cultureCount === 0) {
      labotest.cultureCount = 1;
      player.labtest['培養'] -= 1;
      alert('培養を実施しました。結果がわかるまで経験的治療をしてください。');      
    }else if(labotest.identifyCount === 1){
      alert('この病原体は既に判明しています。培養は必要ありません！');
    }else if(labotest.cultureCount === 2){
      alert('培養終了しています。同定を実施してください！');
    }else{
      alert('培養中です。培養は必要ありません！');
    }
  } else if (item === '同定' &&  player.labtest['同定'] > 0) {
    if(labotest.identifyCount === 0 && labotest.cultureCount === 2) {
      alert('同定を実施しました');         
      labotest.identifyCount = 1;
      player.labtest['同定'] -= 1;
      document.getElementById('enemy-name').textContent = currentBacteria.name;
      document.getElementById('message-box1').textContent = currentBacteria.name + 'と判明しました';
      document.getElementById('bacteria-image').src = currentBacteria.imgSrc;
    }  
    else if(labotest.cultureCount === 1) {
      alert('培養中です。同定はまだできません！');      
    }
    else if(labotest.identifyCount === 1){
      alert('この病原体は既に判明しています。同定は必要ありません！');
    }
    else{
      alert('培養結果がわかるまで同定検査はできません！');
    }
  } else if (item === '感受性' &&  player.labtest['感受性'] > 0) {
    if(labotest.identifyCount === 1 && labotest.susceptibilityCount === 0) {
      labotest.susceptibilityCount = 1;
      player.labtest['感受性'] -= 1;
      alert('感受性を実施しました');
      alert(currentBacteria.susceptibilityState);
      document.getElementById('susceptibility').textContent = currentBacteria.susceptibilityState;
    }else if (labotest.susceptibilityCount === 1) {
      alert('すでに感受性は判明しています。検査の必要はありません');  
    }else if (labotest.cultureCount === 1) {
      alert('培養中です。感受性検査はまだできません！');
    }else{
      alert('感受性検査はまだできません。培養・同定を先に行ってください！');
    }
  } else if (item === '尿中抗原' &&  player.labtest['尿中抗原'] > 0) {
    labotest.urinaryAntigenCount = 1;
    player.labtest['尿中抗原'] -= 1;
    alert('尿中抗原検査を実施しました');  
    if(currentBacteria.name === '肺炎球菌' || currentBacteria.name === 'レジオネラ'){
      alert(currentBacteria.name +'が検出されました');
      document.getElementById('antigen').textContent = '尿中抗原：'+currentBacteria.name;        
    } else {
      alert('尿中抗原は陰性でした');
      document.getElementById('antigen').textContent = '尿中抗原：陰性';
    };
  } else if (item === 'geneCheck' &&  player.labtest['geneCheck'] > 0) {
    if(labotest.geneCount === 0) {
      labotest.geneCount = 1;
      player.labtest['geneCheck'] -= 1;
      alert('geneCheckを実施しました。結果判明まで時間がかかります。');  
    }else{
      alert('geneCheckは実施できません！');
    }
  } else if (item === 'geneQuick' &&  player.labtest['geneQuick'] > 0) {
    if(labotest.geneCount === 0) {
      labotest.geneCount = 2;
      player.labtest['geneQuick'] -= 1;
      alert('geneQuickを実施しました');
      alert(currentBacteria.name+'が検出されました')
      document.getElementById('geneIdentify').textContent = '遺伝子検査: '+currentBacteria.name;  
    }else{
      alert('geneQuickは実施できません！');
    }
  } else if(item === 'TDM' &&  player.labtest['TDM'] > 0) {
      if(labotest.TDM === 1){
        alert('すでにTDMを実施済みです');
      } else {
        labotest.TDM = 1;
        player.labtest['TDM'] -= 1;
        alert('TDMを実施しました');
        if(vcmUsed >=2){
          alert('VCMの濃度は正常範囲です');
          if((currentBacteria.name === 'MSSA' && labotest.identifyCount ===0) || currentBacteria.name === 'MRSA'){
            const tdmBonus = 1000;
            player.gold += tdmBonus;  // 小遣いにボーナスを追加
            alert(`TDM特別ボーナス ${tdmBonus} ゴールドを受け取りました！`);
            document.getElementById('remaining-gold').textContent = player.gold;
            document.getElementById('gold').textContent = player.gold;
          } else {
            alert('VCMとTDMの適応を確認してください');
          }
        } else {
          alert('VCMの濃度は低値です。VCM使用2回目以降に再度実施してください。');
          labotest.TDM = 0;
        }
      }
  } else {
      alert('使用できるアイテムがありません！');
  }
  updateAntibioticAndItemStatus();  
}
  
// 敵HPゲージの更新関数
function updateGauge(currentHp, maxHp) {
  const gaugeFill = document.querySelector('#enemy-hp-gauge .gauge-fill');
  const percentage = (currentHp / maxHp) * 100;
  gaugeFill.style.width = `${percentage}%`;  // 割合に基づいてゲージの幅を設定
  gaugeFill.style.backgroundColor = '#ff4c4c'; // 塗りつぶしの色が見えるように設定
}
  
  // プレイヤーHPゲージの更新関数
  function updatePlayerGauge(currentHp, maxHp) {
    const gaugeFill = document.querySelector('#player-hp-gauge .gauge-fill');
    const percentage = (currentHp / maxHp) * 100;
    gaugeFill.style.width = `${percentage}%`;
  }
  
// 敵の攻撃でプレイヤーのHPを減らす
function enemyAttack() {
  let damage = getRandomAttackPower(currentBacteria.attackPower.min, currentBacteria.attackPower.max); // ランダムな攻撃力を決定

  // Hibが攻撃し、ワクチン効果が残っている場合、ダメージを無効化
  if (currentBacteria.name === 'Hib' && hibVaccineEffectTurns > 0) {
    damage = 0; // ダメージを0に設定
    hibVaccineEffectTurns--; // Hibワクチンの効果ターンを減らす
    alert('Hibの攻撃はワクチンによって無効化された！');
    
    if (hibVaccineEffectTurns === 0) {
      alert('Hibワクチンの効果が切れました！');
    }
  }

  // 肺炎球菌が攻撃し、PCVワクチン効果が残っている場合、ダメージを無効化
  if (currentBacteria.name === '肺炎球菌' && pcvVaccineEffectTurns > 0) {
    damage = 0; // ダメージを0に設定
    pcvVaccineEffectTurns--; // PCVワクチンの効果ターンを減らす
    alert('肺炎球菌の攻撃はPCVワクチンによって無効化された！');
    
    if (pcvVaccineEffectTurns === 0) {
      alert('PCVワクチンの効果が切れました！');
    }
  }

  // プレイヤーのHPを減らす
  player.hp -= damage;
  if (player.hp <= 0) player.hp = 0;  // HPが0未満にならないようにする

  // プレイヤーのHPゲージを更新
  document.getElementById('player-hp').textContent = player.hp;
  updatePlayerGauge(player.hp, player.maxHp);

  // HPが0になったかどうかをチェックして、ライフを減らす処理を追加
  checkPlayerHp();
}
  
  // 全てのボタンを無効化する関数
  function disableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
    });
  }
  

  
  // バトル履歴を更新する関数
  function updateBattleHistory(bacteriaName, antibioticUsed, damage) {
    // バトル履歴を追加
    battleHistory.push({
      level: player.level,
      round: player.round,
      enemy: bacteriaName,  // 不明な場合には「不明な病原体」が入る
      antibiotic: antibioticUsed,
      damage: damage
    });
  
    // テーブルの行を作成して履歴を表示する
    const historyList = document.getElementById('battle-history');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${player.level}</td>
      <td>${player.round}</td>
      <td>${bacteriaName}</td>
      <td>${antibioticUsed}</td>
      <td>${damage}</td>
    `;
    historyList.appendChild(newRow); // 新しい行をテーブルに追加
  }  
  
  // 敵HPと報酬の調整を関数化する
function adjustEnemyHpAndReward(bacteria) {
  // HPを10ずつ増やすが、200を超えないようにする
  bacteria.maxHp = Math.min(200, bacteria.maxHp + 10);
  bacteria.hp = bacteria.maxHp;  // 現在のHPも最大HPに合わせる

  // HPに応じて報酬を調整する (HPの10%を報酬に反映するなど)
  bacteria.reward.gold += calculateRewardBasedOnHp(bacteria.maxHp, 0.2);  // 最大HPの20%がゴールドになる
  bacteria.reward.exp += calculateRewardBasedOnHp(bacteria.maxHp, 0.5);   // 最大HPの50%が経験値になる
  bacteria.reward.score += calculateRewardBasedOnHp(bacteria.maxHp, 1);    // 最大HPと同じスコア
}

let roundInProgress = false; // ラウンド進行中かどうかを追跡するフラグ

// バトルに勝利した際の処理
function battleWin() {
  if (currentBacteria.hp > 0) return; // 敵がまだ倒されていない場合、処理を中断

  document.getElementById('message-box1').textContent = `敵を倒しました！`;

  const goldReward = currentBacteria.reward.gold;
  const expReward = currentBacteria.reward.exp;
  const scoreReward = currentBacteria.reward.score;

  player.gold += Math.round(goldReward);
  player.score += Math.round(scoreReward);
  player.exp += Math.round(expReward);

  // フラグを設定して次のラウンドの進行を防止
  roundInProgress = true;

  // スコア、経験値、ゴールドのアラートを1秒ずつ表示
  showAlertWithDelay(`スコアが${scoreReward}増えました！`, 1000, () => {
    showAlertWithDelay(`経験値を${expReward}受け取りました！`, 1000, () => {
        showAlertWithDelay(`お小遣いを${goldReward}受け取りました！`, 1000, () => {
            // レベルアップを確認
            checkLevelUp(); // ここでレベルアップが正しく呼び出される

            // スコア、経験値、ゴールド表示を更新
            updatePlayerStats();

            // 購入画面のお小遣い残りを更新
            updatePurchaseHistory();  // 追加

            console.log('次の敵が表示されるまで2秒待ちます。');

            // 次の敵を2秒後に登場させる
            setTimeout(() => {
                player.round++; // ラウンドを進める
                roundInProgress = false; // ラウンド進行終了フラグをリセット
                startBattle(); // 新しいバトルを開始
            }, 2000);
        });
    });
  });
}

// アラートを表示して指定された時間後に自動で消える関数
function showAlertWithDelay(message, delay, callback) {
  const alertElement = document.createElement('div');
  alertElement.textContent = message;
  alertElement.style.position = 'fixed';
  alertElement.style.top = '50%';
  alertElement.style.left = '50%';
  alertElement.style.transform = 'translate(-50%, -50%)';
  alertElement.style.padding = '20px';
  alertElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  alertElement.style.color = 'white';
  alertElement.style.borderRadius = '10px';
  alertElement.style.zIndex = '9999';
  document.body.appendChild(alertElement);

  setTimeout(() => {
      alertElement.remove(); // 1秒後にアラートを削除
      if (callback) callback(); // 次の処理を実行
  }, delay);
}
 
  // 抗菌薬の有効性を確認する関数
  function isAntibioticEffective(bacteria, antibiotic) {
    const resistance = bacteria.resistance[antibiotic];
    
    // 抗菌薬が効果的かどうかをチェックし、ランダムなダメージを返す
    if (resistance && resistance.effective) {
      const minDamage = resistance.damage[0];
      const maxDamage = resistance.damage[1];
      // 最小値から最大値の範囲でランダムなダメージを計算
      const damage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
      return damage;
    }
    
    // 効果がない場合、ダメージは0
    return 0;
  } 
  
  // 抗菌薬の効果に基づいてAWaReとDASCを更新する関数
  function calculateAwareAndDasc(antibiotic) {
    const awareClassification = {
        'アンピシリン': 'access',
        'セファゾリン': 'access',
        'メロペネム': 'watch',
        'バンコマイシン': 'watch',
        'アジスロマイシン': 'watch',
        'シプロフロキサシン': 'watch'
    };
  
    const ascValues = {
        'アンピシリン': 5,
        'セファゾリン': 3,
        'メロペネム': 12,
        'バンコマイシン': 5,
        'アジスロマイシン': 6,
        'シプロフロキサシン': 9
    };
  
    // AWaRe分類の増加
    const classification = awareClassification[antibiotic];  
    player.awareUsage[classification] += 1;
  
    // DASCスコアの更新
    const ascValue = ascValues[antibiotic];
    player.dascScore += ascValue;
  
    // DASCスコアの表示を更新
    document.getElementById('dasc-summary').textContent = `DASC: ${player.dascScore}`;
  
    // 画面更新
    updateAwareAndDasc();  // 攻撃後に常にAWaReとDASCを更新する
  }  
 
// 抗菌薬を使用した後にAWaReとDASCの更新を行う
function attack() {
  const selectedAntibiotic = document.getElementById('antibiotic').value;

  if (player.antibiotics[selectedAntibiotic] <= 0) {
    alert(`${selectedAntibiotic}の残量がありません！`);
    enemyAttack();
    return;
  }

  // 副作用を設定
  if (selectedAntibiotic === 'メロペネム' || selectedAntibiotic === 'バンコマイシン') {
    let hpLoss = Math.floor(Math.random() * 11) + 10; // 10〜20の範囲でランダム
    player.hp -= hpLoss;
    alert(`${selectedAntibiotic}を使用しましたが、副作用でHPが${hpLoss}減少しました。腎機能（eGFR）に注意してください！`);
    if (player.hp < 0) player.hp = 0; // HPが0以下にならないようにする
    updatePlayerGauge(player.hp, player.maxHp); // HPゲージを更新
  }

  // 攻撃前にbacteriaNameForBattleHistoryを決定
  let damage = isAntibioticEffective(currentBacteria, selectedAntibiotic);
  let bacteriaNameForBattleHistory = '';
  if (labotest.identifyCount === 1) {
    bacteriaNameForBattleHistory = currentBacteria.name;
  } else if (labotest.gramStainCount === 1) {
    bacteriaNameForBattleHistory = currentBacteria.gramStain;
  } else {
    bacteriaNameForBattleHistory = '不明な病原体';
  };

  // バトル履歴を更新
  updateBattleHistory(bacteriaNameForBattleHistory, selectedAntibiotic, damage);

  // 攻撃回数をカウント
  player.attackCount++;
  // 培養中の時には培養済みにする
  if(labotest.cultureCount === 1){
    labotest.cultureCount = 2;
    alert('培養結果が出ました。同定をしてください。')
  }

  //geneCheckを使った場合、遅れて検出結果が出る
  if(labotest.geneCount === 1){
    alert('遺伝子検査で'+currentBacteria.name+'が検出されました');
    document.getElementById('geneIdentify').textContent = '遺伝子検査: '+currentBacteria.name; 
    labotest.geneCount ++;
  };

  //VCMの使用履歴
  if (selectedAntibiotic === 'バンコマイシン') {
    vcmUsed ++;
  }

  let bacteriaNameForDisplay = '不明な病原体';  // デフォルトでは「不明な病原体」とする
  let effectivenessMessage = '';
  let bacteriaImageForDisplay = unknownBacteriaImgSrc;

  // 同定結果に基づく表示
  //菌種が同定している時
  if (labotest.identifyCount === 1) {
    bacteriaNameForDisplay = currentBacteria.name;
    bacteriaImageForDisplay = currentBacteria.imgSrc;
  }
  //グラム染色のみわかっている時
  else if (labotest.gramStainCount === 1) {
    bacteriaNameForDisplay = currentBacteria.gramStain;
    bacteriaImageForDisplay = currentBacteria.gramStainImgSrc;
  }    
  // 抗菌薬の有効性をチェック

  effectivenessMessage = damage > 0
    ? `${bacteriaNameForDisplay} に対して ${selectedAntibiotic} が有効だった！`
    : `${bacteriaNameForDisplay} に対して ${selectedAntibiotic} は無効だった！`;
  document.getElementById('enemy-name').textContent = `${bacteriaNameForDisplay}`;
  document.getElementById('message-box1').textContent = effectivenessMessage;
  document.getElementById('bacteria-image').src = bacteriaImageForDisplay;
  bacteriaNameForBattleHistory = bacteriaNameForDisplay;

  // 選択された抗菌薬を反映したメッセージを表示
  document.getElementById('message-box2').textContent = `${selectedAntibiotic}で攻撃しました！`;

  // 抗菌薬を使用
  player.antibiotics[selectedAntibiotic] -= 1;
  updateAntibioticAndItemStatus();

  // 敵にダメージを与える
  currentBacteria.hp = Math.max(0, Math.floor(currentBacteria.hp - damage));
  document.getElementById('enemy-hp').textContent = `HP: ${currentBacteria.hp}`;
  updateGauge(currentBacteria.hp, currentBacteria.maxHp);

  if (currentBacteria.hp === 0) {
    battleWin();
  } else {
    enemyAttack();
  }

  calculateAwareAndDasc(selectedAntibiotic);
}

//報酬増加の計算を関数化して簡潔に
function calculateReward(baseValue, levelMultiplier) {
  return Math.round(baseValue * (1 + (levelMultiplier - 1) * 0.1));
}

// HPに基づいた報酬計算関数
function calculateRewardBasedOnHp(maxHp, multiplier) {
  return Math.round(maxHp * multiplier);
}
  
  // 初期化時にバトル履歴をクリアしてバトルを開始
  document.addEventListener('DOMContentLoaded', () => {
    updatePlayerStats();
    updateAwareAndDasc();
    updatePlayerGauge(player.hp, player.maxHp); // プレイヤーHPゲージを初期化
    startBattle(); // ゲーム開始時にバトルもスタート
    hideTitleAfterDelay(); // タイトルを非表示に
    updateAntibioticAndItemStatus(); // 抗菌薬とアイテムの残量を表示
  });
  
  function hideTitleAfterDelay() {
    setTimeout(() => {
      const gameTitle = document.getElementById('gametitle');
      gameTitle.style.opacity = '0';
      gameTitle.style.transition = 'opacity 1s ease-out'; // フェードアウト効果
  
      // フェードアウト後、要素を完全に削除
      gameTitle.addEventListener('transitionend', () => {
        gameTitle.remove(); // DOMから完全に削除
      });
    }, 2000); // 2秒後に実行
  }



// ページが完全に読み込まれた際に行われる処理を定義
document.addEventListener('DOMContentLoaded', () => {
  updateLifeDisplay();  // 初期化時にライフ表示
  startBattle();  // バトル開始
});

// タブの表示を切り替える関数
function showTab(tabId) {
  const tabs = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabs.length; i++) {
      tabs[i].style.display = 'none';
  }
    document.getElementById(tabId).style.display = 'block';
}

//感受性を変化させる　大腸菌の場合のみ
function updateResistanceForEColi(bacteria) {
  if (bacteria.name === '大腸菌' && bacteria.amrLevel >= 2) {
    // amrLevelが2以上の場合、アンピシリンの有効性をfalseに変更
    bacteria.resistance['アンピシリン'].effective = false;
    bacteria.resistance['アンピシリン'].damage = [0, 0];
    bacteria.susceptibilityState = 'ABPC:R, CEZ:S, MEPM:S, CPFX:S';
  }
  if (bacteria.name === '大腸菌' && bacteria.amrLevel === 3) {
    // amrLevelが3の場合、シプロフロキサシンの有効性をfalseに変更
    bacteria.resistance['シプロフロキサシン'].effective = false;
    bacteria.resistance['シプロフロキサシン'].damage = [0, 0];
    bacteria.susceptibilityState = 'ABPC:R, CEZ:S, MEPM:S, CPFX:R';
  }
  if (bacteria.name === 'ESBL産生菌' && bacteria.amrLevel >= 5) {
    // amrLevelが5の場合、シプロフロキサシンの有効性をfalseに変更
    bacteria.resistance['シプロフロキサシン'].effective = false;
    bacteria.resistance['シプロフロキサシン'].damage = [0, 0];
    bacteria.susceptibilityState = 'ABPC:R, CEZ:R, MEPM:S, CPFX:R';
  }
}

//テスト用の設定
//player.gold = 10000;
//player.expToNextLevel = 100;
//player.level = 7;
//player.labtest = {'グラム染色': 100, '培養':100, '同定':100, '感受性':100, '尿中抗原':100,'geneCheck':100, 'geneQuick':100, 'TDM':100},
//player.hp= 10000;
//player.maxHp = 10000;
//player.life = 5;
//player.antibiotics = { 'アンピシリン': 1000, 'セファゾリン': 1000, 'メロペネム': 1000, 'バンコマイシン': 1000, 'アジスロマイシン': 1000, 'シプロフロキサシン': 1000  };
//player.antibiotics = { 'アンピシリン': 10, 'アンピシリン/スルバクタム': 0, 'セファゾリン': 10, 'メロペネム': 10, 'バンコマイシン': 10, 'リネゾリド': 0, 'ダプトマイシン': 0, 'クラリスロマイシン': 0, 'アジスロマイシン': 10, 'シプロフロキサシン': 0, 'レボフロキサシン': 0, 'ラスクフロキサシン': 0, '2HREZ/4HR': 0};