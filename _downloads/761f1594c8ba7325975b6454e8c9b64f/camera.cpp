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
    
    if (glfwGetKey(window, GLFW_KEY_Q))
        roll -= 0.5f * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_E))
        roll += 0.5f * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_1) && mode == "third")
        mode = "first";
    
    if (glfwGetKey(window, GLFW_KEY_2) && mode == "first")
        mode = "third";
    
    
    // Get mouse cursor position
    double xPos, yPos;
    glfwGetCursorPos(window, &xPos, &yPos);
    glfwSetCursorPos(window, 1024/2, 768/2);
    
    // Update yaw and pitch angles
    yaw += mouseSpeed * deltaTime * float(xPos - 1024/2);
    pitch += mouseSpeed * deltaTime * float(yPos - 768/2);

    // Calculate direction quaternion
    direction.eulerToQuat(pitch, yaw, roll);
    
    // Calculate view matrix
    view = direction.mat() * Maths::translate(glm::mat4(1.0f), -position);
    
    // Update camera vectors
    right.x = view[0][0],  right.y = view[1][0],  right.z = view[2][0];
    up.x    = view[0][1],  up.y    = view[1][1],  up.z    = view[2][1];
    front.x = -view[0][2], front.y = -view[1][2], front.z = -view[2][2];
    
    // Calculate projection matrix
    projection = glm::perspective(fov, aspect, near, far);
}

void Camera::thirdPersonCamera(GLFWwindow *window, const float deltaTime)
{ 
    // Keyboard inputs
    if (glfwGetKey(window, GLFW_KEY_W))
        position += front * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_S))
        position -= front * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_A))
        charYaw -= 0.5f * deltaTime * speed;

    if (glfwGetKey(window, GLFW_KEY_D))
        charYaw += 0.5f * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_Q))
        roll -= 0.5f * deltaTime * speed;
    
    if (glfwGetKey(window, GLFW_KEY_E))
        roll += 0.5f * deltaTime * speed;
    
    // Get mouse cursor position
    double xPos, yPos;
    glfwGetCursorPos(window, &xPos, &yPos);
    glfwSetCursorPos(window, 1024/2, 768/2);
    
    // Update yaw and pitch angles
    yaw += mouseSpeed * deltaTime * float(xPos - 1024/2);
    pitch += mouseSpeed * deltaTime * float(yPos - 768/2);

    // Calculate direction quaternion
    Quaternion newDirection;
    newDirection.eulerToQuat(pitch, yaw, roll);
    direction = Maths::slerp(direction, newDirection, deltaTime);
    
    // Calculate view matrix
    view = Maths::translate(glm::mat4(1.0f), -offset) * direction.mat() * Maths::translate(glm::mat4(1.0f), -position);
    
    // Update character movement vectors
    charDirection.eulerToQuat(pitch, charYaw, roll);
    glm::mat4 charMat = charDirection.mat();
    right.x = charMat[0][0],  right.y = charMat[1][0],  right.z = charMat[2][0];
    up.x    = charMat[0][1],  up.y    = charMat[1][1],  up.z    = charMat[2][1];
    front.x = -charMat[0][2], front.y = -charMat[1][2], front.z = -charMat[2][2];
    
    // Calculate projection matrix
    projection = glm::perspective(fov, aspect, near, far);
}
