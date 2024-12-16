#pragma once

#include <iostream>

class Student {

public:
    std::string firstName;
    std::string lastName;
    int idNumber;
    std::string course;
    int level;
    int marks[12];
    
    // Constructor
    Student(const std::string firstNameInput,
            const std::string lastNameInput,
            const int idNumberInput,
            const std::string courseInput,
            const int levelInput);
    
    // Methods
    void addLevelMarks(const int[], const int);
    void outputMarks();
    void classification();
    static float levelAverage(const int[], const int);
};
