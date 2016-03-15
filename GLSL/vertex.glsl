attribute vec4 coordinate;
uniform mat4 transform;

varying vec3 vNormal;

void main(void) {
    gl_Position = transform * coordinate;
}