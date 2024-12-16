#version 330 core

#define maxLights 10

// Input vertex data
layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec3 tangent;
layout(location = 4) in vec3 bitangent;

// Output data
out vec2 UV;
out vec3 fragmentPosition;
out vec3 lightPositions[maxLights];
out vec3 lightDirections[maxLights];
out vec3 Normal;

// Structs
struct Light
{
    vec3 position;
    vec3 direction;
    vec3 colour;
    float linear, quadratic, constant;
    float cosPhi;
};

// Uniforms
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform Light lights[maxLights];
uniform int numPoint;
uniform int numSpot;
uniform int numDir;

void main()
{
    // Output vertex position
    gl_Position = projection * view * model * vec4(position, 1.0);
    
    // Output (u,v) co-ordinates
    UV = uv;
    
    // Calculate the TBN matrix that transforms view space to tangent space
    mat3 normalMatrix = transpose(inverse(mat3(view * model)));
    vec3 T = normalize(normalMatrix * tangent);
    vec3 N = normalize(normalMatrix * normal);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);
    mat3 TBN = transpose(mat3(T, B, N));
    
    // Output tangent space fragment position
    fragmentPosition = TBN * vec3(view * model * vec4(position, 1.0));

    // Output tangent space light positions and directions
    for (int i = 0; i < numPoint + numSpot + numDir; i++)
    {
        lightPositions[i] = TBN * vec3(view * vec4(lights[i].position, 1.0));
        lightDirections[i] = TBN * vec3(view * vec4(lights[i].direction, 0.0));
    }
}
