#pragma once

#include <iostream>

class Car {

public:
    std::string make;
    std::string model;
    int year;
    float speed = 0.0f;

    // Constructor
    Car(const std::string, const std::string, const int);

    // Methods
    void print_details();
    void accelerate(const float);
    static float mph2kph(const float);
};
