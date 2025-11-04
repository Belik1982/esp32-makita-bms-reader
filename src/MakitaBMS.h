// src/MakitaBMS.h - ФИНАЛЬНАЯ ВЕРСИЯ

#ifndef MAKITA_BMS_H
#define MAKITA_BMS_H

#include <Arduino.h>
#include <functional>
#include "OneWireMakita.h"

// Определяем уровни логирования для более гибкой отладки
enum LogLevel { 
    LOG_LEVEL_NONE,  // Ничего не выводить
    LOG_LEVEL_INFO,  // Только основные события и ошибки
    LOG_LEVEL_DEBUG  // Детальный вывод с HEX-дампами
};

// Определяем тип для функции обратного вызова (callback), которая будет отправлять логи
using LogCallback = std::function<void(const String&, LogLevel)>;

// Структура для хранения ЧИСТЫХ данных
struct BatteryData {
    String model = "N/A";
    int charge_cycles = 0;
    String lock_status = "N/A";
    String status_code = "00";
    float pack_voltage = 0.0;
    float cell_voltages[5] = {0.0};
    float cell_diff = 0.0;
    float temp1 = 0.0, temp2 = 0.0;
    String mfg_date = "N/A";
    String capacity = "N/A", battery_type = "";
    String rom_id = "";
};

// Структура для хранения информации о том, какие функции поддерживает данный аккумулятор
struct SupportedFeatures {
    bool read_dynamic = false;
    bool led_test = false;
    bool clear_errors = false;
};

// Основной класс, инкапсулирующий всю логику работы с BMS
class MakitaBMS {
public:
    MakitaBMS(uint8_t onewire_pin, uint8_t enable_pin);
    void setLogCallback(LogCallback callback);
    void setLogLevel(LogLevel level);

    bool isPresent();
    String readStaticData(BatteryData &data, SupportedFeatures &features);
    String readDynamicData(BatteryData &data);
    String ledTest(bool on);
    String clearErrors();
    String resetMessage();

private:
    OneWireMakita makita;
    uint8_t _enable_pin;
    String _controller_type = "UNKNOWN";
    bool _is_identified = false;
    LogCallback _log;
    LogLevel _logLevel = LOG_LEVEL_DEBUG;
    
    

    byte _response_buf[64];
    void sendCmd(const byte* cmd_data, int len);
    bool readResponse(int len);

    void cmd_and_read_33(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len);
    void cmd_and_read_cc(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len);
    
    byte nibble_swap(byte b);
    String getModel();
    String getF0513Model();

    void logger(const String& message, LogLevel level); 
    void log_hex(const String& prefix, const byte* data, int len);
};

#endif