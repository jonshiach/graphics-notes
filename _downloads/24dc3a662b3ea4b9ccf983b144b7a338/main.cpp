#include <iostream>
#include <cmath>

#include <GL/glew.h>
#include <GLFW/glfw3.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtx/io.hpp>

#include "shader.hpp"
#include "camera.hpp"
#include "model.hpp"
#include "maths.hpp"

// Data structures
struct Object
{
    glm::vec3 position = glm::vec3(0.0f, 0.0f, 0.0f);
    glm::vec3 rotation = glm::vec3(0.0f, 1.0f, 0.0f);
    glm::vec3 scale = glm::vec3(1.0f, 1.0f, 1.0f);
    float angle = 0.0f;
    float ka = 0.2f;
    float kd = 0.7f;
    float ks = 1.0f;
    float Ns = 20.0f;
    std::string name;
};

// Create camera object
Camera camera(glm::vec3(0.0f, 0.0f, 5.0f));

// Timers
float currentTime = 0.0f;
float lastTime = 0.0f;
float deltaTime = 0.0f;

int main( void )
{
    // Initialise GLFW
    if( !glfwInit() )
    {
        fprintf( stderr, "Failed to initialize GLFW\n" );
        getchar();
        return -1;
    }

    glfwWindowHint(GLFW_SAMPLES, 4);
    glfwWindowHint(GLFW_RESIZABLE,GL_FALSE);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); // To make MacOS happy; should not be needed
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Open a window and create its OpenGL context
    GLFWwindow* window = glfwCreateWindow( 1024, 768, "Quaternions", NULL, NULL);
    if( window == NULL ){
        fprintf( stderr, "Failed to open GLFW window. If you have an Intel GPU, they are not 3.3 compatible.");
        getchar();
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    // Initialize GLEW
    glewExperimental = true; // Needed for core profile
    if (glewInit() != GLEW_OK) {
        fprintf(stderr, "Failed to initialize GLEW\n");
        getchar();
        glfwTerminate();
        return -1;
    }

    // Enable depth test
    glEnable(GL_DEPTH_TEST);

    // Use back face culling
    glEnable(GL_CULL_FACE);

    // Ensure we can capture the escape key being pressed below
    glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);

    // Tell GLFW to capture our mouse
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    glfwPollEvents();
    glfwSetCursorPos(window, 1024/2, 768/2);

   // Compile shader programs
    GLuint shaderID = LoadShaders("vertexShader.vert", "fragmentShader.frag");
    
    // Load models
    Model cube("../objects/cube.obj");
    Model suzanne("../objects/suzanne.obj");
    cube.addTexture("../objects/crate.bmp", "diffuse");
    suzanne.addTexture("../objects/suzanne_diffuse.png", "diffuse");
                 
    // Cube positions
    glm::vec3 cubePositions[] = {
        glm::vec3( 0.0f,  0.0f,  0.0f),
        glm::vec3( 2.0f,  5.0f, -10.0f),
        glm::vec3(-3.0f, -2.0f, -3.0f),
        glm::vec3(-4.0f, -2.0f, -8.0f),
        glm::vec3( 2.0f, -1.0f, -4.0f),
        glm::vec3(-4.0f,  3.0f, -8.0f),
        glm::vec3( 3.0f, -2.0f, -5.0f),
        glm::vec3( 4.0f,  2.0f, -5.0f),
        glm::vec3( 2.0f,  0.0f, -2.0f),
        glm::vec3(-1.0f,  1.0f, -2.0f)
    };
    
    // Define objects
    std::vector<Object> objects;
    Object object;
    object.name = "cube";
    object.scale = glm::vec3(0.5f, 0.5f, 0.5f);
    object.rotation = glm::vec3(1.0f, 1.0f, 0.0f);
    for (unsigned int i = 0; i < 10; i++)
    {
        object.position = cubePositions[i];
        object.angle = glm::radians(30.0f * i);
        objects.push_back(object);
    }
    
    do {
        // Update timers
        currentTime = glfwGetTime();
        deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Background colour
        glm::vec3 bgColour = glm::vec3(0.2f, 0.2f, 0.2f);
        glClearColor(bgColour[0], bgColour[1], bgColour[2], 1.0f);
        
        // Clear the window
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        
        // Toggle between first and third person camera
        if (glfwGetKey(window, GLFW_KEY_1) && camera.mode == "third")
        {
            camera.mode = "first";
            camera.yaw = camera.charYaw;
        }
        
        if (glfwGetKey(window, GLFW_KEY_2) && camera.mode == "first")
        {
            camera.mode = "third";
            camera.charYaw = camera.yaw;
        }
        
        // Calculate view and projection matrices
        glm::mat4 view;
        glm::mat4 projection;
        if (camera.mode == "first")
            camera.calculateMatrices(window, deltaTime);
        if (camera.mode == "third")
            camera.thirdPersonCamera(window, deltaTime);
        
        view = camera.getViewMatrix();
        projection = camera.getProjectionMatrix();
        
        // Activate shader
        glUseProgram(shaderID);
        
        // Send camera position, view and projection matrices to the shader
        glUniformMatrix4fv(glGetUniformLocation(shaderID, "view"), 1, GL_FALSE, &view[0][0]);
        glUniformMatrix4fv(glGetUniformLocation(shaderID, "projection"), 1, GL_FALSE, &projection[0][0]);
        
        // Loop through the objects
        for (unsigned int i = 0; i < objects.size(); i++)
        {
            // Calculate model matrix
            glm::mat4 translate = Maths::translate(glm::mat4(1.0f), objects[i].position);
            glm::mat4 scale = Maths::scale(glm::mat4(1.0f), objects[i].scale);
            glm::mat4 rotate = Maths::rotate(glm::mat4(1.0f), objects[i].angle, objects[i].rotation);
            glm::mat4 model = translate * rotate * scale;
            
            // Send the model matrix to the shader
            glUniformMatrix4fv(glGetUniformLocation(shaderID, "model"), 1, GL_FALSE, &model[0][0]);
            
            // Draw the model
            if (objects[i].name == "cube")
                cube.draw(shaderID);
        }
        
        // Draw suzanne model in third person camera mode
        if (camera.mode == "third")
        {
            // Calculate model matrix
            glm::mat4 translate = Maths::translate(glm::mat4(1.0f), camera.position);
            glm::mat4 scale = Maths::scale(glm::mat4(1.0f), glm::vec3(0.2f, 0.2f, 0.2f));
            glm::mat4 rotate = glm::transpose(camera.charDirection.mat());
            glm::mat4 model = translate * rotate * scale;
            
            // Send the model matrix to the shader
            glUniformMatrix4fv(glGetUniformLocation(shaderID, "model"), 1, GL_FALSE, &model[0][0]);
            
            // Draw the model
            suzanne.draw(shaderID);
        }
        
        // Swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // Check if the ESC key was pressed or the window was closed
    while( glfwGetKey(window, GLFW_KEY_ESCAPE ) != GLFW_PRESS &&
           glfwWindowShouldClose(window) == 0 );

    // Close OpenGL window and terminate GLFW
    glfwTerminate();

    return 0;
}
