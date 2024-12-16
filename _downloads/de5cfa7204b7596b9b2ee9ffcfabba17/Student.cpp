#include "Student.hpp"
#include <iostream>

Student::Student(
                 const std::string firstNameInput,
                 const std::string lastNameInput,
                 const int idNumberInput,
                 const std::string courseInput,
                 const int levelInput)
{
    firstName = firstNameInput;
    lastName = lastNameInput;
    idNumber = idNumberInput;
    course = courseInput;
    level = levelInput;
    
    std::cout << "\nStudent object " << firstName << " " << lastName << " created." << std::endl;
}

void Student::addLevelMarks(const int marksInput[], const int levelInput)
{
    for (int i = 0; i < 4; i++)
    {
        marks[4 * (levelInput - 4) + i] = marksInput[i];
    }
    
    // Update level if less than levelInput
    if (level < levelInput)
    {
        level = levelInput;
    }
}

void Student::outputMarks()
{
    std::cout << "\n" << firstName << " " << lastName << " (" << idNumber << ")\n" << std::endl;
    
    for (int i = 0; i < level - 3; i++)
    {
        std::cout << "Level " << i + 4 << ": ";
        for (int j = 0; j < 3; j++)
        {
            std::cout << marks[4 * i + j] << ", ";
        }
        std::cout << marks[4 * i + 3] << std::endl;
    }
}

float Student::levelAverage(const int marks[], const int level)
{
    int i = 4 * (level - 4);
    return (marks[i] + marks[i+1] + marks[i+2] + marks[i+3]) / 4.0f;
}

void Student::classification()
{
    int weightedAverage;
    weightedAverage = 0.25 * levelAverage(marks, 5) + 0.75 * levelAverage(marks, 6);
    
    std::cout << "\nClassification: ";
    if (weightedAverage >= 70.0f)
    {
        std::cout << "First-class";
    }
    else if (weightedAverage >= 60.0f)
    {
        std::cout << "Upper second-class";
    }
    else if (weightedAverage >= 50.0f)
    {
        std::cout << "Lower second-class";
    }
    else if (weightedAverage >= 40.0f)
    {
        std::cout << "Third-lcass";
    }
    else
    {
        std::cout << "Fail";
    }
    std::cout << " (weighted average = " << weightedAverage << ")." << std::endl;
}
