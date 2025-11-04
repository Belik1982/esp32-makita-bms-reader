// lib/OneWireMakita/OneWireMakita.h

#ifndef OneWireMakita_h
#define OneWireMakita_h

#include <Arduino.h>

// Класс для реализации модифицированного протокола OneWire для Makita
class OneWireMakita
{
  private:
    gpio_num_t _pin; // Номер GPIO пина, используемого для шины

  public:
    // Конструктор, принимает номер пина
    OneWireMakita(uint8_t pin);
    
    // Выполняет сброс шины и ждет ответа (импульса присутствия)
    bool reset(void);

    // Отправляет один байт данных на шину
    void write(uint8_t v);

    // Читает один байт данных с шины
    uint8_t read(void);
};

#endif