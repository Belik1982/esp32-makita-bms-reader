// lib/OneWireMakita/OneWireMakita.cpp

#include "OneWireMakita.h"

// Мьютекс для защиты критических секций от прерываний FreeRTOS,
// чтобы гарантировать точность таймингов.
static portMUX_TYPE oneWireMux = portMUX_INITIALIZER_UNLOCKED;

// Конструктор класса
OneWireMakita::OneWireMakita(uint8_t pin) {
    _pin = (gpio_num_t)pin;
    // Настраиваем пин в режим "Open Drain" ОДИН РАЗ.
    // Это самый эффективный и правильный способ для реализации протоколов с одной шиной.
    // digitalWrite(HIGH) "отпускает" шину, позволяя подтягивающему резистору поднять ее.
    // digitalWrite(LOW) активно притягивает шину к земле.
    pinMode(_pin, OUTPUT_OPEN_DRAIN);
    digitalWrite(_pin, HIGH); // Начальное состояние - шина свободна
}

// Реализация сброса шины
bool OneWireMakita::reset(void) {
    digitalWrite(_pin, HIGH);
    pinMode(_pin, INPUT); // Временно переключаем на вход, чтобы проверить, не занята ли шина
    uint8_t retries = 125;
    do {
        if (--retries == 0) return false;
        delayMicroseconds(2);
    } while (digitalRead(_pin) == LOW);

    pinMode(_pin, OUTPUT_OPEN_DRAIN); // Возвращаем в рабочий режим
    
    portENTER_CRITICAL(&oneWireMux);
    digitalWrite(_pin, LOW); // Отправляем импульс сброса
    portEXIT_CRITICAL(&oneWireMux);

    delayMicroseconds(750); // Длительность импульса сброса

    portENTER_CRITICAL(&oneWireMux);
    digitalWrite(_pin, HIGH); // Отпускаем шину
    delayMicroseconds(70);    // Ждем, пока BMS ответит
    uint8_t r = !digitalRead(_pin); // Читаем импульс присутствия (линия должна быть притянута к земле)
    portEXIT_CRITICAL(&oneWireMux);

    delayMicroseconds(410); // Оставшееся время слота
    return r;
}

// Реализация записи байта (побитово)
void OneWireMakita::write(uint8_t v) {
    for (uint8_t bitMask = 0x01; bitMask; bitMask <<= 1) {
        portENTER_CRITICAL(&oneWireMux);
        if ((bitMask & v)) { // Запись '1'
            digitalWrite(_pin, LOW); delayMicroseconds(12);
            digitalWrite(_pin, HIGH);
            portEXIT_CRITICAL(&oneWireMux);
            delayMicroseconds(120);
        } else { // Запись '0'
            digitalWrite(_pin, LOW); delayMicroseconds(100);
            digitalWrite(_pin, HIGH);
            portEXIT_CRITICAL(&oneWireMux);
            delayMicroseconds(30);
        }
    }
}

// Реализация чтения байта (побитово)
uint8_t OneWireMakita::read() {
    uint8_t r = 0;
    for (uint8_t bitMask = 0x01; bitMask; bitMask <<= 1) {
        portENTER_CRITICAL(&oneWireMux);
        digitalWrite(_pin, LOW); delayMicroseconds(10);
        digitalWrite(_pin, HIGH); delayMicroseconds(10);
        if (digitalRead(_pin)) {
            r |= bitMask;
        }
        portEXIT_CRITICAL(&oneWireMux);
        delayMicroseconds(53);
    }
    return r;
}