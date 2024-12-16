#pragma once

#include <glm/glm.hpp>

class Maths
{
public:
    static float radians(const float);
    static float length(const glm::vec3);
    static glm::vec3 normalize(const glm::vec3);
    static glm::mat4 transpose(const glm::mat4);
    static glm::mat4 translate(const glm::mat4, const glm::vec3);
    static glm::mat4 scale(const glm::mat4, const glm::vec3);
    static glm::mat4 rotate(const glm::mat4 mat, const float angle, const glm::vec3 vector);
    static glm::mat4 lookAt(const glm::vec3, const glm::vec3, const glm::vec3);
    static glm::mat4 perspective(const float, const float, const float, const float);
};
