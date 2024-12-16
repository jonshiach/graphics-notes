#pragma once

#include <vector>
#include <string>

#include <GL/glew.h>
#include <glm/glm.hpp>

// Texture struct
struct Texture
{
    unsigned int id;
    std::string type;
};

class Model
{
public:
    // Model attributes
    std::vector<glm::vec3> vertices;
    std::vector<glm::vec2> uvs;
    std::vector<glm::vec3> normals;
    std::vector<Texture> textures;
    std::vector<glm::vec3> tangents;
    
    // Constructor
    Model(const char *path);
    
    // Draw model
    void draw(GLuint &shaderID);
    
    // Add texture
    void addTexture(const char *path, const std::string type);
    
private:
    
    // Array buffers
    GLuint VAO;
    GLuint vertexBuffer;
    GLuint uvBuffer;
    GLuint normalBuffer;
    GLuint tangentBuffer;
    
    // Load .obj file method
    void loadObj(const char *path);
    
    // Setup buffers
    void setupBuffers();
    
    // Load texture
    unsigned int loadTexture(const char *path);
    
    // Calculate tangents and bitangents
    void calculateTangents();
};
