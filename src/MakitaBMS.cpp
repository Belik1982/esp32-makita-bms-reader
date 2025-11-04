// src/MakitaBMS.cpp - ИСПРАВЛЕННАЯ ВЕРСИЯ

#include "MakitaBMS.h"

// Конструктор: Просто настраиваем пин, питание по умолчанию ВЫКЛЮЧЕНО
MakitaBMS::MakitaBMS(uint8_t onewire_pin, uint8_t enable_pin) 
    : makita(onewire_pin), _enable_pin(enable_pin) {
    pinMode(_enable_pin, OUTPUT);
    digitalWrite(_enable_pin, HIGH); // HIGH = ВЫКЛ через NPN-транзистор
}

// Вспомогательные функции (без изменений)
void MakitaBMS::setLogCallback(LogCallback callback) { _log = callback; }
void MakitaBMS::setLogLevel(LogLevel level) { _logLevel = level; }
void MakitaBMS::logger(const String& message, LogLevel level) { if (_log && level <= _logLevel) _log(message, level); }
void MakitaBMS::log_hex(const String& prefix, const byte* data, int len) { if (_logLevel < LOG_LEVEL_DEBUG) return; String hex_str = prefix; if (data && len > 0) for (int i = 0; i < len; i++) { char buf[4]; sprintf(buf, "%02X ", data[i]); hex_str += buf; } logger(hex_str, LOG_LEVEL_DEBUG); }
void MakitaBMS::cmd_and_read_cc(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len) { makita.reset(); delayMicroseconds(400); makita.write(0xcc); log_hex(">> CC (payload): ", cmd, cmd_len); if (cmd != nullptr) for (int i = 0; i < cmd_len; i++) { makita.write(cmd[i]); delayMicroseconds(90); } if (rsp != nullptr) for (int i = 0; i < rsp_len; i++) { rsp[i] = makita.read(); delayMicroseconds(90); } log_hex("<< CC (response): ", rsp, rsp_len); }
byte MakitaBMS::nibble_swap(byte b) { return (b >> 4) | (b << 4); }
void MakitaBMS::cmd_and_read_33(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len) {
    makita.reset();
    delayMicroseconds(400);
    makita.write(0x33);
    log_hex(">> 33 (payload): ", cmd, cmd_len);
    byte initial_read[8];
    for (int i = 0; i < 8; i++) { initial_read[i] = makita.read(); delayMicroseconds(90); }
    log_hex("<< 33 (initial 8 bytes): ", initial_read, 8);
    for (int i = 0; i < cmd_len; i++) { makita.write(cmd[i]); delayMicroseconds(90); }
    for (int i = 0; i < rsp_len; i++) { rsp[i] = makita.read(); delayMicroseconds(90); }
    log_hex("<< 33 (response): ", rsp, rsp_len);
}

bool MakitaBMS::isPresent() {
    digitalWrite(_enable_pin, LOW); // Включаем (NPN: LOW=ON)
    delay(400); 
    bool present = makita.reset();
    digitalWrite(_enable_pin, HIGH); // Выключаем (NPN: HIGH=OFF)
    logger(String("Battery presence check: ") + (present ? "Present" : "Not Present"), LOG_LEVEL_INFO);
    return present;
}

String MakitaBMS::readStaticData(BatteryData &data, SupportedFeatures &features) {
    logger("--- Reading Static Data ---", LOG_LEVEL_INFO);
    _is_identified = false;
    
    digitalWrite(_enable_pin, LOW); // ВКЛЮЧАЕМ ПИТАНИЕ В НАЧАЛЕ ОПЕРАЦИИ (NPN: LOW=ON)
    delay(400);

    // --- Оригинальный, рабочий протокол ---
    const byte read_cmd[] = {0xAA, 0x00};
    byte response[40];
    makita.reset(); delayMicroseconds(400); makita.write(0x33);
    log_hex(">> 33 (payload): ", read_cmd, sizeof(read_cmd));
    byte initial_read[8]; for (int i = 0; i < 8; i++) { initial_read[i] = makita.read(); delayMicroseconds(90); }
    log_hex("<< 33 (initial 8 bytes): ", initial_read, 8);
    for (int i = 0; i < sizeof(read_cmd); i++) { makita.write(read_cmd[i]); delayMicroseconds(90); }
    byte remaining_response[32]; for (int i = 0; i < 32; i++) { remaining_response[i] = makita.read(); delayMicroseconds(90); }
    memcpy(response, initial_read, 8);
    memcpy(response + 8, remaining_response, 32);
    log_hex("<< 33 (full response): ", response, 40);

    // --- Оригинальный, рабочий парсинг ---
    byte b1 = nibble_swap(response[35]); byte b2 = nibble_swap(response[34]);
    data.charge_cycles = ((b2 << 8) | b1) & 0x0FFF;
    data.lock_status = (response[28] & 0x0F) > 0 ? "LOCKED" : "UNLOCKED";
    char buf[12]; sprintf(buf, "%02X", response[27]); data.status_code = String(buf);
    sprintf(buf, "%02d/%02d/20%02d", response[2], response[1], response[0]); data.mfg_date = String(buf);
    data.capacity = String(nibble_swap(response[24]) / 10.0f, 1) + "Ah";
    data.battery_type = String(nibble_swap(response[19]));
    String rom_str; for(int i = 0; i < 8; i++) { char rom_buf[4]; sprintf(rom_buf, "%02X ", response[i]); rom_str += rom_buf; }
    data.rom_id = rom_str;
    
    _controller_type = "UNKNOWN"; 
    String model_str = getModel(); 
    if (model_str != "") { _controller_type = "STANDARD"; data.model = model_str; } 
    else { model_str = getF0513Model(); if (model_str != "") { _controller_type = "F0513"; data.model = model_str; } }
    
    if (_controller_type == "UNKNOWN") {
        digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)
        return "Battery connected, but model is not supported."; 
    }

    _is_identified = true; 
    features.read_dynamic = true; 
    if (_controller_type == "STANDARD") { features.led_test = true; features.clear_errors = true; }
    logger("Static data parsed successfully.", LOG_LEVEL_INFO); 
    digitalWrite(_enable_pin, HIGH); // ВЫКЛЮЧАЕМ ПИТАНИЕ В КОНЦЕ ОПЕРАЦИИ (NPN: HIGH=OFF)
    return "";
}

// ====================================================================
// ===                ИЗМЕНЕНИЯ НАЧИНАЮТСЯ ЗДЕСЬ                    ===
// ====================================================================

String MakitaBMS::readDynamicData(BatteryData &data) {
    if (!_is_identified) return "First read battery info to determine model."; 
    logger("--- Reading Dynamic Data ---", LOG_LEVEL_INFO); 
    
    // Выключаем питание по умолчанию перед выбором алгоритма
    digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)

    if (_controller_type == "STANDARD") { 
        // --- Логика STANDARD (нетронутая) ---
        // Включаем питание ОДИН РАЗ
        digitalWrite(_enable_pin, LOW); // (NPN: LOW=ON)
        delay(400);

        byte response[29]; 
        cmd_and_read_cc((const byte[]){0xD7, 0x00, 0x00, 0xFF}, 4, response, sizeof(response)); 
        data.pack_voltage = ((response[1] << 8) | response[0]) / 1000.0f; 
        float min_v=5.0, max_v=0.0; 
        for(int i=0; i<5; i++) { 
            float v=((response[i*2+3]<<8)|response[i*2+2])/1000.0f; 
            data.cell_voltages[i]=v; 
            if (v>0.5 && v<min_v) min_v=v; 
            if (v>max_v) max_v=v; 
        } 
        data.cell_diff = (max_v > min_v) ? (max_v - min_v) : 0.0; 
        data.temp1 = ((response[15] << 8) | response[14]) / 100.0f; 
        data.temp2 = ((response[17] << 8) | response[16]) / 100.0f; 

        // Выключаем питание
        digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)

    } else if (_controller_type == "F0513") {
        // --- Новая логика F0513 (с циклом питания на каждый запрос) ---
        
        const byte clear_cmd[] = {0xF0, 0x00};
        byte response[2]; 
        float v[5]; 
        float t_v = 0;

        // Вспомогательная lambda-функция для выполнения ОДНОЙ команды F0513
        // с полным циклом питания (ВКЛ -> КОМАНДА -> ВЫКЛ)
        auto exec_f0513_cmd = [&](const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len) {
            digitalWrite(_enable_pin, LOW); // (NPN: LOW=ON)
            delay(400);
            
            cmd_and_read_cc(cmd, cmd_len, rsp, rsp_len);
            
            digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)
            delay(50); // Небольшая пауза между циклами для стабилизации
        };

        // Выполняем каждую команду через эту обертку
        exec_f0513_cmd(clear_cmd, sizeof(clear_cmd), nullptr, 0);
        exec_f0513_cmd(clear_cmd, sizeof(clear_cmd), nullptr, 0);
        
        exec_f0513_cmd((const byte[]){0x31}, 1, response, 2); v[0]=((response[1]<<8)|response[0])/1000.0f;
        exec_f0513_cmd((const byte[]){0x32}, 1, response, 2); v[1]=((response[1]<<8)|response[0])/1000.0f;
        exec_f0513_cmd((const byte[]){0x33}, 1, response, 2); v[2]=((response[1]<<8)|response[0])/1000.0f;
        exec_f0513_cmd((const byte[]){0x34}, 1, response, 2); v[3]=((response[1]<<8)|response[0])/1000.0f;
        exec_f0513_cmd((const byte[]){0x35}, 1, response, 2); v[4]=((response[1]<<8)|response[0])/1000.0f;
        exec_f0513_cmd((const byte[]){0x52}, 1, response, 2); data.temp1=((response[1]<<8)|response[0])/100.0f;
        
        data.temp2 = 0; 
        float min_v=5.0, max_v=0.0;
        for(int i=0; i<5; i++) { 
            data.cell_voltages[i]=v[i]; 
            t_v+=v[i]; 
            if(v[i]>0.5 && v[i]<min_v) min_v=v[i]; 
            if(v[i]>max_v) max_v=v[i]; 
        }
        data.pack_voltage = t_v; 
        data.cell_diff = (max_v > 0.5 && max_v > min_v) ? (max_v - min_v) : 0.0;
    }
    
    logger("Dynamic data parsed successfully.", LOG_LEVEL_INFO); 
    // Питание уже выключено в каждой ветке
    return "";
}

// ====================================================================
// ===                 ИЗМЕНЕНИЯ ЗАКАНЧИВАЮТСЯ ЗДЕСЬ                 ===
// ====================================================================


String MakitaBMS::getModel() {
    byte response[16];
    cmd_and_read_cc((const byte[]){0xDC, 0x0C}, 2, response, sizeof(response));
    if (response[0] == 0xFF || response[0] == 0x00) return "";
    char model_str[8]; memcpy(model_str, response, 7); model_str[7] = '\0';
    return String(model_str).c_str();
}

String MakitaBMS::getF0513Model() {
    cmd_and_read_cc((const byte[]){0x99}, 1, nullptr, 0); delay(100);
    makita.reset(); delayMicroseconds(400); makita.write(0x31);
    byte response[2];
    delayMicroseconds(90); response[0] = makita.read(); 
    delayMicroseconds(90); response[1] = makita.read(); 
    const byte clear_cmd[] = {0xF0, 0x00};
    cmd_and_read_cc(clear_cmd, sizeof(clear_cmd), nullptr, 0);
    if (response[0] == 0xFF && response[1] == 0xFF) return "";
    char model_buf[7];
    sprintf(model_buf, "BL%02X%02X", response[1], response[0]);
    return String(model_buf);
}

String MakitaBMS::ledTest(bool on) { 
    if (!_is_identified || _controller_type != "STANDARD") return "Function not available.";
    digitalWrite(_enable_pin, LOW); // (NPN: LOW=ON)
    delay(400);
    byte b[9]; 
    const byte t[]={0xD9,0x96,0xA5}; cmd_and_read_33(t,sizeof(t),b,sizeof(b)); 
    const byte l[]={0xDA,(byte)(on?0x31:0x34)}; cmd_and_read_33(l,sizeof(l),b,sizeof(b)); 
    digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)
    return ""; 
}
String MakitaBMS::clearErrors() { 
    if (!_is_identified || _controller_type != "STANDARD") return "Function not available.";
    digitalWrite(_enable_pin, LOW); // (NPN: LOW=ON)
    delay(400);
    byte b[9]; 
    const byte t[]={0xD9,0x96,0xA5}; cmd_and_read_33(t,sizeof(t),b,sizeof(b)); 
    const byte c[]={0xDA,0x04}; cmd_and_read_33(c,sizeof(c),b,sizeof(b)); 
    digitalWrite(_enable_pin, HIGH); // (NPN: HIGH=OFF)
    return ""; 
}
String MakitaBMS::resetMessage() { return "This feature is currently under development."; }