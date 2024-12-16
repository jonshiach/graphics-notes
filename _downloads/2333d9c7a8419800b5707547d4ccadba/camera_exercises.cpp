#include <GLFW/glfw3.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

#include "camera.hpp"

Camera::Camera(const glm::vec3 Position)
{
    position = Position;
    front = glm::vec3(0.0f, 0.0f, -1.0f);
    right = glm::vec3(1.0f, 0.0f, 0.0f);
    up = glm::vec3(0.0f, 1.0f, 0.0f);
    worldUp = glm::vec3(0.0, 1.0f, 0.0f);
}

glm::mat4 Camera::getViewMatrix()
{
    return view;
}

glm::mat4 Camera::getProjectionMatrix()
{
    return projection;
}

void Camera::calculateMatrices(GLFWwindow *window, float deltaTime)
{
    // Keyboard inputs
    if (glfwGetKey(window, GLFW_KEY_W))
    {
      position += front * deltaTime * speed; // move forward
    }
    if (glfwGetKey(window, GLFW_KEY_S))
    {
      position -= front * deltaTime * speed; // move backwards
    }
    if (glfwGetKey(window, GLFW_KEY_A))
    {
      position -= right * deltaTime * speed; // move left
    }
    if (glfwGetKey(window, GLFW_KEY_D))
    {
      position += right * deltaTime * speed; // move right
    }
    
    // Exercise 1
    if (jumpTime == 0.0f)
    {
        position.y = 0.0f;
    }
    
    // Exercise 2
    if (glfwGetKey(window, GLFW_KEY_SPACE) && jumpTime == 0.0f)
    {
        jumpTime = 1.0f;
    }
    if (jumpTime > 0.0f)
    {
        position.y = 2.0f * sin(pi * jumpTime);
        jumpTime -= deltaTime;
        if (jumpTime < 0)
        {
            jumpTime = 0.0f;
        }
    }
    
    // Get mouse cursor position
    double xPos, yPos;
    glfwGetCursorPos(window, &xPos, &yPos);
    glfwSetCursorPos(window, 1024/2, 768/2);
    
    // Update yaw and pitch angles
    yaw += mouseSpeed * float(xPos - 1024/2);
    pitch += mouseSpeed * float(yPos - 768/2);
    
    // Update camera vectors
    front = glm::normalize(glm::vec3(cos(pitch) * sin(yaw) , sin(pitch), -cos(yaw) * cos(pitch)));
    right = glm::normalize(glm::cross(front, worldUp));
    up = glm::normalize(glm::cross(right, front));
    
    // Calculate view matrix
    view = glm::lookAt(position, position + front, up);
    
    // Calculate projection matrix
    projection = glm::perspective(fov, aspect, near, far);
}
