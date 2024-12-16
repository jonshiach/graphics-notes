#include <iostream>
#include <glm/glm.hpp>
#include <cmath>

#include "maths.hpp"

// Convert an angle from degrees to radians
float Maths::radians(const float angle)
{
}

// Calculate the norm of a vector
float Maths::length(const glm::vec3 vec)
{
}

// Normalise a vector
glm::vec3 Maths::normalize(const glm::vec3 vec)
{
}

// Transpose a 4x4 matrix
glm::mat4 Maths::transpose(const glm::mat4 mat)
{
}

// Calculate the translation matrix
glm::mat4 Maths::translate(const glm::mat4 mat, const glm::vec3 t)
{
}

// Calculate the scaling matrix
glm::mat4 Maths::scale(const glm::mat4 mat, const glm::vec3 s)
{
}

// Calculate the rotation matrix
glm::mat4 Maths::rotate(const glm::mat4 mat, const float angle, const glm::vec3 vec)
{
}

// Calculate view matrix
glm::mat4 Maths::lookAt(const glm::vec3 position, const glm::vec3 target, const glm::vec3 up)
{
}

// Calculate perspective projection matrix
glm::mat4 Maths::perspective(const float fov, const float aspect, const float near, const float far)
{
}
