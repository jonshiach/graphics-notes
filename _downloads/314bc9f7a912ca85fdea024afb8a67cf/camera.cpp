#include <iostream>
#include <glm/glm.hpp>
#include <glm/gtx/io.hpp>

#include "camera.hpp"

Camera::Camera(const glm::vec3 position)
{
    this->position = position;
    front = glm::vec3(0.0f, 0.0f, -1.0f);
    worldUp = glm::vec3(0.0f, 1.0f, 0.0f);
}

glm::mat4 Camera::getViewMatrix()
{
    return view;
}

glm::mat4 Camera::getProjectionMatrix()
{
    return projection;
}

void Camera::calculateMatrices(GLFWwindow *window, const float deltaTime)
{
    // Keyboard inputs
    if (glfwGetKey(window, GLFW_KEY_W))
        position += front * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_S))
        position -= front * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_A))
        position -= right * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_D))
        position += right * deltaTime * speed;
    
    // Get mouse cursor position
    double xPos, yPos;
    glfwGetCursorPos(window, &xPos, &yPos);
    glfwSetCursorPos(window, 1024/2, 768/2);
    
    // Update yaw and pitch angles
    yaw += mouseSpeed * deltaTime * float(xPos - 1024/2);
    pitch += mouseSpeed * deltaTime * float(yPos - 768/2);

    // Calculate front vector
    front = glm::normalize(glm::vec3(cos(pitch) * sin(yaw) , sin(pitch), -cos(yaw) * cos(pitch)));
    
    // Calculate view matrix
    view = glm::lookAt(position, position + front, worldUp);
    
    // Update camera vectors
    right.x = view[0][0],  right.y = view[1][0],  right.z = view[2][0];
    up.x    = view[0][1],  up.y    = view[1][1],  up.z    = view[2][1];
    
    // Calculate projection matrix
    projection = glm::perspective(fov, aspect, near, far);
}
