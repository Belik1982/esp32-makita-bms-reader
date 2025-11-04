// data/app.js - ИСПРАВЛЕННАЯ ВЕРСИЯ (ФИКС СЛИЯНИЯ lastData, ФИКС ВИЗУАЛИЗАЦИИ 0V, ФИКС ОТОБРАЖЕНИЯ ТЕМПЕРАТУРЫ)

const LANGS = {
  ua: {
    subtitle: "Діагностика батареї",
    sectionTitle: "Параметри батареї",
    rawTitle: "Журнал",
    footerText: "Версія: ESP-OBI Web UI",
    readStatic: "1. Зчитати Інфо",
    readDynamic: "2. Оновити дані",
    hintReadStatic: "Визначити модель та зчитати статичні дані",
    hintReadDynamic: "Зчитати напругу та температуру",
    clearErrors: "Очистити помилки",
    hintClear: "Скинути помилки BMS",
    ledTest: "Тест LED",
    hintLed: "Увімкнути/вимкнути LED",
    refresh: "Оновити статус",
    logPreamble: "Ініціалізація...",
    uiReady: "Інтерфейс готовий",
    batteryConnected: "Батарея: підключена",
    batteryNot: "Батарея: не виявлена",
    reading: "Зчитування...",
    ledOn: "LED увімкнено",
    ledOff: "LED вимкнено",
    cell: "Ячейка",
    alertImbalanceTitle: "<b>⚠️ Розбаланс!</b>",
    alertImbalanceBody: "Різниця між ячейками перевищує 0.1 В. Рекомендується балансування.",
    alertCritLowTitle: "<b>❌ Критично низька напруга!</b>",
    alertCritLowBody: "Напруга на одній з ячейок нижче 2.5 В. Ймовірно, елемент деградував.",
    alertLimitedSupportTitle: "<b>ℹ️ Обмежена підтримка</b>",
    alertLimitedSupportBody: "Для цієї моделі батареї сервісні функції не підтримуються, тому блок приховано.",
    alertAllGood: "Всі параметри в нормі",
    packSummary: "Загальна напруга:",
    soc: "Рівень заряду:",
    delta: "Розбаланс:",
    locked: "Заблоковано",
    unlocked: "Розблоковано",
    // Перевод параметров
    model: "Модель",
    cycles: "Цикли заряду",
    state: "Стан",
    statusCode: "Код статусу",
    mfg_date: "Дата виготовлення",
    capacity: "Ємність",
    connecting: "З'єднання...",
    reconnecting: "Втрачено. Перепідключення...",
    // --- NEW TEMPERATURE KEYS ---
    tempBMS: "Температура BMS",
    tempCell1: "Температура 1",
    tempCell2: "Температура 2",
    // --- NEW CRITICAL ALERTS KEYS ---
    alertCritZeroV: "<b>Несправність батареї!</b> Одна або більше ячейок мають напругу 0 В. Подальша діагностика не має сенсу.",
    alertAllLowV: "<b>Критично низька напруга!</b> Всі ячейки мають напругу нижче 0.5 В. Елементи, ймовірно, деградували.",
  },
  ru: {
    subtitle: "Диагностика батареи",
    sectionTitle: "Параметры батареи",
    rawTitle: "Журнал",
    footerText: "Версия: ESP-OBI Web UI",
    readStatic: "1. Считать Инфо",
    readDynamic: "2. Обновить данные",
    hintReadStatic: "Определить модель и считать статические данные",
    hintReadDynamic: "Считать напряжение и температуру",
    clearErrors: "Очистить ошибки",
    hintClear: "Сбросить ошибки БМС",
    ledTest: "Тест LED",
    hintLed: "Включить/выключить LED",
    refresh: "Обновить статус",
    logPreamble: "Инициализация...",
    uiReady: "Интерфейс готов",
    batteryConnected: "Батарея: подключена",
    batteryNot: "Батарея: не обнаружена",
    reading: "Чтение...",
    ledOn: "LED включён",
    ledOff: "LED выключен",
    cell: "Ячейка",
    alertImbalanceTitle: "<b>⚠️ Разбаланс!</b>",
    alertImbalanceBody: "Разница между ячейками превышает 0.1 В. Рекомендуется балансировка.",
    alertCritLowTitle: "<b>❌ Критически низкое напряжение!</b>",
    alertCritLowBody: "Напряжение на одной из ячеек ниже 2.5 В. Вероятно, элемент деградировал.",
    alertLimitedSupportTitle: "<b>ℹ️ Ограниченная поддержка</b>",
    alertLimitedSupportBody: "Для этой модели батареи сервисные функции не поддерживаются, поэтому блок скрыт.",
    alertAllGood: "Все параметры в норме",
    packSummary: "Общее напряжение:",
    soc: "Уровень заряда:",
    delta: "Разбаланс:",
    locked: "Заблокирован",
    unlocked: "Разблокирован",
    // Перевод параметров
    model: "Модель",
    cycles: "Циклы заряда",
    state: "Состояние",
    statusCode: "Код статуса",
    mfg_date: "Дата производства",
    capacity: "Ёмкость",
    connecting: "Соединение...",
    reconnecting: "Потеряно. Переподключение...",
    // --- NEW TEMPERATURE KEYS ---
    tempBMS: "Температура BMS",
    tempCell1: "Температура 1",
    tempCell2: "Температура 2",
    // --- NEW CRITICAL ALERTS KEYS (FIXED PHRASE) ---
    alertCritZeroV: "<b>Неисправность батареи!</b> Одна или более ячеек имеют напряжение 0 В. Дальнейшая диагностика не имеет смысла.",
    alertAllLowV: "<b>Критически низкое напряжение!</b> Все ячейки имеют напряжение ниже 0.5 В. Элементы, вероятно, деградировали.",
  },
  en: {
    subtitle: "Battery Diagnostics",
    sectionTitle: "Battery Parameters",
    rawTitle: "Log",
    footerText: "Version: ESP-OBI Web UI",
    readStatic: "1. Read Info",
    readDynamic: "2. Update Data",
    hintReadStatic: "Identify model and read static data",
    hintReadDynamic: "Read voltages and temperatures",
    clearErrors: "Clear Errors",
    hintClear: "Reset BMS errors",
    ledTest: "Test LED",
    hintLed: "Turn on/off battery LEDs",
    refresh: "Refresh status",
    logPreamble: "Initializing...",
    uiReady: "Interface ready",
    batteryConnected: "Battery: connected",
    batteryNot: "Battery: not detected",
    reading: "Reading...",
    ledOn: "LED on",
    ledOff: "LED off",
    cell: "Cell",
    alertImbalanceTitle: "<b>⚠️ Imbalance!</b>",
    alertImbalanceBody: "Difference between cells exceeds 0.1 V. Balancing is recommended.",
    alertCritLowTitle: "<b>❌ Critically low voltage!</b>",
    alertCritLowBody: "Voltage on one of the cells is below 2.5 V. The cell has likely degraded.",
    alertLimitedSupportTitle: "<b>ℹ️ Limited Support</b>",
    alertLimitedSupportBody: "Service functions are not supported for this battery model, so the block is hidden.",
    alertAllGood: "All parameters are normal",
    packSummary: "Total voltage:",
    soc: "State of Charge:",
    delta: "Imbalance:",
    locked: "Locked",
    unlocked: "Unlocked",
    // Перевод параметров
    model: "Model",
    cycles: "Charge cycles",
    state: "State",
    statusCode: "Status code",
    mfg_date: "Manufacture date",
    capacity: "Capacity",
    connecting: "Connecting...",
    reconnecting: "Lost. Reconnecting...",
    // --- NEW TEMPERATURE KEYS ---
    tempBMS: "BMS Temperature",
    tempCell1: "Temperature 1",
    tempCell2: "Temperature 2",
    // --- NEW CRITICAL ALERTS KEYS ---
    alertCritZeroV: "<b>Battery defective!</b> One or more cells have 0 V. Further diagnosis is pointless.",
    alertAllLowV: "<b>Critically low voltage!</b> All cells are below 0.5 V. Cells have likely degraded.",
  }
};

let LANG = 'ua';
let lastData = {}; // --- Инициализируем как пустой объект для слияния
let lastFeatures = null;
let ledState = false;
let ws = null;
let reconnectInterval = null;
let lastStatus = null; 
const RECONNECT_DELAY = 3000;

function t(key){ return LANGS[LANG][key] || key; }

const el = id => document.getElementById(id);
const logEl = el('log');

const spinnerHtml = `<span class="spinner"></span>`;

function log(s) {
    if(!logEl) return;
    if(logEl.textContent === t('logPreamble')) logEl.textContent = '';
    logEl.textContent += (new Date().toLocaleTimeString()) + ' - ' + s + '\n';
    logEl.scrollTop = logEl.scrollHeight;
}

function showNotification(message, type, duration = 3000) {
    const notification = el('notification');
    if(!notification) return;
    
    notification.textContent = message;
    notification.className = type;
    notification.style.display = 'block';
    if (duration > 0) setTimeout(() => { notification.style.display = 'none'; }, duration);
}

function updateStatusText(statusKey) {
    const statusText = el('statusText');
    if (!statusText) return;
    
    lastStatus = statusKey; 
    statusText.textContent = t(statusKey);
    
    if (statusKey === 'connecting' || statusKey === 'reconnecting' || statusKey === 'batteryNot') {
        statusText.style.color = '#ff9800'; 
    } else if (statusKey === 'batteryConnected' || statusKey === 'uiReady') {
        statusText.style.color = '#2e7d32'; 
    } else {
         statusText.style.color = '#111';
    }
}

function setButtonLoading(id, isLoading, textKey) {
    const btn = el(id);
    if (!btn) return;
    
    if (isLoading) {
        btn.disabled = true;
        btn.setAttribute('data-original-text', btn.textContent); 
        btn.innerHTML = spinnerHtml + t(textKey);
    } else {
        btn.innerHTML = btn.getAttribute('data-original-text') || t(textKey);
        btn.removeAttribute('data-original-text');
    }
}

function sendCommand(cmd, data = {}) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ command: cmd, ...data }));
    } else {
        log(t('reconnecting'));
        showNotification(t('reconnecting'), 'danger', 0);
    }
}

function connect() {
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
    
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    log(t('connecting'));
    updateStatusText('connecting'); 
    
    ws = new WebSocket(`ws://${window.location.hostname}/ws`);
    
    ws.onopen = () => { 
        log(t('uiReady')); 
        updateStatusText('uiReady'); 
        if (reconnectInterval) clearInterval(reconnectInterval);
    };

    ws.onclose = () => { 
        log("WebSocket connection closed."); 
        updateStatusText('reconnecting'); 
        showNotification(t('reconnecting'), 'danger', 0); 
        
        if (!reconnectInterval) {
            reconnectInterval = setInterval(connect, RECONNECT_DELAY);
        }
    };

    ws.onerror = (err) => { 
        log("WebSocket error."); 
        ws.close();
    };

    ws.onmessage = handleWebSocketMessage;
}


function handleWebSocketMessage(event) {
    try {
        const msg = JSON.parse(event.data);
        
        if (msg.type !== 'presence' && msg.type !== 'debug') {
             ['btnReadStatic', 'btnReadDynamic', 'btnClearErrors', 'btnLed'].forEach(id => {
                 const btn = el(id);
                 if (btn && btn.getAttribute('data-original-text')) {
                     btn.innerHTML = btn.getAttribute('data-original-text');
                     btn.removeAttribute('data-original-text');
                     btn.disabled = false; 
                 }
             });
        }
        
        showNotification('', 'info', 1);

        if (msg.type === 'debug') { 
            log(msg.message); 
            return; 
        }
        
        if (msg.type === 'error') { 
            log(`ERROR: ${msg.message}`); 
            showNotification(msg.message, 'danger'); 
        }
        else if (msg.type === 'success') { 
            log(`SUCCESS: ${msg.message}`); 
            showNotification(msg.message, 'success'); 
            
            if (msg.message && (msg.message.includes('LED') || msg.message.includes('Светодиод'))) {
                 const newLedState = msg.message.toLowerCase().includes('on') || msg.message.toLowerCase().includes('включен');
                 ledState = newLedState;
                 const btnLed = el('btnLed');
                 if (btnLed) {
                     btnLed.innerHTML = t(ledState ? 'ledTest' : 'ledTest'); 
                 }
            }
        }
        else if (msg.type === 'presence') {
            const statusKey = msg.present ? 'batteryConnected' : 'batteryNot';
            updateStatusText(statusKey); 
        } 
        // --- FIX: Handle Static Data (Merge data, Render table only) ---
        else if (msg.type === 'static_data') {
            const overviewCard = el('overviewCard');
            if (overviewCard) overviewCard.style.display = 'block';
            
            lastData = { ...lastData, ...msg.data }; // Слияние данных
            renderData(lastData); // Рендер таблицы с объединенными данными
            updateButtonStates(msg.features);
            
            // Скрытие/очистка динамических элементов
            const area = el('cellsArea');
            const numbersArea = el('cellsNumbers');
            const summary = el('packSummary');
            if (area) area.style.display = 'none';
            if (numbersArea) numbersArea.style.display = 'none';
            if (summary) summary.style.display = 'none';
            
            const alertsArea = el('alertsArea');
            if(alertsArea) alertsArea.innerHTML = `<div class="alert info">${t('alertAllGood')}</div>`;
            
            log('Static data received.');
            showNotification(t('readStatic') + " OK", 'success');
        } 
        // --- FIX: Handle Dynamic Data (Merge data, Render all) ---
        else if (msg.type === 'dynamic_data') {
            const overviewCard = el('overviewCard');
            if (overviewCard) overviewCard.style.display = 'block';
            
            lastData = { ...lastData, ...msg.data }; // Слияние данных
            renderData(lastData); // Рендер таблицы (включая температуру)
            renderCells(lastData); // Рендер ячеек (напряжения)
            renderAlerts(lastData, lastFeatures); // Рендер предупреждений
            log("Live data updated");
            showNotification(t('readDynamic') + " OK", 'success');
        }
    } catch (e) {
        log("Error parsing WebSocket message: " + e.toString());
        ['btnReadStatic', 'btnReadDynamic', 'btnClearErrors', 'btnLed'].forEach(id => {
            setButtonLoading(id, false, id === 'btnReadStatic' ? 'readStatic' : (id === 'btnReadDynamic' ? 'readDynamic' : (id === 'btnClearErrors' ? 'clearErrors' : 'ledTest')));
        });
    }
}


function setLang(lang){
  if (!LANGS[lang]) lang = 'ua'; 
  LANG = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang').forEach(b=>b.classList.remove('active'));
  
  const activeBtn = el(`btn${lang.toUpperCase()}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  const elements = {
    'subtitle': 'subtitle', 'sectionTitle': 'sectionTitle', 'rawTitle': 'rawTitle',
    'footerText': 'footerText', 'btnReadStatic': 'readStatic', 'btnReadDynamic': 'readDynamic', 'hintReadStatic': 'hintReadStatic',
    'hintReadDynamic': 'hintReadDynamic', 'btnClearErrors': 'clearErrors', 'hintClear': 'hintClear', 
    'btnLed': 'ledTest', 'hintLed': 'hintLed'
  };
  
  for(const id in elements) {
    const element = el(id);
    if(element && !element.querySelector('.spinner')) {
      element.textContent = t(elements[id]);
    }
  }
  
  // Re-render parameters to apply new language strings
  if (lastData) {
      renderData(lastData); 
      
      const area = el('cellsArea');
      if (area && area.style.display === 'flex') {
          renderCells(lastData);
          renderAlerts(lastData, lastFeatures);
      } else {
           const alertsArea = el('alertsArea');
           if(alertsArea) alertsArea.innerHTML = `<div class="alert info">${t('alertAllGood')}</div>`;
      }
  }
  if (lastFeatures) {
      updateButtonStates(lastFeatures);
  }
  
  if (lastStatus) {
      updateStatusText(lastStatus); 
  }
}

function updateButtonStates(features) {
    lastFeatures = features;
    const btnDynamic = el('btnReadDynamic');
    const btnClear = el('btnClearErrors');
    const btnLed = el('btnLed');
    const serviceActions = el('serviceActions'); 

    if (!btnDynamic || !btnClear || !btnLed || !serviceActions) return;

    // --- ФИКС: Активация кнопки "Обновить данные" независимо от сервисных функций ---
    btnDynamic.disabled = !features.read_dynamic;
    if (!btnDynamic.getAttribute('data-original-text')) btnDynamic.innerHTML = t('readDynamic');
    btnDynamic.classList.toggle('btn-data', features.read_dynamic);

    const hasServiceFeatures = features.clear_errors || features.led_test;
    
    // --- ЛОГИКА СКРЫТИЯ/ОТОБРАЖЕНИЯ СЕРВИСНОГО БЛОКА ---
    if (!hasServiceFeatures) {
        serviceActions.style.display = 'none';
    } else {
        serviceActions.style.display = ''; 
        
        // Установка disabled для отдельных сервисных кнопок
        btnClear.disabled = !features.clear_errors;
        btnLed.disabled = !features.led_test;
        
        // Восстановление текста и классов для service buttons
        if (!btnClear.getAttribute('data-original-text')) btnClear.innerHTML = t('clearErrors');
        if (!btnLed.getAttribute('data-original-text')) btnLed.innerHTML = t('ledTest');
        
        btnClear.classList.toggle('btn-service', features.clear_errors);
        btnLed.classList.toggle('btn-func', features.led_test);
    }
    
    const limitedSupportAlert = el('limitedSupportAlert');
    if (limitedSupportAlert) {
        if (features && features.read_dynamic && !hasServiceFeatures) {
            limitedSupportAlert.innerHTML = `${t('alertLimitedSupportTitle')} ${t('alertLimitedSupportBody')}`;
            limitedSupportAlert.style.display = 'block';
        } else {
            limitedSupportAlert.style.display = 'none';
        }
    }
}

function renderData(data) {
    const table = el('data-table');
    if (!table) return;
    
    table.innerHTML = '';
    const createRow = (k, v) => `<div class="kv-row"><div class="k">${k}</div><div class="v">${v}</div></div>`;
    
    if (data.model) table.innerHTML += createRow(t('model'), data.model);
    if (data.charge_cycles !== undefined && data.charge_cycles !== null) table.innerHTML += createRow(t('cycles'), data.charge_cycles);
    
    const state_key = (data.lock_status || '').toLowerCase();
    if (state_key) {
        const state_text = t(state_key);
        const state_class = state_key === 'locked' ? 'badge-danger' : 'badge-success';
        table.innerHTML += createRow(t('state'), `<span class="badge ${state_class}">${state_text}</span>`);
    }
    
    if (data.mfg_date) table.innerHTML += createRow(t('mfg_date'), data.mfg_date);
    if (data.capacity) table.innerHTML += createRow(t('capacity'), data.capacity);
    
    // --- FIX 4: Improved Temperature Rendering Logic ---
    const renderTemp = (key, label) => {
        // key may be a single key string or an array of alternative keys.
        let val = undefined;
        if (Array.isArray(key)) {
            for (let k of key) {
                if (data[k] !== undefined && data[k] !== null && !isNaN(parseFloat(data[k]))) {
                    val = parseFloat(data[k]);
                    break;
                }
            }
        } else {
            if (data[key] !== undefined && data[key] !== null && !isNaN(parseFloat(data[key]))) {
                val = parseFloat(data[key]);
            }
        }
        if (val !== undefined) {
            table.innerHTML += createRow(label, val.toFixed(1) + ' °C');
        }
    };
    
    renderTemp(['temp_bms','temp1'], t('tempBMS'));
    // renderTemp(['temp_cell_1','temp2'], t('tempCell1'));
    // renderTemp(['temp_cell_2','temp2'], t('tempCell2'));
    // --- END FIX 4 ---
}

const socTable = [
    {v: 4.20, soc: 100}, {v: 4.15, soc: 95}, {v: 4.11, soc: 90}, {v: 4.08, soc: 85}, 
    {v: 4.02, soc: 80}, {v: 3.98, soc: 75}, {v: 3.95, soc: 70}, {v: 3.91, soc: 65},
    {v: 3.87, soc: 60}, {v: 3.85, soc: 55}, {v: 3.84, soc: 50}, {v: 3.82, soc: 45},
    {v: 3.80, soc: 40}, {v: 3.79, soc: 35}, {v: 3.77, soc: 30}, {v: 3.75, soc: 25},
    {v: 3.73, soc: 20}, {v: 3.71, soc: 15}, {v: 3.69, soc: 10}, {v: 3.61, soc: 5},
    {v: 3.27, soc: 0}
];

function getSoC(voltage) {
    if (voltage >= socTable[0].v) return 100;
    if (voltage <= socTable[socTable.length - 1].v) return 0;
    
    for (let i = 0; i < socTable.length - 1; i++) {
        if (voltage <= socTable[i].v && voltage >= socTable[i + 1].v) {
            const upper = socTable[i];
            const lower = socTable[i + 1];
            const range = upper.v - lower.v;
            const socRange = upper.soc - lower.soc;
            const v_delta = voltage - lower.v;
            return Math.round(lower.soc + (v_delta / range) * socRange);
        }
    }
    return 0;
}

function renderCells(data){
  const area = el('cellsArea');
  const numbersArea = el('cellsNumbers');
  const summary = el('packSummary');
  
  if (!area || !numbersArea || !summary) return;
  
  if (data && data.cell_voltages && data.cell_voltages.length > 0) {
    area.innerHTML = '';
    numbersArea.innerHTML = '';
    summary.innerHTML = '';
    // Show visualization elements now that dynamic data is loaded
    area.style.display = 'flex';
    numbersArea.style.display = 'flex';
    summary.style.display = 'block';

    const voltages = data.cell_voltages;
    // Live voltages (for SoC/Delta calculation)
    const live_voltages = voltages.filter(v => v > 0.5);
    
    if (voltages.length === 0) return;

    let maxV = 0, minV = 0, deltaV = 0, imbalance = false, critLow = false, avgVoltage = 0, socPercent = 0;
    
    if (live_voltages.length > 0) {
        maxV = Math.max(...live_voltages);
        minV = Math.min(...live_voltages);
        deltaV = maxV - minV;
        imbalance = deltaV > 0.1;
        critLow = minV < 2.5; 
        avgVoltage = live_voltages.reduce((a,b) => a+b, 0) / live_voltages.length;
    }
    
    const connectorsContainer = document.createElement('div');
    connectorsContainer.className = 'battery-connectors';
    area.appendChild(connectorsContainer);
    
    for (let i = 0; i < 5; i++) {
      const v = voltages[i] || 0;
      // Ячейки 2 и 4 перевернуты для Z-схемы
      const isFlipped = (i + 1) % 2 === 0; 
      
      const container = document.createElement('div');
      container.className = 'cell-container';
      if(isFlipped) container.classList.add('flipped');

      let cellHTML = `
        <div class="cell-gfx" id="cell-${i}">
          <div class="cell-cap"></div>
          <div class="cell-gfx-content">
            <div class="cell-pole">+</div>
            <div class="cell-gfx-vol">${v > 0.001 ? v.toFixed(3) + ' V' : '0.000 V'}</div> 
            <div class="cell-pole">-</div>
          </div>
        </div>
      `;
      container.innerHTML = cellHTML;
      const cellDiv = container.querySelector('.cell-gfx');

      // --- FIX 3: New Dead Cell Visualization ---
      if (v > 0.001) { // --- Ячейка ЖИВА ---
          const health = Math.max(0, Math.min(1, (v - 2.8) / (4.2 - 2.8)));
          const hue = health * 120;
          
          if (imbalance && v === minV) {
              cellDiv.classList.add('imbalanced');
          } 
          
          // Animate if critically low (but not dead)
          if (critLow && v === minV) { 
              cellDiv.classList.add('crit-low-animated');
          } else if (!cellDiv.classList.contains('imbalanced')) {
              cellDiv.style.backgroundColor = `hsl(${hue}, 85%, 70%)`;
          }
      } else {
           // --- Ячейка МЕРТВА (0V) ---
           cellDiv.classList.add('dead-cell'); // Применяем класс с крестом
      }
      // --- END FIX 3 ---

      area.appendChild(container);
      
      const numberElement = document.createElement('div');
      numberElement.className = 'cell-number';
      numberElement.textContent = i + 1;
      numbersArea.appendChild(numberElement);
    }
    
    // ПЕРЕРИСОВКА ПЕРЕМЫЧЕК
    setTimeout(() => renderConnectors(), 10);
    
    if(data.pack_voltage && live_voltages.length > 0) {
      socPercent = getSoC(avgVoltage);
      let summaryHTML = `${t('packSummary')} <strong>${data.pack_voltage.toFixed(3)} V</strong> | ${t('soc')} <strong class="soc">${socPercent}%</strong>`;
      
      summaryHTML += `
          <div class="soc-bar-container">
              <div class="soc-bar-value" style="width: ${socPercent}%;"></div>
          </div>
      `;
      
      if (live_voltages.length > 1) {
        summaryHTML += `<div class="delta-info">${t('delta')} <span class="delta-value">${deltaV.toFixed(3)} V</span></div>`;
      }
      
      summary.innerHTML = summaryHTML;
    } else if (data.pack_voltage) {
        // Show total voltage even if no live cells
        summary.innerHTML = `${t('packSummary')} <strong>${data.pack_voltage.toFixed(3)} V</strong> | ${t('soc')} <strong class="soc">0%</strong>`;
    }
  } else {
    // Hide visualization elements if no dynamic data is present
    area.style.display = 'none';
    numbersArea.style.display = 'none';
    summary.style.display = 'none';
  }
}

function renderConnectors() {
    const connectorsContainer = document.querySelector('.battery-connectors');
    if (!connectorsContainer) return;
    connectorsContainer.innerHTML = '';
    
    const cells = document.querySelectorAll('.cell-container');
    if (cells.length < 2) return;

    const containerRect = connectorsContainer.parentElement.getBoundingClientRect();
    
    for (let i = 0; i < cells.length - 1; i++) {
        const cell1 = cells[i].getBoundingClientRect();
        const cell2 = cells[i + 1].getBoundingClientRect();

        // 1. Координаты X центра каждой ячейки (относительно контейнера)
        const x1 = cell1.left + cell1.width / 2 - containerRect.left;
        const x2 = cell2.left + cell2.width / 2 - containerRect.left;
        
        // 2. Определяем, должно ли соединение быть СВЕРХУ или СНИЗУ (Z-схема: 1-2 TOP, 2-3 BOTTOM, 3-4 TOP, 4-5 BOTTOM)
        const isTopConnection = i % 2 === 0; 
        
        // 3. Рассчитываем общую координату Y для горизонтальной линии
        let y_conn;
        if (isTopConnection) {
            y_conn = cell1.top - containerRect.top; // Верхний край ячейки
        } else {
            y_conn = cell1.top + cell1.height - containerRect.top; // Нижний край ячейки
        }

        // --- Горизонтальный соединитель ---
        const connector = document.createElement('div');
        connector.className = 'connector';
        connector.style.width = `${Math.abs(x2 - x1)}px`;
        connector.style.left = `${Math.min(x1, x2)}px`;
        // Размещаем линию (4px) по центру y_conn
        connector.style.top = `${y_conn - 2}px`; 
        connectorsContainer.appendChild(connector);
        
        // 4. Вертикальные соединители (должны охватывать всю высоту ячеек, для Z-визуализации)
        const y_top_span = cell1.top - containerRect.top;
        const v_height = cell1.height + 4; // Высота ячейки + 4px для перекрытия (по 2px сверху и снизу)

        // Вертикальная линия 1 (Ячейка i)
        const vConnector1 = document.createElement('div');
        vConnector1.className = 'connector';
        vConnector1.style.width = `4px`; 
        vConnector1.style.left = `${x1 - 2}px`;
        vConnector1.style.top = `${y_top_span - 2}px`;
        vConnector1.style.height = `${v_height}px`;
        connectorsContainer.appendChild(vConnector1);
        
        // Вертикальная линия 2 (Ячейка i+1)
        const vConnector2 = document.createElement('div');
        vConnector2.className = 'connector';
        vConnector2.style.width = `4px`; 
        vConnector2.style.left = `${x2 - 2}px`;
        // Используем те же координаты Y для span, так как ячейки одной высоты
        vConnector2.style.top = `${y_top_span - 2}px`; 
        vConnector2.style.height = `${v_height}px`;
        connectorsContainer.appendChild(vConnector2);
    }
}

function renderAlerts(data, features = null) {
    const alertsArea = el('alertsArea');
    if (!alertsArea) return;
    alertsArea.innerHTML = '';

    if (!data || !data.cell_voltages || data.cell_voltages.length === 0) {
        alertsArea.innerHTML = `<div class="alert info">${t('alertAllGood')}</div>`;
        return;
    }
    
    const all_voltages = data.cell_voltages;
    // Live voltages (for imbalance/SoC calculation)
    const live_voltages = all_voltages.filter(v => v > 0.5); 
    
    let hasAlert = false;

    // --- Critical Zero V Check (0V) with updated phrase ---
    const hasZeroVCell = all_voltages.some(v => v < 0.001); 
    if (hasZeroVCell) {
        alertsArea.innerHTML += `<div class="alert danger">${t('alertCritZeroV')}</div>`;
        hasAlert = true;
    }
    
    // --- All Cells Critically Low (< 0.5V) ---
    if (live_voltages.length === 0 && all_voltages.length > 0 && !hasZeroVCell) {
         alertsArea.innerHTML += `<div class="alert danger">${t('alertAllLowV')}</div>`;
         hasAlert = true;
    }


    if (live_voltages.length > 1) { // Check imbalance and low voltage only on living cells
        const maxV = Math.max(...live_voltages);
        const minV = Math.min(...live_voltages);
        const deltaV = maxV - minV;

        // 1. Критически низкое напряжение (на живых ячейках)
        if (minV < 2.5) {
            alertsArea.innerHTML += `<div class="alert danger">${t('alertCritLowTitle')} ${t('alertCritLowBody')}</div>`;
            hasAlert = true;
        }

        // 2. Разбаланс (на живых ячейках)
        if (deltaV > 0.1) {
             alertsArea.innerHTML += `<div class="alert warn">${t('alertImbalanceTitle')} ${t('alertImbalanceBody')}</div>`;
            hasAlert = true;
        }
    }
    
    if (!hasAlert) {
        alertsArea.innerHTML += `<div class="alert info">${t('alertAllGood')}</div>`;
    }
}


// Инициализация при загрузке
window.addEventListener('load', ()=>{
    updateButtonStates({ read_dynamic: false, led_test: false, clear_errors: false });
    
    const btnEN = el('btnEN');
    const btnUA = el('btnUA');
    const btnRU = el('btnRU');
    const btnReadStatic = el('btnReadStatic');
    const btnReadDynamic = el('btnReadDynamic');
    const btnClearErrors = el('btnClearErrors');
    const btnLed = el('btnLed');
    
    if (btnEN) btnEN.addEventListener('click', ()=>setLang('en'));
    if (btnUA) btnUA.addEventListener('click', ()=>setLang('ua'));
    if (btnRU) btnRU.addEventListener('click', ()=>setLang('ru'));
    
    if (btnReadStatic) {
        btnReadStatic.addEventListener('click', () => { 
            log(t('reading')); 
            setButtonLoading('btnReadStatic', true, 'reading');
            sendCommand('read_static'); 
        });
    }
    
    if (btnReadDynamic) {
        btnReadDynamic.addEventListener('click', () => { 
            log(t('reading')); 
            setButtonLoading('btnReadDynamic', true, 'reading');
            sendCommand('read_dynamic'); 
        });
    }
    
    if (btnClearErrors) {
        btnClearErrors.addEventListener('click', () => { 
             setButtonLoading('btnClearErrors', true, 'clearErrors');
             sendCommand('clear_errors'); 
        });
    }
    
    if (btnLed) {
        btnLed.addEventListener('click', () => {
            ledState = !ledState;
            setButtonLoading('btnLed', true, ledState ? 'ledOn' : 'ledOff');
            sendCommand(ledState ? 'led_on' : 'led_off');
        });
    }
    
    const navLang = (navigator.language || '').toLowerCase();
    let defaultLang = 'ua'; 
    if (navLang.startsWith('ru')) {
        defaultLang = 'ru';
    } else if (navLang.startsWith('en')) {
        defaultLang = 'en';
    }
    setLang(defaultLang);
    
    if(logEl) logEl.textContent = t('logPreamble');
    
    connect();
});

window.addEventListener('resize', () => {
    if (lastData) {
        // Redraw cells only if the visualization is currently active (dynamic data was loaded)
        const area = el('cellsArea');
        if (area && area.style.display === 'flex') {
             renderCells(lastData);
        }
    }
});